// Ativa modal para criar um produto
document.getElementById('btn-salvar').addEventListener('click', () => {
  const form = document.getElementById('form-produto');
  const erros = document.getElementById('form-erros');
  const data = new FormData(form);

  fetch( urlAdicionarProduto, {
    method: 'POST',
    headers: { 'X-CSRFToken': data.get('csrfmiddlewaretoken') },
    body: data,
  })
  .then(r => r.json())
  .then(res => {
    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById('modalAdicionarProduto')).hide();
      form.reset();
      erros.classList.add('d-none');

      const tbody = document.querySelector('tbody');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-center px-3 py-2">${res.produto.id}</td>
        <td class="text-center px-3 py-2">${res.produto.nome}</td>
        <td class="text-center px-3 py-2">${res.produto.quantidade}</td>
        <td class="text-center px-3 py-2">${res.produto.descricao}</td>
        <td class="text-center px-3 py-2">R$ ${res.produto.preco}</td>
        <td class="text-center px-3 py-2">
          <a href="#" class="btn btn-sm btn-acao"><i class="bi bi-eye"></i> Ver</a>
          <a href="#" class="btn btn-sm btn-acao"><i class="bi bi-pencil"></i> Editar</a>
          <a href="#" class="btn btn-sm btn-acao"><i class="bi bi-trash"></i> Excluir</a>
        </td>
      `;
      tbody.appendChild(tr);
    } else {
      const msgs = Object.values(res.errors).flat().join('<br>');
      erros.innerHTML = msgs;
      erros.classList.remove('d-none');
    }
  });
});

// Permitindo somente numeração nos campos number

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keydown', function(e) {
        const allowed = ['0','1','2','3','4','5','6','7','8','9',
                         'Backspace','Delete','ArrowLeft','ArrowRight',
                         'ArrowUp','ArrowDown','Tab','.'];
        if (!allowed.includes(e.key)) e.preventDefault();
    });
});

// Mostrando o produto que será excluído no modal
document.getElementById('modalExcluirProduto').addEventListener('show.bs.modal', function(e) {
  const btn = e.relatedTarget;
  document.getElementById('nome-produto-modal').textContent = btn.dataset.nome;
  document.getElementById('id-produto-modal').textContent = btn.dataset.id;
  document.getElementById('btn-desativar').onclick = () => desativarProduto(btn.dataset.id);
  document.getElementById('btn-excluir').onclick = () => excluirProduto(btn.dataset.id);
});