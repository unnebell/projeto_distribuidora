from django.shortcuts import render

# Create your views here.
def produtos(request):
    produtos = [
        {'id': 1, 'nome': 'Notebook', 'quantidade': 3, 'descricao': 'Ideapad 3I'},
        {'id': 2, 'nome': 'Mouse', 'quantidade': 10, 'descricao': 'Logitech G305'},
        {'id': 3, 'nome': 'Teclado', 'quantidade': 5, 'descricao': 'Mecânico RGB'},
        {'id': 4, 'nome': 'Notebook', 'quantidade': 3, 'descricao': 'Ideapad 3I'},
        {'id': 5, 'nome': 'Mouse', 'quantidade': 10, 'descricao': 'Logitech G305'},
        {'id': 6, 'nome': 'Teclado', 'quantidade': 5, 'descricao': 'Mecânico RGB'},
    ]
    
    
    return render(request, 'produtos/produtos.html', {'produtos':produtos})

    return render(request, 'produtos/produtos.html')