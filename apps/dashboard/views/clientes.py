from django.contrib.auth.models import User
from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test

@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')
def painel_clientes(request):
    clientes = User.objects.filter(is_staff=False)
    
    context = {
        'clientes' : clientes,
    }
    
    return render(request, 'dashboard/painel-clientes.html', context)