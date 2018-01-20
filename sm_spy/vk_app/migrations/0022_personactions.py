# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-01-20 16:09
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vk_app', '0021_auto_20171126_0249'),
    ]

    operations = [
        migrations.CreateModel(
            name='PersonActions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dt_create', models.DateTimeField(auto_now_add=True)),
                ('action', models.SmallIntegerField(choices=[(1, 'like'), (2, 'COMMENT'), (3, 'IN'), (4, 'OUT')], db_index=True, default=0)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vk_app.WatchingGroups')),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vk_app.PersonGroup')),
            ],
        ),
    ]
