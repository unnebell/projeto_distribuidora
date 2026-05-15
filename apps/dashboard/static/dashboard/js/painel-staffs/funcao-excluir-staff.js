// Passa as informações dos staff para o modal EXCLUIR
document.getElementById('modalExcluirStaff').addEventListener('show.bs.modal', function(e) {
  const btn = e.relatedTarget;
  document.getElementById('nome-staff-modal').textContent = btn.dataset.nome;
  document.getElementById('id-staff-modal').textContent = btn.dataset.id;
  document.getElementById('btn-desativar').onclick = () => desativarStaff(btn.dataset.id);
  document.getElementById('btn-excluir').onclick = () => excluirStaff(btn.dataset.id);
});

// Função assíncrona para excluir staff
async function excluirStaff(id) {
    const url = urlExcluirStaff.replace('/0/', `/${id}/`);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() }
    });
    const data = await res.json();
    if (data.sucesso) {
        bootstrap.Modal.getInstance(document.getElementById('modalExcluirStaff')).hide();
        mostrarToast(data.mensagem);
}
}

// Função assíncrona para desativar staff
async function desativarStaff(id) {
    const url = urlDesativarStaff.replace('/0/', `/${id}/`);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() }
    });
    const data = await res.json();
    if (data.sucesso) {
        bootstrap.Modal.getInstance(document.getElementById('modalExcluirStaff')).hide();
        mostrarToast(data.mensagem);
}
}

// Função assíncrona para ativar staff
async function ativarStaff(id) {
    const url = urlAtivarStaff.replace('/0/', `/${id}/`);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() }
    });
    const data = await res.json();
    if (data.sucesso) {
        mostrarToast(data.mensagem);
}
}