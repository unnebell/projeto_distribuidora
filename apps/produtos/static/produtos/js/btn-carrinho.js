function getCsrf() {
    return document.cookie.split(';')
        .find(c => c.trim().startsWith('csrftoken='))
        ?.split('=')[1];
}

function mostrarToast(mensagem, tipo = 'success', redirect = null) {
    const icone = tipo === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
    const cor = tipo === 'success' ? 'text-bg-success' : 'text-bg-danger';

    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 start-50 translate-middle-x p-3';
    container.style.zIndex = 9999;
    container.innerHTML = `
        <div class="toast align-items-center ${cor} border-0 show" role="alert">
            <div class="d-flex">
                <div class="toast-body fw-semibold">
                    <i class="bi ${icone} me-2"></i>${mensagem}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);
    setTimeout(() => {
        container.remove();
        if (redirect) window.location.href = redirect;
    }, 2000);
}

// Carrega carrinho do localStorage ou inicia vazio
const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarBadge() {
    const total = carrinho.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('badgeCarrinho').textContent = total;
}

atualizarBadge();

// Adiciona produto no carrinho
document.getElementById('btnAdicionarCarrinho').addEventListener('click', function () {
    const modal     = document.getElementById('modalVerProdutoPedido');
    const id        = modal.dataset.produtoId;
    const nome      = modal.dataset.produtoNome;
    const descricao = modal.dataset.produtoDescricao;
    const precoRaw  = (modal.dataset.produtoPreco || '0').replace(',', '.');
    const preco     = parseFloat(precoRaw);
    const qty       = parseInt(document.getElementById('qtyValor').textContent);

    const existente = carrinho.find(i => i.id === id);
    if (existente) {
        existente.qty += qty;
    } else {
        carrinho.push({ id, nome, descricao, preco, qty });
    }

    salvarCarrinho();
    atualizarBadge();
    bootstrap.Modal.getInstance(modal).hide();
});

// Preenche modal do carrinho
document.getElementById('modalBtnCarrinho').addEventListener('show.bs.modal', function () {
    renderizarCarrinho();
});

function renderizarCarrinho() {
    const lista   = document.getElementById('listaCarrinho');
    const totalEl = document.getElementById('totalCarrinho');

    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="text-muted">Carrinho vazio.</p>';
        totalEl.textContent = 'R$ 0,00';
        return;
    }

    lista.innerHTML = carrinho.map((item, idx) => `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
            <div>
                <strong>${item.nome}</strong><br>
                <small class="text-muted">${item.qty}x — ${item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</small>
            </div>
            <div class="d-flex align-items-center gap-2">
                <strong>${(item.preco * item.qty).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                <button class="btn btn-sm btn-outline-danger" onclick="removerItem(${idx})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = carrinho.reduce((acc, item) => acc + item.preco * item.qty, 0);
    totalEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function removerItem(idx) {
    carrinho.splice(idx, 1);
    salvarCarrinho();
    atualizarBadge();
    renderizarCarrinho();
}

// Finalizar pedido
document.getElementById('btnFinalizarPedido').addEventListener('click', async function () {
    if (!carrinho.length) {
        mostrarToast('Seu carrinho está vazio.', 'danger');
        return;
    }

    const itens = carrinho.map(item => ({
        id: item.id,
        quantidade: item.qty,
        preco: item.preco.toFixed(2),
    }));

    try {
        const resp = await fetch('/pedidos/finalizar/', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrf(),
            },
            body: JSON.stringify({ itens }),
        });

        const data = await resp.json();

        if (data.sucesso) {
            carrinho.length = 0;
            salvarCarrinho();
            atualizarBadge();
            bootstrap.Modal.getInstance(document.getElementById('modalBtnCarrinho')).hide();
            mostrarToast(`Pedido #${String(data.pedido_id).padStart(4, '0')} realizado com sucesso!`, 'success', '/pedidos/');
        } else {
            mostrarToast('Erro: ' + (data.erro || 'tente novamente'), 'danger');
        }
    } catch (e) {
        mostrarToast('Faça login para finalizar o pedido.', 'danger');
    }
});