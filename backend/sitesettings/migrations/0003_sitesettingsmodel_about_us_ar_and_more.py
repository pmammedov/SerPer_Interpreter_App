# Generated by Django 4.2.7 on 2023-11-25 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sitesettings', '0002_remove_sitesettingsmodel_about_us'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettingsmodel',
            name='about_us_ar',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sitesettingsmodel',
            name='about_us_en',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sitesettingsmodel',
            name='about_us_tr',
            field=models.TextField(blank=True, null=True),
        ),
    ]