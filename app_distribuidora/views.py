from django.shortcuts import render

# Create your views here.
def index(request):
    """Página principal"""
    return render(request, 'app_distribuidora/index.html')