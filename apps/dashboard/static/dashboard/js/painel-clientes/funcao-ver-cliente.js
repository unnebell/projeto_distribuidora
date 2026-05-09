// Passa as informações dos clientes para o modal VER
document.getElementById('modalVerCliente').addEventListener('show.bs.modal', function (e) {
  const btn = e.relatedTarget.closest('[data-id]');
  document.getElementById('verClienteId').textContent            = btn.dataset.id;
  document.getElementById('verClienteNome').textContent          = btn.dataset.nome;
  document.getElementById('verClienteEmail').textContent         = btn.dataset.email;
  document.getElementById('verClienteJoined').textContent        = btn.dataset.joined;
  document.getElementById('verClienteLastLogin').textContent     = btn.dataset.lastlogin;
  document.getElementById('verClienteNomeHeader').textContent = btn.dataset.nome;
});