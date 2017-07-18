from django.conf.urls import url

from user.views import vk_auth


urlpatterns = [
    url(r'$', '', name="account_view"),
]