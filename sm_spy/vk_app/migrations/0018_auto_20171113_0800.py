# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-11-13 08:00
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vk_app', '0017_auto_20171113_0748'),
    ]

    operations = [
        migrations.CreateModel(
            name='AttachPostGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dt_create', models.DateField(auto_now_add=True)),
                ('photo_1280', models.CharField(max_length=255)),
                ('photo_807', models.CharField(max_length=255)),
                ('photo_604', models.CharField(max_length=255)),
                ('title', models.CharField(max_length=255)),
                ('type', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('comments', models.IntegerField()),
                ('views', models.IntegerField()),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vk_app.PostGroup')),
            ],
        ),
        migrations.RemoveField(
            model_name='photospostgroup',
            name='post',
        ),
        migrations.DeleteModel(
            name='PhotosPostGroup',
        ),
    ]
