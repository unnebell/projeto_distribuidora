from django.urls import path
from . import views

urlpatterns = [
    path('meus-pedidos/', views.pedidos, name='pedidos'),
]