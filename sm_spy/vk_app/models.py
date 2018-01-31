from datetime import timedelta, datetime

from django.db import models
from django.contrib.auth.models import User

from vk_app.celery import vk_checker


class Country(models.Model):
    """База данных стран из вк"""
    name = models.CharField(max_length=255)


class City(models.Model):
    """База данных городов из вк"""
    name = models.CharField(max_length=255)
    country = models.ForeignKey(Country)


class WatchingGroups(models.Model):
    """Наблюдаемые группы"""
    name = models.CharField(max_length=255)
    link = models.CharField(max_length=255)
    group_id = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    watchers = models.ManyToManyField(User)
    dt_create = models.DateTimeField(auto_now_add=True, blank=True)
    dt_last_update = models.DateField(null=True, default=None)

    def force_update(self):
        if self.dt_last_update is not None and self.dt_last_update == datetime.today().date():
            persons = PersonsGroups.objects.filter(group=self, dt_checking__gte=self.dt_last_update)
            persons.delete()
            self.dt_last_update = None
            self.save()
        vk_checker.delay(self.pk)


class PersonGroup(models.Model):
    """Профили людей из вк"""
    pgroup = models.ManyToManyField(WatchingGroups, through='PersonsGroups')
    vk_id = models.CharField(max_length=255, unique=True, db_index=True)
    city = models.ForeignKey(City, null=True)
    country = models.ForeignKey(Country, null=True)
    first_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255, null=True)
    sex = models.IntegerField(null=True)
    photo_max_orig = models.CharField(max_length=255, null=True)
    has_mobile = models.IntegerField(null=True)
    bdate = models.CharField(max_length=255, null=True)


class PersonOnline(models.Model):
    """Таблица людей on-line"""
    dt_online = models.DateTimeField()
    person = models.ForeignKey(PersonGroup)
    is_watching = models.BooleanField(default=True)


class PersonsGroups(models.Model):
    """Таблица людей, которые находятся в группе на момент проверки"""
    group = models.ForeignKey(WatchingGroups)
    person = models.ForeignKey(PersonGroup)
    dt_checking = models.DateField()


class PostGroup(models.Model):
    """Посты в группе"""
    vk_id = models.IntegerField(unique=True, db_index=True)
    group = models.ForeignKey(WatchingGroups)
    dt_create = models.DateField(auto_now_add=True)
    text = models.TextField()
    likes = models.IntegerField()
    comments = models.IntegerField()
    views = models.IntegerField()
    reposts = models.IntegerField()


class AttachPostGroup(models.Model):
    """Медиа-файлы поста"""
    vk_id = models.IntegerField(db_index=True)
    post = models.ForeignKey(PostGroup, related_name='attach')
    dt_create = models.DateField(auto_now_add=True)
    photo_1280 = models.CharField(max_length=255)
    photo_807 = models.CharField(max_length=255)
    photo_604 = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    description = models.TextField()
    comments = models.IntegerField()
    views = models.IntegerField()


class QueueGroupUpdating(models.Model):
    """Таблица очередей, чтобы два действия не происходили одновременно"""
    group = models.ForeignKey(WatchingGroups)
    dt_create = models.DateField(auto_now_add=True)


class PersonActions(models.Model):
    """Таблица логгирования действий людей"""
    LIKE, COMMENT, IN, OUT = 1, 2, 3, 4
    CHOICES = (
        (LIKE, "like"),
        (COMMENT, "COMMENT"),
        (IN, "IN"),
        (OUT, "OUT"),
    )
    group = models.ForeignKey(WatchingGroups, related_name='watching_group')
    person = models.ForeignKey(PersonGroup, related_name='person_group')
    dt_create = models.DateTimeField(auto_now_add=True, db_index=True)
    action = models.SmallIntegerField(choices=CHOICES, default=0, db_index=True)
