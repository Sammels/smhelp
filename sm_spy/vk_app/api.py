from rest_framework import generics
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
import vk as vk_api
from django.http import HttpResponseBadRequest

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
            group=self.kwargs['group_id']).values('dt_checking').annotate(count=Count('*'))


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

