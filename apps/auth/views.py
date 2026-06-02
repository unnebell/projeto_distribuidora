from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import logout, authenticate
from django.contrib.auth import login as login_django

# Create your views here.
def login(request):
    if request.method == "GET":
        return render(request, 'auth/login.html')
    else:
        email = request.POST.get('email', '').strip()
        senha = request.POST.get('senha', '').strip()
        
        user_obj = User.objects.filter(email=email).first()
        username = user_obj.username if user_obj else None
        
        user = authenticate(username=username, password=senha)
        
        if user:
            login_django(request, user)
            redirect_url = 'dashboard' if user.is_staff else 'index'
            return render(request, 'auth/login.html', {
                'login_success': True,
                'redirect_url': redirect_url,
                'username': user.username,
            })
        else:
            return render(request, 'auth/login.html', {
                'erro': 'E-mail ou senha inválidos.'
            })

def register(request):
    """Página para cadastro de usuários"""
    if request.method == "GET":
        return render(request, 'auth/register.html')
    else:
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        senha = request.POST.get('senha', '').strip()
        
        if User.objects.filter(username=username).exists():
            return render(request, 'auth/register.html', {
                'erros': {'username': 'Este usuário já existe!'} 
            })
            
        if User.objects.filter(email=email).exists():
            return render(request, 'auth/register.html', {
                'erros': {'email': 'Este e-mail já está cadastrado!'} 
            })
        
        user = User.objects.create_user(username=username, email=email, password=senha) #cria o usuário 
        login_django(request, user) # Faz login automático após o registro
        
        redirect_url = 'index'
        return render(request, 'auth/register.html', {
                'register_success': True,
                'redirect_url': redirect_url,
                'username': user.username,
            })

def logout_view(request):
    logout(request)
    return redirect('login')