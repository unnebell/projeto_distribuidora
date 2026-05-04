function alterarQty(delta) {
    const span = document.getElementById('qtyValor');
    const atual = parseInt(span.textContent);
    const novo = Math.max(1, atual + delta);
    span.textContent = novo;
}

document.getElementById('modalVerProdutoPedido').addEventListener('show.bs.modal', function(e) {
    const trigger = e.relatedTarget?.closest('[data-nome]');
    if (!trigger) return;

    this.dataset.produtoId        = trigger.dataset.id;
    this.dataset.produtoNome      = trigger.dataset.nome;
    this.dataset.produtoDescricao = trigger.dataset.descricao;
    this.dataset.produtoPreco     = trigger.dataset.preco;
    
    const nome = trigger.dataset.nome;
    const descricao = trigger.dataset.descricao;
    const precoRaw = (trigger.dataset.preco || '0').replace(',', '.');
    const preco = parseFloat(precoRaw).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    document.getElementById('verProdutoPedidoNome').textContent = nome;
    document.getElementById('verProdutoPedidoNomeTitulo').textContent = nome;
    document.getElementById('verProdutoPedidoDescricao').textContent = descricao;
    document.getElementById('verProdutoPedidoPreco').textContent = preco;
    document.getElementById('qtyValor').textContent = '1';
});