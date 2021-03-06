# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-07-03 01:46
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PersonGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vk_id', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='WatchingGroups',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('dt_create', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='persongroup',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vk_app.WatchingGroups'),
        ),
    ]
