from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"), # when goes to '' route pass 'index' function from views.py
    path("submit_order/", views.submit_order, name="submit_order"),
    path("confirm_order/", views.confirm_order, name="confirm_order"),
    path('signup/', views.signup, name='signup'),
    path('send_cart/', views.send_cart, name='send_cart'), # passes csrf 'send_cart' function from views.py
    path('<str:username>/get_cart/', views.get_cart, name='get_cart') # passes csrf 'get_cart' function from views.py
]
