// Passa as informações dos produtos para o modal EDITAR
document.getElementById('modalEditarStaff').addEventListener('show.bs.modal', function (e) {
  const btn = e.relatedTarget; // <- tirar o .closest
  document.getElementById('editarStaffId').value         = btn.dataset.id;
  document.getElementById('editarStaffNome').textContent = btn.dataset.nome;
  document.getElementById('editarInputNome').value       = btn.dataset.nome;
  document.getElementById('editarInputEmail').value      = btn.dataset.email;
});

// Salva a edição via AJAX
document.getElementById('btn-salvar-edicao').addEventListener('click', () => {
  const form = document.getElementById('form-editar-staff');
  const erros = document.getElementById('editar-form-erros');
  const id = document.getElementById('editarStaffId').value;
  const data = new FormData(form);
  const url = urlEditarStaff.replace('/0/', `/${id}/`);

  fetch(url, {
    method: 'POST',
    headers: { 'X-CSRFToken': data.get('csrfmiddlewaretoken') },
    body: data,
  })
  .then(r => r.json())
  .then(res => {
    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById('modalEditarStaff')).hide();
      erros.classList.add('d-none');
      mostrarToast(res.mensagem);
    } else {
      const msgs = Object.values(res.errors).flat().join('<br>');
      erros.innerHTML = msgs;
      erros.classList.remove('d-none');
    }
  });
});