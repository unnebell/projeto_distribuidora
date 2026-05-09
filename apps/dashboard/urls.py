from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('produtos/', views.painel_produtos, name='painel_produtos'),
    path('produtos/adicionar/', views.adicionar_produto, name='adicionar_produto'),
    path('produtos/excluir/<int:id>/', views.excluir_produto, name='excluir_produto'),
    path('produtos/desativar/<int:id>/', views.desativar_produto, name='desativar_produto'),
    path('produtos/ativar/<int:id>/', views.ativar_produto, name='ativar_produto'),
    path('produtos/editar/<int:id>/', views.editar_produto, name='editar_produto'),
    
    path('clientes/', views.painel_clientes, name='painel_clientes'),
    path('clientes/adicionar/', views.adicionar_cliente, name='adicionar_cliente'),
    path('clientes/excluir/<int:id>/', views.excluir_cliente, name='excluir_cliente'),
    path('clientes/desativar/<int:id>/', views.desativar_cliente, name='desativar_cliente'),
    path('clientes/ativar/<int:id>/', views.ativar_cliente, name='ativar_cliente'),
    path('clientes/editar/<int:id>/', views.editar_cliente, name='editar_cliente'),

    path('pedidos/', views.painel_pedidos, name='painel_pedidos'),
    
    path('usuarios/', views.painel_usuarios, name='painel_usuarios'),
]