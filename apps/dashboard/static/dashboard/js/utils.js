// Pega o token CSRF dos cookies do navegador
function getCsrf() {
    return document.cookie.split(';')
        .find(c => c.trim().startsWith('csrftoken='))
        ?.split('=')[1];
}

// Mostrar mensagens poupups
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
    setTimeout(() => location.reload(), 2000); // Define o tempo para poder dar o reload na página
}

// Mostra o dropdawn da tabela por cima dos itens
document.addEventListener('show.bs.dropdown', function (e) {
    const menu = e.target.nextElementSibling;
    if (!menu || !menu.classList.contains('dropdown-tabela')) return;

    const btn = e.target;
    const rect = btn.getBoundingClientRect();

    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + window.scrollY) + 'px';
    menu.style.left = (rect.left + window.scrollX - menu.offsetWidth + btn.offsetWidth) + 'px';
    menu.style.zIndex = '9999';

    document.body.appendChild(menu);
});

// Pesquisa produtos
const input = document.getElementById('floatingSearch');

let timer;
input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        const q = input.value.trim();
        window.location.href = `?q=${encodeURIComponent(q)}&page=1`;
    }, 350);
});