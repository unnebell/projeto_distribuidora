from urllib import request

from django.shortcuts import render
from .models import Produto

# Create your views here.
def produtos(request):
    produtos = Produto.objects.filter(ativo=True)
    query = request.GET.get('q', '').strip()
    
    if query:
        produtos = produtos.filter(nome__icontains=query)
    
    return render(request, 'produtos/produtos.html', {
        'produtos': produtos,
        'query': query,
    })
    
    if request.method == 'GET':
        return render(request, 'produtos/produtos.html', {'produtos':produtos})