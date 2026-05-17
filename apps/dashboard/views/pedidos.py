from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.db.models import Count
from apps.pedidos.models import Pedido

@login_required(login_url='/auth/login/') # Bloqueio de acesso para usuários não autenticados - redirecionamento para página de login
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') # Bloqueio de clientes para página adm - acesso somente de administrador
def painel_pedidos(request):
    clientes_com_pedidos = User.objects.annotate(num_pedidos=Count('pedidos')).filter(num_pedidos__gt=0).order_by('-num_pedidos')
    return render(request, 'dashboard/painel-pedidos.html', {'aba': 'pedidos', 'clientes': clientes_com_pedidos})

@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')
def cliente_pedidos(request, id):
    cliente = get_object_or_404(User, id=id)
    pedidos = Pedido.objects.filter(cliente=cliente).order_by('-criado_em')
    return render(request, 'dashboard/painel-cliente-pedidos.html', {'aba': 'pedidos', 'cliente': cliente, 'pedidos': pedidos})