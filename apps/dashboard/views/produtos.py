from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from apps.produtos.models import Produto

# Modal para adicionar produto
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def adicionar_produto(request):
    if request.method == 'POST':
        produto = Produto.objects.create(
            nome = request.POST.get('nome'),
            descricao = request.POST.get('descricao'),
            preco = request.POST.get('preco'),
            quantidade = request.POST.get ('quantidade')
        )

        return JsonResponse({
            'ok':True,
            'produto':{
                'id':produto.id,
                'nome':produto.nome,
                'descricao':produto.descricao,
                'preco':str(produto.preco),
                'quantidade':produto.quantidade
            }
        })
    return JsonResponse({'ok':False}, status=405)

# Modal para excluir produto
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def excluir_produto(request, id):
    if request.method != 'POST':
        return JsonResponse({'erro':'Método não permitido'}, status=405)
    
    produto = get_object_or_404(Produto, id=id)
    nome = produto.nome
    produto.delete()
    return JsonResponse({'sucesso':True, 'mensagem': f'Produto {nome} excluído com sucesso!'})

# Modal para desativar produto
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def desativar_produto(request, id):
    if request.method != 'POST':
        return JsonResponse({'erro':'Método não permitido'}, status=405)
    
    produto = get_object_or_404(Produto, id=id)
    nome = produto.nome
    produto.ativo = False
    produto.save()
    return JsonResponse({'sucesso':True, 'mensagem': f'Produto {nome} desativado com sucesso!'})

# Modal para Ativar produto
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') 
def ativar_produto(request, id):
    if request.method != 'POST':
        return JsonResponse({'erro':'Método não permitido'}, status=405)
    
    produto = get_object_or_404(Produto, id=id)
    nome = produto.nome
    produto.ativo = True
    produto.save()
    return JsonResponse({'sucesso':True, 'mensagem': f'Produto {nome} Ativado com sucesso!'})

# Modal para Atualizar/Editar Produto
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')
def editar_produto(request, id):
    produto = get_object_or_404(Produto, id=id)

    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)

    produto.nome      = request.POST.get('nome')
    produto.descricao = request.POST.get('descricao')
    produto.preco     = request.POST.get('preco')
    produto.quantidade = request.POST.get('quantidade')
    produto.save()

    return JsonResponse({
        'ok': True,
        'mensagem': f'Produto {produto.nome} atualizado com sucesso!',
        'produto': {
            'id': produto.id,
            'nome': produto.nome,
            'descricao': produto.descricao,
            'preco': str(produto.preco),
            'quantidade': produto.quantidade,
        }
    })