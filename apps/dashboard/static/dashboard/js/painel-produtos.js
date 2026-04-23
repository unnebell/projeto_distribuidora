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
        <td class="text-center px-2 py-2">${res.produto.id}</td>
        <td class="text-center px-2 py-2">${res.produto.nome}</td>
        <td class="text-center px-2 py-2">${res.produto.quantidade}</td>
        <td class="text-center px-2 py-2 col-descricao">${res.produto.descricao.substring(0, 15)}${res.produto.descricao.length > 15 ? '...' : ''}</td>
        <td class="text-center px-2 py-2 col-preco">R$ ${res.produto.preco}</td>
        <td class="text-center px-2 py-2">
          <!-- Desktop -->
          <div class="d-none d-md-flex justify-content-center gap-1">
            <a class="btn btn-sm btn-acao" title="Ver"><i class="bi bi-eye"></i> <span>Ver</span></a>
            <a class="btn btn-sm btn-acao" title="Editar"><i class="bi bi-pencil"></i> <span>Editar</span></a>
            <a class="btn btn-sm btn-acao" title="Excluir"
              data-bs-toggle="modal"
              data-bs-target="#modalExcluirProduto"
              data-id="${res.produto.id}"
              data-nome="${res.produto.nome}">
              <i class="bi bi-trash"></i> <span>Excluir</span>
            </a>
          </div>
          <!-- Mobile -->
          <div class="d-md-none dropdown">
            <button class="btn btn-sm btn-acao dropdown-toggle" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-custom">
              <li><a class="dropdown-item"><i class="bi bi-eye"></i> Ver</a></li>
              <li><a class="dropdown-item"><i class="bi bi-pencil"></i> Editar</a></li>
              <li>
                <a class="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#modalExcluirProduto"
                  data-id="${res.produto.id}"
                  data-nome="${res.produto.nome}">
                  <i class="bi bi-trash"></i> Excluir
                </a>
              </li>
            </ul>
          </div>
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