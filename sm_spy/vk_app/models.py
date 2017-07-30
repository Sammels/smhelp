from django.db import models
from django.contrib.auth.models import User


class Country(models.Model):
    name = models.CharField(max_length=255)


class City(models.Model):
    name = models.CharField(max_length=255)
    country = models.ForeignKey(Country)


class WatchingGroups(models.Model):
    name = models.CharField(max_length=255)
    link = models.CharField(max_length=255)
    group_id = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    watchers = models.ManyToManyField(User)
    dt_create = models.DateTimeField(auto_now_add=True, blank=True)
    dt_last_update = models.DateField(null=True, default=None)


class PersonGroup(models.Model):
    pgroup = models.ManyToManyField(WatchingGroups, through='PersonsGroups')
    vk_id = models.CharField(max_length=255)
    city = models.ForeignKey(City, null=True)
    country = models.ForeignKey(Country, null=True)
    first_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255, null=True)
    sex = models.IntegerField(null=True)
    photo_max_orig = models.CharField(max_length=255, null=True)
    has_mobile = models.IntegerField(null=True)
    bdate = models.CharField(max_length=255, null=True)


class PersonsGroups(models.Model):
    group = models.ForeignKey(WatchingGroups)
    person = models.ForeignKey(PersonGroup)
    dt_checking = models.DateField()