from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render, redirect

from orders.forms.forms import SignUpForm
from django.contrib.auth import login, authenticate
from django.urls import reverse, reverse_lazy
from django.views import generic
from django.core.serializers.json import DjangoJSONEncoder
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt # import csrf decorators
from django.contrib.auth.models import User

import json
import os
from .models import Menu, Order, Carts # imports models created from models.py
import logging
import stripe

stripe_keys = {  
  'secret_key': 'insert key here',
  'publishable_key': 'insert key here'
}

stripe.api_key = stripe_keys['secret_key'] 

# Create your views here.
def index(request):    
	logger = logging.getLogger('applog')
	menu = list(Menu.objects.all()) 
	context = { 
		"class_names" : ['Regular Pizza', 'Sicilian Pizza', 'Subs', 'Pasta', 'Salads', 'Dinner Platters'],
		"items" : list(menu),
	}
	return render(request, "orders/index.html", context) 

def confirm_order(request):
	total = request.POST['cart'] 

	if float(total) > 0: 
		context = {
			"key" : stripe_keys['publishable_key'],
			"total" : str(float(total)*100)
		}
		return render(request, "orders/submit.html", context)
	else:
		return HttpResponseRedirect(reverse("index"))

def submit_order(request): 
	print(request.POST)
	cart = request.POST['subcart']
	cart = json.loads(cart)
	items = []
	total = 0
	for j in cart.keys(): 
		total += float(cart[j]['price'])
		topps = '' 
		if cart[j]['n_toppings'] > 0:
			topps = ' - '+', '.join(cart[j]['toppings'])

		item = cart[j]['class_name'] + ' - ' + cart[j]['name'] + ' - ' + str(cart[j]['price']) + topps 
		items.append(item) 
	items = '; '.join(items)
	items_in_menu = max([int(k) for k in cart.keys()], default=0) 


	
	user = request.user.username+' - '+request.user.email+' - '+request.user.first_name+' '+request.user.last_name
	f = Order(user=user, items_in_menu=items_in_menu, total=total, items=items) 
	f.save()

	# stripe api
	customer = stripe.Customer.create(
		email=request.user.email,
		source=request.POST['stripeToken']
	)
	charge = stripe.Charge.create(
		customer=customer.id,
		amount=int(total*100),
		currency='eur',
		description="Charge for {}".format(request.user.username),
	)
	return render(request, 'orders/complete.html') 

def signup(request): 
	if request.method == 'POST':
		form = SignUpForm(request.POST)
		if form.is_valid():
			form.save()
			username = form.cleaned_data.get('username')
			raw_password = form.cleaned_data.get('password1')
			user = authenticate(username=username, password=raw_password)
			login(request, user)
			return HttpResponseRedirect(reverse("index"))
	else: 
		form = SignUpForm()
	return render(request, 'orders/signup.html', {'form': form})

# csrf decorators

@csrf_exempt
def send_cart(request):

	username = request.POST.get("username")
	userobj = User.objects.get(username=username)
	cart = request.POST.get("cart")

	try:
		f = Carts.objects.get(user=userobj)
		f.delete()
		f = Carts(user=userobj, cart=cart)
		f.save()
	except:
		f = Carts(user=userobj, cart=cart)
		f.save()
	return JsonResponse({})

@csrf_exempt
def get_cart(request, username): 
	try:
		userobj = User.objects.get(username=username)
		cart = Carts.objects.get(user=userobj)
	except:
		userobj = User.objects.get(username=username)
		f = Carts(user=userobj, cart={})
		f.save()

		cart = Carts.objects.get(user=userobj)

	return JsonResponse(cart.cart, safe=False)
