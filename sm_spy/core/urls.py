from django.conf.urls import url

from core.views import main_view

urlpatterns = [
    url(r'^$', main_view, name="designers-list"),
    url(r'check_login$', main_view, name="check_login$"),
]