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
]