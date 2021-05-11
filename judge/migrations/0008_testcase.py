# Generated by Django 3.2.2 on 2021-05-10 19:33

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('judge', '0007_tutorial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TestCase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inputs', models.TextField()),
                ('output', models.TextField()),
                ('date', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('problem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='judge.problem')),
            ],
        ),
    ]
