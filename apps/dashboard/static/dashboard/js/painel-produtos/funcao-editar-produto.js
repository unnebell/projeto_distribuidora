// Passa as informações dos produtos para o modal EDITAR
document.getElementById('modalEditarProduto').addEventListener('show.bs.modal', function (e) {
  const btn = e.relatedTarget.closest('[data-id]');
  document.getElementById('editarProdutoId').value         = btn.dataset.id;
  document.getElementById('editarProdutoNome').textContent = btn.dataset.nome;
  document.getElementById('editarInputNome').value         = btn.dataset.nome;
  document.getElementById('editarInputDescricao').value    = btn.dataset.descricao;
  document.getElementById('editarInputPreco').value = btn.dataset.preco.replace(',', '.');
  document.getElementById('editarInputQtd').value          = btn.dataset.qtd;
});

// Salva a edição via AJAX
document.getElementById('btn-salvar-edicao').addEventListener('click', () => {
  const form = document.getElementById('form-editar-produto');
  const erros = document.getElementById('editar-form-erros');
  const id = document.getElementById('editarProdutoId').value;
  const data = new FormData(form);
  const url = urlEditarProduto.replace('/0/', `/${id}/`);

  fetch(url, {
    method: 'POST',
    headers: { 'X-CSRFToken': data.get('csrfmiddlewaretoken') },
    body: data,
  })
  .then(r => r.json())
  .then(res => {
    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById('modalEditarProduto')).hide();
      erros.classList.add('d-none');
      mostrarToast(res.mensagem);
    } else {
      const msgs = Object.values(res.errors).flat().join('<br>');
      erros.innerHTML = msgs;
      erros.classList.remove('d-none');
    }
  });
});