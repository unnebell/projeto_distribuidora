// Efeito de fade-in para os elementos com a classe 'reveal' ao entrarem na viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Só links de âncora da home (data-target); Login/Cadastre-se seguem o href normalmente
document.querySelectorAll('.nav-link[data-target]').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const targetSection = document.getElementById(this.getAttribute('data-target'));
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});