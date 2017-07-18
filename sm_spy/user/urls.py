from django.conf.urls import url

from user.views import vk_auth
from user.api import GetInfo


urlpatterns = [
    url(r'get_info/$', GetInfo.as_view(), name="get_info"),
    url(r'vk_auth/$', vk_auth, name="vk_auth"),
]