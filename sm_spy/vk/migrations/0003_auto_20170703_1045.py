# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-07-03 10:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vk', '0002_auto_20170703_0933'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='persongroup',
            name='domain',
        ),
        migrations.RemoveField(
            model_name='persongroup',
            name='name',
        ),
        migrations.AlterField(
            model_name='persongroup',
            name='vk_id',
            field=models.CharField(max_length=255),
        ),
    ]
