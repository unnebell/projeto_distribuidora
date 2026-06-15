// Passa as informações dos produtos para o modal EDITAR
document.getElementById('modalEditarCliente').addEventListener('show.bs.modal', function (e) {
  const btn = e.relatedTarget.closest('[data-id]');
  document.getElementById('editarClienteId').value         = btn.dataset.id;
  document.getElementById('editarClienteNome').textContent = btn.dataset.nome;
  document.getElementById('editarInputNome').value         = btn.dataset.nome;
  document.getElementById('editarInputEmail').value    = btn.dataset.email;
});

// Salva a edição via AJAX
document.getElementById('btn-salvar-edicao').addEventListener('click', () => {
  const form = document.getElementById('form-editar-cliente');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const erros = document.getElementById('editar-form-erros');
  const id = document.getElementById('editarClienteId').value;
  const data = new FormData(form);
  const url = urlEditarCliente.replace('/0/', `/${id}/`);

  fetch(url, {
    method: 'POST',
    headers: { 'X-CSRFToken': data.get('csrfmiddlewaretoken') },
    body: data,
  })
  .then(r => r.json())
  .then(res => {
    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById('modalEditarCliente')).hide();
      erros.classList.add('d-none');
      mostrarToast(res.mensagem);
    } else {
      const msgs = Object.values(res.errors).flat().join('<br>');
      erros.innerHTML = msgs;
      erros.classList.remove('d-none');
    }
  });
});