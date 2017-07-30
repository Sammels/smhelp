from django.conf.urls import url

from vk_app.api import GetOverviewUsers, GetGroups, AddGroup, GetGeographyMembers

urlpatterns = [
    url(r'get_overview_users/(?P<group_id>[0-9]+)$', GetOverviewUsers.as_view(), name="get_info"),
    url(r'get_groups/$', GetGroups.as_view(), name="get_groups"),
    url(r'add_group/$', AddGroup.as_view(), name="add_group"),
    url(r'get_group_geography/(?P<pk>[0-9])/$', GetGeographyMembers.as_view(), name="get_group_geography")
]