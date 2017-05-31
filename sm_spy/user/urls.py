from django.conf.urls import url

from user.views import get_info, vk_auth

urlpatterns = [
    url(r'getinfo/$', get_info, name="get_info"),
    url(r'vk_auth/$', vk_auth, name="vk_auth"),
]