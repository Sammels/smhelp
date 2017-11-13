from django.conf.urls import url

from vk_app.api import (GetOverviewUsers, GetGroups, AddGroup, GetGeographyMembers, GetGroupsIntersection,
                        GetOverviewChanginsUsers, GroupsForceUpdate, GroupsDelete, GetPeopleOnline)

urlpatterns = [
    url(r'get_overview_users/(?P<group_id>[0-9]+)/$', GetOverviewUsers.as_view(), name="get_info"),
    url(r'get_overview_changins_users/(?P<group_id>[0-9]+)/$', GetOverviewChanginsUsers.as_view(), name="get_info"),
    url(r'get_groups/$', GetGroups.as_view(), name="get_groups"),
    url(r'groups/force_update/(?P<group_id>[0-9]+)/$', GroupsForceUpdate.as_view(), name="groups_force_update"),
    url(r'groups/delete/(?P<group_id>[0-9]+)/$', GroupsDelete.as_view(), name="groups_delete"),
    url(r'add_group/$', AddGroup.as_view(), name="add_group"),
    url(r'get_group_geography/(?P<pk>[0-9]+)/$', GetGeographyMembers.as_view(), name="get_group_geography"),
    url(r'get_group_intersection/(?P<first_group>[0-9]+)/$', GetGroupsIntersection.as_view(),
        name="get_group_intersection"),
    url(r'group/(?P<group_id>[0-9]+)/online/(?P<week>[0-9]+)/$', GetPeopleOnline.as_view(), name="get_people_onlie"),
]