# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-07-19 02:57
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('vk_app', '0006_auto_20170719_0153'),
    ]

    operations = [
        migrations.AddField(
            model_name='watchinggroups',
            name='watchers',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
