# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-27 10:13
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('enot', '0005_comments_answer_comment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comments',
            name='answer_massage',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='enot.Massages'),
        ),
    ]
