# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-11-25 08:30
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vk_app', '0019_attachpostgroup_vk_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attachpostgroup',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attach', to='vk_app.PostGroup'),
        ),
    ]
