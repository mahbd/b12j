# Generated by Django 3.2.2 on 2021-05-10 18:21

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('judge', '0006_submission'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tutorial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tags', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=31), blank=True, size=None)),
                ('title', models.CharField(max_length=100)),
                ('text', models.TextField()),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('contest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='judge.contest')),
                ('problem', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='judge.problem')),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
    ]
