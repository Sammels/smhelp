# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-07-03 12:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vk', '0003_auto_20170703_1045'),
    ]

    operations = [
        migrations.AddField(
            model_name='watchinggroups',
            name='dt_last_update',
            field=models.DateField(blank=True, default=None, null=True),
        ),
    ]
