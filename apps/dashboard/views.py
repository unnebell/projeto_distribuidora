from django.db.models import Sum 
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from apps.produtos.models import Produto

# Create your views here.
@login_required(login_url='/auth/login/') # Bloqueio de acesso para usuários não autenticados - redirecionamento para página de login
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') # Bloqueio de clientes para página adm - acesso somente de administrador
def dashboard(request):
    produtos = Produto.objects.all()
    
    total_estoque = produtos.aggregate(Sum('quantidade'))['quantidade__sum'] or 0 # Soma de cada item cadastrado
    total_estoque_baixo = produtos.filter(quantidade__lt=15).count()  # Contagem de produto com estoque abaixo de 15
    produto_estoque_baixo = produtos.filter(quantidade__lt=15) # Lista de produtos com estoque abaixo de 15
    
    context = {
        'produtos': produtos,
        'total_estoque': total_estoque,
        'total_estoque_baixo': total_estoque_baixo,
        'produto_estoque_baixo': produto_estoque_baixo,
    }

    if request.method == 'GET':
        return render(request, 'dashboard/painel.html', context)

# Mostra somente itens ativos na tabela principal e inativos em uma segunda tabela
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')       
def painel_produtos(request):
    produtos_ativos = Produto.objects.filter(ativo=True)
    produtos_inativos = Produto.objects.filter(ativo=False)

    context = {
        'produtos_ativos': produtos_ativos,
        'produtos_inativos': produtos_inativos,
        }
    
    return render(request, 'dashboard/painel-produtos.html', context)

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