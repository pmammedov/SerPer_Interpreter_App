# Generated by Django 4.2.7 on 2023-11-23 13:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sitesettings', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sitesettingsmodel',
            name='about_us',
        ),
    ]
