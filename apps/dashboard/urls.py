from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('produtos/', views.painel_produtos, name='painel_produtos'),
    path('produtos/adicionar/', views.adicionar_produto, name='adicionar_produto')
]