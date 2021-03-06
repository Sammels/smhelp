# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-07-19 01:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vk_app', '0005_auto_20170719_0127'),
    ]

    operations = [
        migrations.CreateModel(
            name='PersonsGroups',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dt_checking', models.DateField()),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vk_app.WatchingGroups')),
            ],
        ),
        migrations.RemoveField(
            model_name='persongroup',
            name='group',
        ),
        migrations.AddField(
            model_name='personsgroups',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vk_app.PersonGroup'),
        ),
        migrations.AddField(
            model_name='persongroup',
            name='pgroup',
            field=models.ManyToManyField(through='vk_app.PersonsGroups', to='vk_app.WatchingGroups'),
        ),
    ]
