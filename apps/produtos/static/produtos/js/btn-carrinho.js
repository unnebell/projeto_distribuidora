//Listagem do carrinho
const carrinho = [];

function atualizarBadge() {
    const total = carrinho.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('badgeCarrinho').textContent = total;
}



//Adiciona produto no carrinho
document.getElementById('btnAdicionarCarrinho').addEventListener('click', function () {
    const modal   = document.getElementById('modalVerProdutoPedido');
    const id      = modal.dataset.produtoId;
    const nome    = modal.dataset.produtoNome;
    const descricao = modal.dataset.produtoDescricao;
    const precoRaw  = (modal.dataset.produtoPreco || '0').replace(',', '.');
    const preco   = parseFloat(precoRaw);
    const qty     = parseInt(document.getElementById('qtyValor').textContent);

    const existente = carrinho.find(i => i.id === id);
    if (existente) {
        existente.qty += qty;
    } else {
        carrinho.push({ id, nome, descricao, preco, qty });
    }

    atualizarBadge();

    // fecha o modal
    bootstrap.Modal.getInstance(modal).hide();
});

//Preenche modal do carrinho
document.getElementById('modalBtnCarrinho').addEventListener('show.bs.modal', function () {
    renderizarCarrinho();
});

function renderizarCarrinho() {
    const lista = document.getElementById('listaCarrinho');
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
    atualizarBadge();
    renderizarCarrinho();
}