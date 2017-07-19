from rest_framework.permissions import IsAuthenticated

from vk.models import WatchingGroups


class IsGroupOwner(IsAuthenticated):
    def has_permission(self, request, view):
        if super().has_permission(request, view):
            user_pk = request.user.pk
            groups = WatchingGroups.objects.filter(watchers=user_pk)
            return int(view.kwargs['group_id']) in [group.pk for group in groups]
        return False