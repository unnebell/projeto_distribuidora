function alterarQty(delta) {
    const span = document.getElementById('qtyValor');
    const atual = parseInt(span.textContent);
    const modal = document.getElementById('modalVerProdutoPedido');
    const maxQty = parseInt(modal.dataset.produtoQuantidade || '999');
    const novo = Math.max(1, Math.min(atual + delta, maxQty));
    span.textContent = novo;
}

document.getElementById('modalVerProdutoPedido').addEventListener('show.bs.modal', function(e) {
    const trigger = e.relatedTarget?.closest('[data-nome]');
    if (!trigger) return;

    this.dataset.produtoId        = trigger.dataset.id;
    this.dataset.produtoNome      = trigger.dataset.nome;
    this.dataset.produtoDescricao = trigger.dataset.descricao;
    this.dataset.produtoPreco     = trigger.dataset.preco;
    this.dataset.produtoQuantidade = trigger.dataset.quantidade;
    
    const nome = trigger.dataset.nome;
    const descricao = trigger.dataset.descricao;
    const precoRaw = (trigger.dataset.preco || '0').replace(/\./g, '').replace(',', '.');
    const preco = parseFloat(precoRaw).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    const estoque = trigger.dataset.quantidade || '0';

    document.getElementById('verProdutoPedidoNome').textContent = nome;
    document.getElementById('verProdutoPedidoNomeTitulo').textContent = nome;
    document.getElementById('verProdutoPedidoDescricao').textContent = descricao;
    document.getElementById('verProdutoPedidoPreco').textContent = preco;
    document.getElementById('verProdutoPedidoEstoque').textContent = estoque;
    document.getElementById('qtyValor').textContent = '1';
});