// Passa as informações dos produtos para o modal VER
document.getElementById('modalVerProduto').addEventListener('show.bs.modal', function (e) {
  const btn = e.relatedTarget.closest('[data-id]');
  document.getElementById('verProdutoId').textContent        = btn.dataset.id;
  document.getElementById('verProdutoNome').textContent      = btn.dataset.nome;
  document.getElementById('verProdutoQtd').textContent       = btn.dataset.qtd;
  document.getElementById('verProdutoDescricao').textContent = btn.dataset.descricao;
  document.getElementById('verProdutoPreco').textContent     = btn.dataset.preco;
});