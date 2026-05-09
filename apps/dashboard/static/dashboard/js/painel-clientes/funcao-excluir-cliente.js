// Passa as informações dos cliente para o modal EXCLUIR
document.getElementById('modalExcluirCliente').addEventListener('show.bs.modal', function(e) {
  const btn = e.relatedTarget;
  document.getElementById('nome-cliente-modal').textContent = btn.dataset.nome;
  document.getElementById('id-cliente-modal').textContent = btn.dataset.id;
  document.getElementById('btn-desativar').onclick = () => desativarCliente(btn.dataset.id);
  document.getElementById('btn-excluir').onclick = () => excluirCliente(btn.dataset.id);
});

// Função assíncrona para excluir cliente
async function excluirCliente(id) {
    const url = urlExcluirCliente.replace('/0/', `/${id}/`);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() }
    });
    const data = await res.json();
    if (data.sucesso) {
        bootstrap.Modal.getInstance(document.getElementById('modalExcluirCliente')).hide();
        mostrarToast(data.mensagem);
}
}

// Função assíncrona para desativar cliente
async function desativarCliente(id) {
    const url = urlDesativarCliente.replace('/0/', `/${id}/`);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() }
    });
    const data = await res.json();
    if (data.sucesso) {
        bootstrap.Modal.getInstance(document.getElementById('modalExcluirCliente')).hide();
        mostrarToast(data.mensagem);
}
}

// Função assíncrona para ativar cliente
async function ativarCliente(id) {
    const url = urlAtivarCliente.replace('/0/', `/${id}/`);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() }
    });
    const data = await res.json();
    if (data.sucesso) {
        mostrarToast(data.mensagem);
}
}