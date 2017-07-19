from django.conf.urls import url

from vk.api import GetOverviewUsers

urlpatterns = [
    url(r'get_overview_users/(?P<group_id>[0-9]+)$', GetOverviewUsers.as_view(), name="get_info")
]