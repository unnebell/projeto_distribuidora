from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from apps.produtos.models import Produto
from .models import Pedido, ItemPedido
import json

@login_required(login_url='/auth/login/')
def pedidos(request):
    lista = Pedido.objects.filter(cliente=request.user).prefetch_related('itens__produto').order_by('-criado_em')
    return render(request, 'pedidos/pedidos.html', {'pedidos': lista})


@login_required(login_url='/auth/login/')
@require_POST
def finalizar_pedido(request):
    try:
        data = json.loads(request.body)
        itens = data.get('itens', []) 

        if not itens:
            return JsonResponse({'erro': 'Carrinho vazio'}, status=400)

        pedido = Pedido.objects.create(cliente=request.user)

        for item in itens:
            produto = Produto.objects.get(pk=item['id'])
            ItemPedido.objects.create(
                pedido=pedido,
                produto=produto,
                quantidade=item['quantidade'],
                preco_unitario=item['preco'],
            )

        return JsonResponse({'sucesso': True, 'pedido_id': pedido.pk})

    except Produto.DoesNotExist:
        return JsonResponse({'erro': 'Produto não encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'erro': str(e)}, status=500)
    
@login_required(login_url='/auth/login/')
@require_POST
def cancelar_pedido(request, pedido_id):
    try:
        pedido = Pedido.objects.get(pk=pedido_id, cliente=request.user)
        pedido.delete()
        return JsonResponse({'ok': True})
    except Pedido.DoesNotExist:
        return JsonResponse({'ok': False}, status=404)