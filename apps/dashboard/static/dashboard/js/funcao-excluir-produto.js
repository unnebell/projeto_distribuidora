// Passa as informações dos produtos para o modal EXCLUIR
document.getElementById('modalExcluirProduto').addEventListener('show.bs.modal', function(e) {
  const btn = e.relatedTarget;
  document.getElementById('nome-produto-modal').textContent = btn.dataset.nome;
  document.getElementById('id-produto-modal').textContent = btn.dataset.id;
  document.getElementById('btn-desativar').onclick = () => desativarProduto(btn.dataset.id);
  document.getElementById('btn-excluir').onclick = () => excluirProduto(btn.dataset.id);
});

// Função assíncrona para excluir produto
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

// Função assíncrona para desativar produto
async function desativarProduto(id) {
    const url = urlDesativarProduto.replace('/0/', `/${id}/`);
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

// Função assíncrona para ativar produto
async function ativarProduto(id) {
    const url = urlAtivarProduto.replace('/0/', `/${id}/`);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() }
    });
    const data = await res.json();
    if (data.sucesso) {
        mostrarToast(data.mensagem);
}
}