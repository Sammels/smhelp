from django.contrib import admin
from vk_app.models import WatchingGroups


class WatchingGroupsAdmin(admin.ModelAdmin):
    list_display = ['dt_create', 'dt_last_update', 'name']
    fields = ['name', 'dt_last_update']
    readonly_fields = ('dt_last_update',)

admin.site.register(WatchingGroups, WatchingGroupsAdmin)