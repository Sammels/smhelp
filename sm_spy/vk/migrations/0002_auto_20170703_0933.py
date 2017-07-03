# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-07-03 09:33
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vk', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vk_id', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vk_id', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='persongroup',
            name='bdate',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='persongroup',
            name='domain',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='persongroup',
            name='first_name',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='persongroup',
            name='has_mobile',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='persongroup',
            name='last_name',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='persongroup',
            name='photo_max_orig',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='persongroup',
            name='sex',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='persongroup',
            name='city',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='vk.City'),
        ),
        migrations.AddField(
            model_name='persongroup',
            name='country',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='vk.Country'),
        ),
    ]
