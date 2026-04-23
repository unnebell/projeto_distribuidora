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

// Excluindo produto
function getCsrf() {
    return document.cookie.split(';')
        .find(c => c.trim().startsWith('csrftoken='))
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

async function excluirProduto(id) {
    const url = urlExcluirProduto.replace('/0/', `/${id}/`);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() }
    });
    const data = await res.json();
    if (data.sucesso) {
        bootstrap.Modal.getInstance(document.getElementById('modalExcluirProduto')).hide();
        mostrarToast(data.mensagem);
}
}