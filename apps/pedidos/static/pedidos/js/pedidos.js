function getCsrf() {
    return document.cookie.split('; ')
        .find(c => c.startsWith('csrftoken='))
        ?.split('=')[1];
}

function mostrarToast(mensagem, tipo = 'success') {
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
    setTimeout(() => location.reload(), 2000);
}

const modalEl = document.getElementById('modalExcluirPedido');
let urlAtual = null;

modalEl.addEventListener('show.bs.modal', (e) => {
    const btn = e.relatedTarget;
    urlAtual = btn.dataset.url;
    document.getElementById('id-pedido-modal').textContent = btn.dataset.id;
});

document.getElementById('btn-confirmar-cancelar').addEventListener('click', async () => {
    const res = await fetch(urlAtual, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() }
    });

    if (res.ok) {
        const idPedido = document.getElementById('id-pedido-modal').textContent;
        const modal = bootstrap.Modal.getInstance(modalEl);
        modalEl.addEventListener('hidden.bs.modal', () => {
            mostrarToast(`Pedido #${idPedido} cancelado com sucesso.`);
        }, { once: true });
        modal.hide();
    } else {
        document.getElementById('form-erros-excluir').classList.remove('d-none');
        document.getElementById('form-erros-excluir').textContent = 'Erro ao cancelar pedido.';
    }
});

document.getElementById('modalDetalhePedido').addEventListener('show.bs.modal', function (e) {
    const btn = e.relatedTarget;
    const id = btn.dataset.id;
    const itens = JSON.parse(btn.dataset.itens);
    const total = btn.dataset.total;

    document.getElementById('verPedidoId').textContent = id;
    document.getElementById('verPedidoTotal').textContent = total;

    const tbody = document.getElementById('verPedidoItens');
    tbody.innerHTML = itens.map(item => `
        <tr>
            <td class="produto-nome p-2">${item.produto}</td>
            <td class="text-center p-2">${item.quantidade}</td>
            <td class="text-end p-2">R$ ${item.unitario}</td>
            <td class="text-end p-2 d-none d-sm-table-cell">R$ ${item.subtotal}</td>
        </tr>
    `).join('');
});