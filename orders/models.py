from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Menu(models.Model): # creates 'Menu' model. updates from populate.py
	class_name = models.CharField(max_length=30)
	mtype = models.CharField(max_length=5, default='pasta')
	name = models.CharField(max_length=30)
	num_toppings = models.IntegerField()
	size = models.BooleanField(default=True)
	price = models.DecimalField(max_digits=5, decimal_places=2)
	price_big = models.DecimalField(max_digits=5, decimal_places=2, null=True)

class Order(models.Model): # creates 'Order' model. updates from 'submit_order' function on views.py
	user = models.CharField(max_length=60)
	items_in_menu = models.IntegerField()
	total = models.DecimalField(max_digits=5, decimal_places=2)
	items = models.CharField(max_length=1000)

class Carts(models.Model): # creates 'Carts' model. updates from 'send_cart' function on views.py
	user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
	cart = models.CharField(max_length=1000)
