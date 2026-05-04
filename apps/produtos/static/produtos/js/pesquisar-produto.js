const input = document.getElementById('floatingSearch');
const grid  = document.querySelector('.row.g-4');

let timer;
input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        const q = input.value.trim();
        const url = `?q=${encodeURIComponent(q)}`;
        
        fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newGrid = doc.querySelector('.row.g-4');
                if (newGrid) grid.innerHTML = newGrid.innerHTML;
            });
    }, 350);
});

