from datetime import datetime

from rest_framework import generics
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
import vk as vk_api
from django.http import HttpResponseBadRequest
from rest_framework.response import Response

from vk_app.serializers import (GetOverviewUsersSerializer, GetGroupsSerializator, GetGroupsGeographySerializator,
                                GetGroupsIntersectionSerializator)
from vk_app.models import PersonsGroups, WatchingGroups, PersonGroup
from vk_app.permissions import IsGroupOwner
from vk_app.celery import vk_checker


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
            data = api.groups.getById(group_id=group_id)
            try:
                group = WatchingGroups.objects.get(link=group_link)
            except Exception:
                group = WatchingGroups(link=group_link, name=data[0]['name'], type=data[0]['type'], group_id=group_id)
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

class GetGroupsIntersection(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = GetGroupsIntersectionSerializator

    def get_queryset(self):
        group_first = PersonsGroups.objects.filter(group_id=self.kwargs['first_group']).values_list('person_id')
        group_second = PersonsGroups.objects.filter(group_id=self.kwargs['second_group']).values_list('person_id')
        group_first = set([member_id[0] for member_id in group_first])
        group_second = set([member_id[0] for member_id in group_second])
        intersection = group_first & group_second
        if not intersection:
            return self.queryset
        return PersonGroup.objects.filter(id__in=intersection)

