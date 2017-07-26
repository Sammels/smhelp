from django.contrib import admin
from vk_app.models import WatchingGroups


class WatchingGroupsAdmin(admin.ModelAdmin):
    list_display = ['dt_create', 'name']
    fields = ['name']

admin.site.register(WatchingGroups, WatchingGroupsAdmin)