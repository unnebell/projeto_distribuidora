// Ativa modal para criar um cliente
document.getElementById('btn-salvar').addEventListener('click', () => {
  const form = document.getElementById('form-cliente');
  const erros = document.getElementById('form-erros');
  const data = new FormData(form);

  fetch( urlAdicionarCliente, {
    method: 'POST',
    headers: { 'X-CSRFToken': data.get('csrfmiddlewaretoken') },
    body: data,
  })
  .then(r => r.json())
  .then(res => {
    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById('modalAdicionarCliente')).hide();
      form.reset();
      erros.classList.add('d-none');

      const tbody = document.querySelector('tbody');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-center px-2 py-2">${res.cliente.id}</td>
        <td class="text-center px-2 py-2">${res.cliente.nome}</td>
        <td class="text-center px-2 py-2 col-email">${res.cliente.email}</td>
        <td class="text-center px-2 py-2">—</td>
        <td class="text-center px-2 py-2">—</td>
        <td class="text-center px-2 py-2">
          <a href="#" class="btn btn-sm btn-acao"
              data-bs-toggle="modal"
              data-bs-target="#modalVerCliente"
              data-id="${res.cliente.id}"
              data-nome="${res.cliente.nome}"
              data-email="${res.cliente.email}"
              data-joined="—"
              data-lastlogin="—"
              title="Ver">
            <i class="bi bi-eye"></i> <span>Ver</span>
          </a>
          <a href="#" class="btn btn-sm btn-acao"
              data-bs-toggle="modal"
              data-bs-target="#modalEditarCliente"
              data-id="${res.cliente.id}"
              data-nome="${res.cliente.nome}"
              data-email="${res.cliente.email}"
              title="Editar">
            <i class="bi bi-pencil"></i> <span>Editar</span>
          </a>
          <a href="#" class="btn btn-sm btn-acao"
              data-bs-toggle="modal"
              data-bs-target="#modalExcluirCliente"
              data-id="${res.cliente.id}"
              data-nome="${res.cliente.nome}"
              title="Excluir">
            <i class="bi bi-trash"></i> <span>Excluir</span>
          </a>
        </td>
      `;
      tbody.appendChild(tr);
      mostrarToast(`Cliente ${res.cliente.nome} adicionado com sucesso!`);
    } else {
      const msgs = Object.values(res.errors).flat().join('<br>');
      erros.innerHTML = msgs;
      erros.classList.remove('d-none');
    }
  });
});
