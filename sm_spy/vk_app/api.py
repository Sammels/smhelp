from datetime import datetime, timedelta
import time
import json
import pytz
import csv

from rest_framework import generics
from django.db.models import Count
from django.db.models.functions import Extract
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseBadRequest, HttpResponseNotFound, HttpResponse
from rest_framework.response import Response

from vk_app.serializers import (GetOverviewUsersSerializer, GetGroupsSerializator, GetGroupsGeographySerializator,
                                GetGroupsIntersectionSerializator, PeopleOnlineSerializator, GetGroupsPostsSerializator,
                                GetActionsSerializator)
from vk_app.models import PersonsGroups, WatchingGroups, PersonGroup, PersonOnline, PostGroup, PersonActions, Store
from vk_app.permissions import IsGroupOwner
from vk_app.celery import vk_checker, vk_people_collect
import vk as vk_api


class GetOverviewUsers(generics.ListAPIView):
    serializer_class = GetOverviewUsersSerializer
    permission_classes = (IsGroupOwner,)

    def get_queryset(self):
        return PersonsGroups.objects.filter(
            group=self.kwargs['group_id']).values('dt_checking').annotate(count=Count('*')).order_by('dt_checking')


class GetOverviewChanginsUsers(generics.ListAPIView):
    permission_classes = (IsGroupOwner,)
    serializer_class = GetGroupsIntersectionSerializator

    def get_queryset(self):
        persons_ids_out = []
        group_id = self.kwargs['group_id']
        prev_person_group = None
        needs_date_string = self.request.GET.get('date')
        needs_date = datetime.strptime(needs_date_string, '%Y-%m-%d')
        dates = [date for date in PersonsGroups.objects.filter(group_id=group_id,
                                                               dt_checking__lte=needs_date).distinct('dt_checking')]
        current_person_group = dates[-1].dt_checking
        try:
            prev_person_group = dates[-2].dt_checking
        except IndexError:
            pass
        current_persons_ids = set([person[0] for person in
                                   PersonsGroups.objects.filter(group_id=group_id,
                                                                dt_checking=current_person_group).values_list('person')])
        if prev_person_group is not None:
            prev_persons_ids = set([person[0] for person in
                                    PersonsGroups.objects.filter(group_id=group_id,
                                                                 dt_checking=prev_person_group).values_list('person')])
            persons_ids_in = current_persons_ids - prev_persons_ids
            persons_ids_out = prev_persons_ids - current_persons_ids
        else:
            persons_ids_in = current_persons_ids
        return PersonGroup.objects.filter(id__in=persons_ids_in), PersonGroup.objects.filter(id__in=persons_ids_out)

    def list(self, request, *args, **kwargs):
        queryset_in, queryset_out = self.get_queryset()

        serializer_in = self.get_serializer(queryset_in, many=True)
        serializer_out = self.get_serializer(queryset_out, many=True)
        return Response({'data_in': serializer_in.data, 'data_out': serializer_out.data})


class GetGroups(generics.ListAPIView):
    serializer_class = GetGroupsSerializator
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        return WatchingGroups.objects.filter(watchers=self.request.user.pk)


class GroupsForceUpdate(generics.CreateAPIView, GetGroups):
    permission_classes = (IsGroupOwner, )

    def post(self, request, *args, **kwargs):
        group = get_object_or_404(WatchingGroups, pk=kwargs['group_id'])
        group.force_update()
        return self.list(request, *args, **kwargs)


class GroupsDelete(generics.DestroyAPIView, GetGroups):
    permission_classes = (IsGroupOwner, )

    def delete(self, request, *args, **kwargs):
        group = get_object_or_404(WatchingGroups, pk=kwargs['group_id'], watchers=request.user)
        group.watchers.remove(request.user)
        return self.list(request, *args, **kwargs)


class AddGroup(generics.CreateAPIView, generics.ListAPIView):
    serializer_class = GetGroupsSerializator
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        return WatchingGroups.objects.filter(watchers=self.request.user.pk)

    def post(self, request, *args, **kwargs):
        group_link = request.POST.get('name')
        session = vk_api.Session()
        api = vk_api.API(session)
        try:
            group_id = group_link.split('/')[-1:][0]
            data = api.groups.getById(group_id=group_id, fields=('members_count',))
            if data[0]['members_count'] > 10000:
                return HttpResponseBadRequest(json.dumps({'error': 'Group has a lot of memebers'}))
            try:
                group = WatchingGroups.objects.get(link=group_link)
            except Exception:
                group = WatchingGroups(link=group_link, name=data[0]['name'], type=data[0]['type'], group_id=data[0]["gid"])
                group.save()
            group.watchers.add(request.user.pk)
            group.save()
        except vk_api.exceptions.VkAPIError:
            return HttpResponseBadRequest()
        vk_checker.delay(group.pk)
        return self.list(request, *args, **kwargs)


class GetGeographyMembers(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = GetGroupsGeographySerializator

    def get_queryset(self):
        members = PersonsGroups.objects.filter(group_id=self.kwargs['pk']).values_list('person_id')
        queryset = PersonGroup.objects.values('city_id', 'city__name').filter(id__in=members).annotate(count=Count('*'))
        return queryset


class GetPeopleOnline(generics.ListAPIView):
    permission_classes = (IsGroupOwner, )
    serializer_class = PeopleOnlineSerializator

    def set_time_zone(self):
        if self.request.COOKIES.get("time_zone") is None:
            return
        timezones = pytz.common_timezones
        for timezoneOne in timezones:
            zone = pytz.timezone(timezoneOne)
            if int(datetime.now(zone).utcoffset().total_seconds()/60/60) == int(self.request.COOKIES.get("time_zone")):
                timezone.activate(pytz.timezone(timezoneOne))
                break

    def get_queryset(self):
        self.set_time_zone()
        last_month = datetime.today() - timedelta(days=30)
        members = PersonsGroups.objects.filter(group_id=self.kwargs['group_id']).values_list('person_id')
        queryset = PersonOnline.objects.values('is_watching').annotate(
            count_person=Count('person_id')).annotate(
            hour_online=Extract('dt_online', 'hour')).annotate(
            week_day=Extract('dt_online', 'dow')).filter(
            dt_online__gte=last_month,
            is_watching=True, person__in=members, week_day=self.kwargs['week']).values('count_person',
                                                                                           'hour_online').order_by(
            'hour_online')
        return queryset


class GetGroupsIntersection(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = GetGroupsIntersectionSerializator

    def get_queryset(self):
        values = self.request.GET.getlist('value[]')
        if not values:
            return self.queryset

        group = PersonsGroups.objects.filter(group_id=self.kwargs['first_group']).values_list('person_id')
        intersection = set([member_id[0] for member_id in group])
        for value in values:
            group = PersonsGroups.objects.filter(group_id=value).values_list('person_id')
            set_group = set([member_id[0] for member_id in group])
            intersection = intersection & set_group
        if not intersection:
            return self.queryset
        return PersonGroup.objects.filter(id__in=intersection)


class GetGroupsPosts(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = GetGroupsPostsSerializator

    def get_queryset(self):
        order = self.kwargs["order"]
        sort = self.kwargs["sort"]
        if order == "desc":
            sort = "-{}".format(sort)
        return PostGroup.objects.filter(group_id=self.kwargs["group_id"]).order_by(sort)

class GetGroupsActions(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = GetActionsSerializator

    def get_queryset(self):
        date_end = datetime.now()
        date_start = date_end.replace(hour=0, minute=0, second=0, microsecond=0)
        date_start_str = self.request.GET.get("date_start", None)
        date_end_str = self.request.GET.get("date_end", None)
        if date_start_str is not None:
            date_start = datetime.strptime(date_start_str, "%Y-%m-%d")
        if date_end_str is not None:
            date_end = datetime.strptime(date_end_str, "%Y-%m-%d") + timedelta(hours=23, minutes=59)
        return PersonActions.objects.filter(
            dt_create__gt=date_start, dt_create__lt=date_end, group_id=self.kwargs["group_id"]).select_related('person')


class SearchGroupsActions(generics.ListAPIView, generics.CreateAPIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        data = request.data
        if data.get("query", None) is None:
            return HttpResponseBadRequest("Bad query")
        label = str(time.time())
        vk_people_collect.delay(data.get("query"), label)
        return Response({"label": label})


class GetContentActions(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        try:
            data = Store.objects.get(key=self.kwargs["label"])
        except Store.DoesNotExist:
            return HttpResponseNotFound()
        if data.is_file == True:
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'

            writer = csv.writer(response)
            for d in json.loads(data.value):
                writer.writerow([d])

            return response
        return Response({"data": data.value})
