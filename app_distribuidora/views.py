from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from django.contrib.auth.decorators import login_required

# Create your views here.
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
    """Página para login de usuários e adms"""
    if request.method == "GET":
        return render(request, 'app_distribuidora/login.html')
    else:
        username = request.POST.get('username')
        senha = request.POST.get('senha')
        
        user = authenticate(username=username, password=senha)
        
        if user:
            login_django(request, user)
            
            return HttpResponse('Autenticado!')
        else:
            return HttpResponse('Usuário ou Senha inválidos')

def register(request):
    """Página para cadastro de usuários"""
    if request.method == "GET":
        return render(request, 'app_distribuidora/register.html')
    else:
        username = request.POST.get('username')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        
        
        user = User.objects.filter(username=username).first()
        
        if user:
            return HttpResponse('Já existe um usuário com esse username')
        
        user = User.objects.create_user(username=username, email=email, password=senha)
        user.save()
        
        return render(request, 'app_distribuidora/login.html')

@login_required(login_url='/auth/login/') # Decorator redireciona para a tela de login caso não esteja logado
def painel_admin(request):
    """Página destinada a manutenção da aplicação com acesso somente por administradores"""
    return render(request, 'app_distribuidora/admin_custom/admin-area.html')