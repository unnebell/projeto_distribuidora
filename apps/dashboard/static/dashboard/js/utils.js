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
    setTimeout(() => location.reload(), 2000);
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

// Pesquisa produtos/clientes/staffs sem reload
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('floatingSearch');
    const target = document.getElementById('pesquisa-resultados');
    if (!input || !target) return;

    let timer;
    let controller;
    let currentSort = new URL(window.location.href).searchParams.get('sort') || '';

    function paramsFromUrl() {
        const url = new URL(window.location.href);
        return {
            q: url.searchParams.get('q') || '',
            page: url.searchParams.get('page') || '1',
            sort: url.searchParams.get('sort') || '',
        };
    }

    function syncUrl(q, page, sort) {
        const url = new URL(window.location.href);
        const trimmed = (q || '').trim();
        if (trimmed) url.searchParams.set('q', trimmed);
        else url.searchParams.delete('q');
        if (page && page !== '1') url.searchParams.set('page', page);
        else url.searchParams.delete('page');
        if (sort) url.searchParams.set('sort', sort);
        else url.searchParams.delete('sort');
        history.replaceState(null, '', url);
    }

    function atualizarBotoesSort(sort) {
        document.querySelectorAll('.btn-sort').forEach(btn => {
            if (btn.dataset.sort === sort) {
                btn.classList.add('active', 'btn-secondary');
                btn.classList.remove('btn-outline-secondary');
            } else {
                btn.classList.remove('active', 'btn-secondary');
                btn.classList.add('btn-outline-secondary');
            }
        });
    }

    // Inicializa estado visual dos botões
    atualizarBotoesSort(currentSort);

    async function carregar({ q, page, sort } = {}) {
        const query = q !== undefined ? q : input.value.trim();
        const pagina = page || '1';
        const sorting = sort !== undefined ? sort : currentSort;
        currentSort = sorting;

        if (controller) controller.abort();
        controller = new AbortController();

        const url = new URL(window.location.href);
        if (query) url.searchParams.set('q', query);
        else url.searchParams.delete('q');
        if (pagina !== '1') url.searchParams.set('page', pagina);
        else url.searchParams.delete('page');
        if (sorting) url.searchParams.set('sort', sorting);
        else url.searchParams.delete('sort');

        target.classList.add('pesquisa-carregando');

        try {
            const res = await fetch(url, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                signal: controller.signal,
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            target.innerHTML = await res.text();
            syncUrl(query, pagina, sorting);
            atualizarBotoesSort(sorting);
        } catch (err) {
            if (err.name !== 'AbortError') console.error('Pesquisa:', err);
        } finally {
            target.classList.remove('pesquisa-carregando');
        }
    }

    input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => carregar({ page: '1' }), 400);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(timer);
            carregar({ page: '1' });
        }
    });

    target.addEventListener('click', (e) => {
        const link = e.target.closest('[data-pesquisa-page]');
        if (!link) return;
        e.preventDefault();
        carregar({ page: link.dataset.pesquisaPage });
    });

    document.querySelectorAll('.btn-sort').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            carregar({ page: '1', sort: btn.dataset.sort });
        });
    });

    window.addEventListener('popstate', () => {
        const { q, page, sort } = paramsFromUrl();
        input.value = q;
        currentSort = sort;
        atualizarBotoesSort(sort);
        carregar({ q, page, sort });
    });
});

