from datetime import timedelta

from django.db import models
from django.contrib.auth.models import User

from vk_app.celery import vk_checker


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

    def force_update(self):
        if self.dt_last_update is not None:
            self.dt_last_update = self.dt_last_update - timedelta(days=1)
            dt_last_update = self.dt_last_update
            self.save()
            persons = PersonsGroups.objects.filter(group=self, dt_checking__gte=dt_last_update)
            persons.delete()
        vk_checker.delay(self.pk)


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


class LikesGroup(models.Model):
    group = models.ForeignKey(WatchingGroups)
    person = models.ForeignKey(PersonGroup)
    dt_create = models.DateField(auto_now_add=True)


class CommentsGroup(models.Model):
    group = models.ForeignKey(WatchingGroups)
    person = models.ForeignKey(PersonGroup)
    dt_create = models.DateField(auto_now_add=True)
    comment = models.TextField()


class RepostGroup(models.Model):
    group = models.ForeignKey(WatchingGroups)
    person = models.ForeignKey(PersonGroup)
    dt_create = models.DateField(auto_now_add=True)


class PostGroup(models.Model):
    vk_id = models.IntegerField()
    group = models.ForeignKey(WatchingGroups)
    dt_create = models.DateField(auto_now_add=True)
    text = models.TextField()


class PhotosPostGroup(models.Model):
    post = models.ForeignKey(PostGroup)
    dt_create = models.DateField(auto_now_add=True)
    photo_1280 = models.CharField(max_length=255)
    photo_807 = models.CharField(max_length=255)
    photo_604 = models.CharField(max_length=255)

