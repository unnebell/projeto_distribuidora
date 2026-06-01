from django.shortcuts import render

# Create your views here.
def index(request):
    produtos = [
        {'id': 1, 'nome': 'Hardware','descricao': 'Processadores, placas-mãe, memórias RAM, SSDs, fontes, placas de vídeo.', 'icone': 'bi-cpu'},
        {'id': 2, 'nome': 'Periféricos', 'descricao': 'Teclados, mouses, headsets, webcams, monitores, impressoras.', 'icone': 'bi-keyboard'},
        {'id': 3, 'nome': 'Redes e Conectividade', 'descricao': 'Roteadores, switches, access points, cabos de rede, conectores, patch panels.', 'icone': 'bi-router'},
        {'id': 4, 'nome': 'Segurança e Vigilância','descricao': 'Câmeras IP, DVRs, NVRs, alarmes, controle de acesso.', 'icone': 'bi-shield-check'},
        {'id': 5, 'nome': 'Energia e Infraestrutura', 'descricao': 'Nobreaks, estabilizadores, filtros de linha, racks, organizadores de cabos.', 'icone': 'bi-lightning-charge'},
        {'id': 6, 'nome': 'Softwares e Licenças', 'descricao': 'Sistemas operacionais, antivírus, pacotes Office, licenças corporativas.', 'icone': 'bi-window'},
    ]
    
    
    return render(request, 'core/index.html', {'produtos':produtos})

    return render(request, 'core/index.html')