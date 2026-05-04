import unicodedata
from django.shortcuts import render
from django.core.paginator import Paginator
from .models import Produto

def remover_acentos(texto):
    nfkd = unicodedata.normalize('NFKD', texto) #Separa cada letra para checar se tem acentuação
    return ''.join(c for c in nfkd if not unicodedata.combining(c)).lower() #Descarta acento e junta as letras novamente

def produtos(request):
    query = request.GET.get('q', '').strip() #Pega o texto digitado para fazer a busca
    qs = Produto.objects.filter(ativo=True)

    if query:
        query_limpo = remover_acentos(query)
        
        qs = [p for p in qs if query_limpo in remover_acentos(p.nome)] #Percorre cada produto, retorna somente se acha algo igual

    paginator = Paginator(qs, 12) #Divide cada página com 12 produtos
    page_obj = paginator.get_page(request.GET.get('page'))

    return render(request, 'produtos/produtos.html', {
        'produtos': page_obj,
        'query': query,
        'page_obj': page_obj,
    })