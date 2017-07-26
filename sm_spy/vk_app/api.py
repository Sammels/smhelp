from rest_framework import generics
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
import vk as vk_api
from django.http import HttpResponseBadRequest

from vk_app.serializers import GetOverviewUsersSerializer, GetGroupsSerializator
from vk_app.models import PersonsGroups, WatchingGroups
from vk_app.permissions import IsGroupOwner


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
        return self.list(request, *args, **kwargs)
