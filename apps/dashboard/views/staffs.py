import unicodedata
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required, user_passes_test

@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')
def painel_staffs(request):
    query = request.GET.get('q', '').strip()
    
    staffs = User.objects.filter(is_staff=True)
    
    if query:
        query_normalizada = normalizar(query)
        staffs = [
            s for s in staffs
            if query_normalizada in normalizar(s.username)
            or query_normalizada in normalizar(s.email or '')
        ]

    staffs_ativos = [s for s in staffs if s.is_active]
    staffs_inativos = [s for s in staffs if not s.is_active]
    
    return render(request, 'dashboard/painel-staffs.html', {
        'aba': 'staffs',
        'staffs_ativos': staffs_ativos,
        'staffs_inativos': staffs_inativos,
        'query': query,
    })

#Retira a acentuação para uma busca mais abrangente
def normalizar(texto):
    return unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('ASCII').lower()

# Modal para adicionar Staff
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def adicionar_staff(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        senha = request.POST.get('senha') 
        
        staff = User.objects.create_user(
            username=nome,
            email=email,
            password=senha,
            is_staff=True
        )
        return JsonResponse({
            'ok': True,
            'staff': {
                'id': staff.id,
                'nome': staff.username,
                'email': staff.email,
            }
        })
    return JsonResponse({'ok': False}, status=405)


# Modal para excluir Staff
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def excluir_staff(request, id):
    if request.method != 'POST':
        return JsonResponse({'erro':'Método não permitido'}, status=405)
    
    staff = get_object_or_404(User, id=id)
    nome = staff.username
    staff.delete()
    return JsonResponse({'sucesso':True, 'mensagem': f'Staff {nome} excluído com sucesso!'})

# Modal para desativar Staff
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def desativar_staff(request, id):
    if request.method != 'POST':
        return JsonResponse({'erro':'Método não permitido'}, status=405)
    
    staff = get_object_or_404(User, id=id)
    nome = staff.username
    staff.is_active = False
    staff.save()
    return JsonResponse({'sucesso':True, 'mensagem': f'Staff {nome} desativado com sucesso!'})

# Modal para Ativar Staff
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def ativar_staff(request, id):
    if request.method != 'POST':
        return JsonResponse({'erro':'Método não permitido'}, status=405)
    
    staff = get_object_or_404(User, id=id)
    nome = staff.username
    staff.is_active = True
    staff.save()
    return JsonResponse({'sucesso':True, 'mensagem': f'Staff {nome} ativado com sucesso!'})

# Modal para Atualizar/Editar Staff
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')
def editar_staff(request, id):
    staff = get_object_or_404(User, id=id)

    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)

    staff.username      = request.POST.get('nome')
    staff.email     = request.POST.get('email')
    staff.save()

    return JsonResponse({
        'ok': True,
        'mensagem': f'Staff {staff.username} atualizado com sucesso!',
        'staff': {
            'id': staff.id,
            'nome': staff.username,
            'email': staff.email,
        }
    })