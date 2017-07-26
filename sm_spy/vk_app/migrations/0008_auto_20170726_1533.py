# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-07-26 15:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vk_app', '0007_watchinggroups_watchers'),
    ]

    operations = [
        migrations.AddField(
            model_name='watchinggroups',
            name='group_id',
            field=models.CharField(default=None, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='watchinggroups',
            name='link',
            field=models.CharField(default=None, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='watchinggroups',
            name='type',
            field=models.CharField(default=None, max_length=255),
            preserve_default=False,
        ),
    ]
