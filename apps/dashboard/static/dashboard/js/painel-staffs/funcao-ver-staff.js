// Passa as informações dos clientes para o modal VER
document.getElementById('modalVerStaff').addEventListener('show.bs.modal', function (e) {
  const btn = e.relatedTarget.closest('[data-id]');
  document.getElementById('verStaffId').textContent        = btn.dataset.id;
  document.getElementById('verStaffNome').textContent      = btn.dataset.nome;
  document.getElementById('verStaffEmail').textContent     = btn.dataset.email;
  document.getElementById('verStaffJoined').textContent    = btn.dataset.joined;
  document.getElementById('verStaffLastLogin').textContent = btn.dataset.lastlogin;
  document.getElementById('verStaffNomeHeader').textContent = btn.dataset.nome;
});