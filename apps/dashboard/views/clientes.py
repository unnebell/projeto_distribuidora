from django.contrib.auth.models import User
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Q
import unicodedata
from apps.core.http import wants_partial

#Retira a acentuação para uma busca mais abrangente
def normalizar(texto):
    return unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('ASCII').lower()
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')
def painel_clientes(request):
    query = request.GET.get('q', '').strip()
    
    clientes = User.objects.filter(is_staff=False)  # exclui admins da busca
    
    if query:
        query_normalizada = normalizar(query)
        clientes = [
            c for c in clientes
            if query_normalizada in normalizar(c.username)  
            or query_normalizada in normalizar(c.email or '')  
        ]

    clientes_ativos = [c for c in clientes if c.is_active]      
    clientes_inativos = [c for c in clientes if not c.is_active] 
    
    context = {
        'clientes_ativos': clientes_ativos,
        'clientes_inativos': clientes_inativos,
        'query': query,  # ✅ passa query para o template
        'aba': 'clientes',
    }
    
    if wants_partial(request):
        return render(request, 'dashboard/partials/painel-clientes-resultados.html', context)
    return render(request, 'dashboard/painel-clientes.html', context)


# Modal para adicionar cliente
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def adicionar_cliente(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        senha = request.POST.get('senha') 
        
        cliente = User.objects.create_user(
            username=nome,
            email=email,
            password=senha
        )
        return JsonResponse({
            'ok': True,
            'cliente': {
                'id': cliente.id,
                'nome': cliente.username,
                'email': cliente.email,
            }
        })
    return JsonResponse({'ok': False}, status=405)


# Modal para excluir Cliente
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def excluir_cliente(request, id):
    if request.method != 'POST':
        return JsonResponse({'erro':'Método não permitido'}, status=405)
    
    cliente = get_object_or_404(User, id=id)
    nome = cliente.username
    cliente.delete()
    return JsonResponse({'sucesso':True, 'mensagem': f'Cliente {nome} excluído com sucesso!'})

# Modal para desativar Cliente
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def desativar_cliente(request, id):
    if request.method != 'POST':
        return JsonResponse({'erro':'Método não permitido'}, status=405)
    
    cliente = get_object_or_404(User, id=id)
    nome = cliente.username
    cliente.is_active = False
    cliente.save()
    return JsonResponse({'sucesso':True, 'mensagem': f'Cliente {nome} desativado com sucesso!'})

# Modal para Ativar Cliente
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def ativar_cliente(request, id):
    if request.method != 'POST':
        return JsonResponse({'erro':'Método não permitido'}, status=405)
    
    cliente = get_object_or_404(User, id=id)
    nome = cliente.username
    cliente.is_active = True
    cliente.save()
    return JsonResponse({'sucesso':True, 'mensagem': f'Cliente {nome} Ativado com sucesso!'})

# Modal para Atualizar/Editar Cliente
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')
def editar_cliente(request, id):
    cliente = get_object_or_404(User, id=id)

    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)

    cliente.username      = request.POST.get('nome')
    cliente.email     = request.POST.get('email')
    cliente.save()

    return JsonResponse({
        'ok': True,
        'mensagem': f'Cliente {cliente.username} atualizado com sucesso!',
        'cliente': {
            'id': cliente.id,
            'nome': cliente.username,
            'email': cliente.email,
        }
    })