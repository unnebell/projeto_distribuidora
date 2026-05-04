from django.shortcuts import render
from django.core.paginator import Paginator
from .models import Produto

def produtos(request):
    query = request.GET.get('q', '').strip()
    qs = Produto.objects.filter(ativo=True)
    
    if query:
        qs = qs.filter(nome__icontains=query)
    
    paginator = Paginator(qs, 12)
    page_obj = paginator.get_page(request.GET.get('page'))
    
    return render(request, 'produtos/produtos.html', {
        'produtos': page_obj,
        'query': query,
        'page_obj': page_obj,
    })