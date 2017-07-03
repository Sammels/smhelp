from django.db import models


class Country(models.Model):
    vk_id = models.IntegerField()
    name = models.CharField(max_length=255)


class City(models.Model):
    vk_id = models.IntegerField()
    name = models.CharField(max_length=255)


class WatchingGroups(models.Model):
    name = models.CharField(max_length=255)
    dt_create = models.DateTimeField(auto_now_add=True, blank=True)


class PersonGroup(models.Model):
    group = models.ForeignKey(WatchingGroups)
    vk_id = models.CharField(max_length=255)
    city = models.ForeignKey(City, null=True)
    country = models.ForeignKey(Country, null=True)
    first_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255, null=True)
    sex = models.IntegerField(null=True)
    photo_max_orig = models.CharField(max_length=255, null=True)
    has_mobile = models.IntegerField(null=True)
    bdate = models.CharField(max_length=255, null=True)

