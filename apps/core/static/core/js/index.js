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