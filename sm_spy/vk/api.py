from rest_framework import generics
from django.db.models import Count

from vk.serializers import GetOverviewUsersSerializer
from vk.models import PersonsGroups
from vk.permissions import IsGroupOwner


class GetOverviewUsers(generics.ListAPIView):
    serializer_class = GetOverviewUsersSerializer
    permission_classes = (IsGroupOwner,)

    def get_queryset(self):
        return PersonsGroups.objects.filter(
            group=self.kwargs['group_id']).values('dt_checking').annotate(count=Count('*'))