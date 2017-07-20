from rest_framework import generics
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated

from vk.serializers import GetOverviewUsersSerializer, GetGroups
from vk.models import PersonsGroups, WatchingGroups
from vk.permissions import IsGroupOwner


class GetOverviewUsers(generics.ListAPIView):
    serializer_class = GetOverviewUsersSerializer
    permission_classes = (IsGroupOwner,)

    def get_queryset(self):
        return PersonsGroups.objects.filter(
            group=self.kwargs['group_id']).values('dt_checking').annotate(count=Count('*'))


class GetGroups(generics.ListAPIView):
    serializer_class = GetGroups
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        return WatchingGroups.objects.filter(watchers=self.request.user.pk)
