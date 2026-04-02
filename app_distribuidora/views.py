from django.shortcuts import render

# Create your views here.
def index(request):
    """Página principal"""
    return render(request, 'app_distribuidora/index.html')

def base(request):
    """Barra de navegação e rodapé da página"""
    return render(request, 'app_distribuidora/base.html')

def login(request):
    """Página para login de usuários e adms"""
    return render(request, 'app_distribuidora/login.html')

def register(request):
    """Página para cadastro de usuários"""
    return render(request, 'app_distribuidora/register.html')

def produtos(request):
    """Página dedicada para mostrar os produtos ao cliente"""
    return render(request, 'app_distribuidora/produtos.html')

def painel_admin(request):
    """Página destinada a manutenção da aplicação com acesso somente por administradores"""
    return render(request, 'app_distribuidora/admin_custom/admin-area.html')