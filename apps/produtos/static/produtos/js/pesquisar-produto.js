const input = document.getElementById('floatingSearch');
const target = document.getElementById('pesquisa-resultados');

if (input && target) {
    let timer;
    let controller;

    function paramsFromUrl() {
        const url = new URL(window.location.href);
        return {
            q: url.searchParams.get('q') || '',
            page: url.searchParams.get('page') || '1',
        };
    }

    function syncUrl(q, page) {
        const url = new URL(window.location.href);
        const trimmed = (q || '').trim();
        if (trimmed) url.searchParams.set('q', trimmed);
        else url.searchParams.delete('q');
        if (page && page !== '1') url.searchParams.set('page', page);
        else url.searchParams.delete('page');
        history.replaceState(null, '', url);
    }

    async function carregar({ q, page } = {}) {
        const query = q !== undefined ? q : input.value.trim();
        const pagina = page || '1';

        if (controller) controller.abort();
        controller = new AbortController();

        const url = new URL(window.location.href);
        if (query) url.searchParams.set('q', query);
        else url.searchParams.delete('q');
        if (pagina !== '1') url.searchParams.set('page', pagina);
        else url.searchParams.delete('page');

        target.classList.add('pesquisa-carregando');

        try {
            const res = await fetch(url, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                signal: controller.signal,
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            target.innerHTML = await res.text();
            syncUrl(query, pagina);
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

    window.addEventListener('popstate', () => {
        const { q, page } = paramsFromUrl();
        input.value = q;
        carregar({ q, page });
    });
}
