from django.conf.urls import url

from vk_app.api import GetOverviewUsers, GetGroups, AddGroup

urlpatterns = [
    url(r'get_overview_users/(?P<group_id>[0-9]+)$', GetOverviewUsers.as_view(), name="get_info"),
    url(r'get_groups/$', GetGroups.as_view(), name="get_groups"),
    url(r'add_group/$', AddGroup.as_view(), name="add_group")
]