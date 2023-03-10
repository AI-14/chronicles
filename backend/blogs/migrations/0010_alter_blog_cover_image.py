# Generated by Django 4.1.4 on 2023-02-04 11:57

import blogs.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0009_alter_comment_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='cover_image',
            field=models.ImageField(blank=True, max_length=200, null=True, upload_to=blogs.models.upload_to_path),
        ),
    ]
