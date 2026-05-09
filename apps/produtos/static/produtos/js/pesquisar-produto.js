const input = document.getElementById('floatingSearch');

let timer;
input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        const q = input.value.trim();
        window.location.href = `?q=${encodeURIComponent(q)}&page=1`;
    }, 1000);//tempo de esperar para atualizar a pagina após fazer uma pesquisa
});