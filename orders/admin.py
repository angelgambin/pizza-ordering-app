from django.contrib import admin

from .models import Menu, Order, Carts # imports models from models.py and registers them on the admin site of django
# Register your models here.
admin.site.register(Menu)
admin.site.register(Order)
admin.site.register(Carts)
