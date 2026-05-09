from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test

@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')
def painel_usuarios(request):
    return render(request, 'dashboard/painel-usuarios.html', {'aba': 'usuarios'})
