from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test

from apps.produtos.models import Produto

# Create your views here.
@login_required(login_url='/auth/login/') # Bloqueio de acesso para usuários não autenticados - redirecionamento para página de login
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') # Bloqueio de clientes para página adm - acesso somente de administrador
def dashboard(request):
    produtos = Produto.objects.all()

    if request.method == 'GET':
        return render(request, 'dashboard/painel.html', {'produtos':produtos})