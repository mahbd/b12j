# Generated by Django 3.2.2 on 2021-06-02 01:34

from django.db import migrations, models
import django.utils.timezone
import ws.models


class Migration(migrations.Migration):

    dependencies = [
        ('ws', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activechannel',
            name='time',
            field=models.DateTimeField(default=django.utils.timezone.now, validators=[ws.models.validate_time]),
        ),
    ]
