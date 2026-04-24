from django.db.models import Sum 
from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from apps.produtos.models import Produto

# Dashboard principal com cálculos dos produtos do bd
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