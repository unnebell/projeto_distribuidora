from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test

# Create your views here.
@login_required(login_url='/auth/login/') # Bloqueio de acesso para usuários não autenticados - redirecionamento para página de login
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') # Bloqueio de clientes para página adm - acesso somente de administrador
def dashboard(request):
    produtos = [
        {'id': 1, 'nome': 'Notebook', 'quantidade': 3, 'descricao': 'Ideapad 3I'},
        {'id': 2, 'nome': 'Mouse', 'quantidade': 10, 'descricao': 'Logitech G305'},
        {'id': 3, 'nome': 'Teclado', 'quantidade': 5, 'descricao': 'Mecânico RGB'},
    ]
    
    
    return render(request, 'dashboard/admin-area.html', {'produtos':produtos})