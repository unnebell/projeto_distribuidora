function alterarQty(delta) {
    const span = document.getElementById('qtyValor');
    const atual = parseInt(span.textContent);
    const novo = Math.max(1, atual + delta);
    span.textContent = novo;
}