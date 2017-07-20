from django.conf.urls import url

from vk.api import GetOverviewUsers, GetGroups

urlpatterns = [
    url(r'get_overview_users/(?P<group_id>[0-9]+)$', GetOverviewUsers.as_view(), name="get_info"),
    url(r'get_groups/$', GetGroups.as_view(), name="(?P<group_id>[0-9]+)")
]