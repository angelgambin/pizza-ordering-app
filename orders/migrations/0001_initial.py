# Generated by Django 2.0.3 on 2020-04-11 09:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0009_alter_user_last_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Carts',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('cart', models.CharField(max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='Menu',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('class_name', models.CharField(max_length=30)),
                ('mtype', models.CharField(default='pasta', max_length=5)),
                ('name', models.CharField(max_length=30)),
                ('num_toppings', models.IntegerField()),
                ('size', models.BooleanField(default=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=5)),
                ('price_big', models.DecimalField(decimal_places=2, max_digits=5, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=60)),
                ('items_in_menu', models.IntegerField()),
                ('total', models.DecimalField(decimal_places=2, max_digits=5)),
                ('items', models.CharField(max_length=1000)),
            ],
        ),
    ]