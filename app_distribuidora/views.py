from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout
from django.contrib.auth import login as login_django # serve para não dar conflito com a função login
from django.contrib.auth.decorators import login_required, user_passes_test

def index(request):
    """Página principal"""
    return render(request, 'app_distribuidora/index.html')

def base(request):
    """Barra de navegação e rodapé da página"""
    return render(request, 'app_distribuidora/base.html')

def produtos(request):
    """Página dedicada para mostrar os produtos ao cliente"""
    return render(request, 'app_distribuidora/produtos.html')
     
def login(request):
    if request.method == "GET":
        return render(request, 'app_distribuidora/login.html')
    else:
        username = request.POST.get('username', '').strip()
        senha = request.POST.get('senha', '').strip()
        
        user = authenticate(username=username, password=senha)
        
        if user:
            login_django(request, user)
            if user.is_staff:
                return redirect('admin-area')   # Redireciona para página admin
            else:
                return redirect('index')       # Redireciona para página principal
        else:
            return render(request, 'app_distribuidora/login.html', {
                'erro': 'Usuário ou senha inválidos.'
            })
        
def register(request):
    """Página para cadastro de usuários"""
    if request.method == "GET":
        return render(request, 'app_distribuidora/register.html')
    else:
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        senha = request.POST.get('senha', '').strip()
        
        if User.objects.filter(username=username).exists():
            return render(request, 'app_distribuidora/register.html', {
                'erros': {'username': 'Este usuário já existe!'} 
            })
        
        user = User.objects.create_user(username=username, email=email, password=senha) #cria o usuário 
        
        return redirect('login')

@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login/') # Bloqueio de clientes para página adm - acesso somente de administrador
def painel_admin(request):
    return render(request, 'app_distribuidora/admin_custom/admin-area.html')

def logout_view(request):
    logout(request) # Limpa os dados da sessão
    return redirect('index') # Redireciona o usuário para tela principal