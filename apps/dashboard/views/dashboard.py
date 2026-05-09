from django.utils import timezone
from django.db.models import Sum 
from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from apps.pedidos.models import Pedido
from apps.produtos.models import Produto
from django.db.models import Q
import unicodedata

# Dashboard principal com cálculos dos produtos do bd
@login_required(login_url='/auth/login/') # Bloqueio de acesso para usuários não autenticados - redirecionamento para página de login
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login') # Bloqueio de clientes para página adm - acesso somente de administrador
def dashboard(request):
    hoje = timezone.now().date()
    produtos = Produto.objects.all()
    
    pedidos_mes = Pedido.objects.filter(
        criado_em__month=hoje.month,
        criado_em__year=hoje.year
    ).count()
    
    total_estoque = produtos.aggregate(Sum('quantidade'))['quantidade__sum'] or 0 # Soma de cada item cadastrado
    total_estoque_baixo = produtos.filter(quantidade__lt=15).count()  # Contagem de produto com estoque abaixo de 15
    produto_estoque_baixo = produtos.filter(quantidade__lt=15) # Lista de produtos com estoque abaixo de 15
    
    context = {
        'produtos': produtos,
        'total_estoque': total_estoque,
        'total_estoque_baixo': total_estoque_baixo,
        'produto_estoque_baixo': produto_estoque_baixo,
        'pedidos_mes': pedidos_mes,
    }

    if request.method == 'GET':
        return render(request, 'dashboard/painel.html', context)

#Retira a acentuação para uma busca mais abrangente
def normalizar(texto):
    return unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('ASCII').lower()

# Mostra somente itens ativos na tabela principal e inativos em uma segunda tabela
@login_required(login_url='/auth/login/')
@user_passes_test(lambda u: u.is_staff, login_url='/auth/login')       
def painel_produtos(request):
    query = request.GET.get('q', '').strip()
    
    produtos = Produto.objects.all()
    
    if query:
        query_normalizada = normalizar(query)  # "memória" → "memoria"
        produtos = [
            p for p in produtos
            if query_normalizada in normalizar(p.nome)
            or query_normalizada in normalizar(p.descricao or '')
        ]

    produtos_ativos = [p for p in produtos if p.ativo]
    produtos_inativos = [p for p in produtos if not p.ativo]

    context = {
        'produtos_ativos': produtos_ativos,
        'produtos_inativos': produtos_inativos,
        'query': query,
        'aba': 'produtos',
    }
    
    return render(request, 'dashboard/painel-produtos.html', context)