from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test

@login_required(login_url='/auth/login/') # Bloqueio de acesso para usuários não autenticados - redirecionamento para página de login
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') # Bloqueio de clientes para página adm - acesso somente de administrador
def painel_pedidos(request):
    return render(request, 'dashboard/painel-pedidos.html')