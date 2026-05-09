from django.urls import path
from . import views

app_name = 'pedidos'

urlpatterns = [
    path('', views.pedidos, name='pedidos'),
    path('finalizar/', views.finalizar_pedido, name='finalizar'),
    path('cancelar/<int:pedido_id>/', views.cancelar_pedido, name='cancelar'),
]