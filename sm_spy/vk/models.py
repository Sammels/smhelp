from django.db import models


class WatchingGroups(models.Model):
    name = models.CharField(max_length=255)
    dt_create = models.DateTimeField(auto_now_add=True, blank=True)


class PersonGroup(models.Model):
    group = models.ForeignKey(WatchingGroups)
    vk_id = models.IntegerField()
    name = models.CharField(max_length=255)

