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

// Envio de formulário via AJAX para o StaticForms
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o redirecionamento padrão

        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerText;

        // Feedback visual de carregamento
        submitButton.disabled = true;
        submitButton.innerText = 'Enviando...';

        try {
            const response = await fetch('https://api.staticforms.dev/submit', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Solicita resposta em JSON
                }
            });

            const result = await response.json();

            const toastEl = document.getElementById('contatoToast');
            const toastBody = document.getElementById('contatoToastBody');
            const toast = new bootstrap.Toast(toastEl);

            // Limpa as classes de cor anteriores
            toastEl.classList.remove('text-bg-success', 'text-bg-danger');

            if (result.success) {
                toastEl.classList.add('text-bg-success');
                toastBody.innerText = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                contactForm.reset();
                toast.show();
            } else {
                toastEl.classList.add('text-bg-danger');
                toastBody.innerText = 'Ocorreu um erro ao enviar a mensagem: ' + (result.message || 'Tente novamente.');
                toast.show();
            }
        } catch (error) {
            const toastEl = document.getElementById('contatoToast');
            const toastBody = document.getElementById('contatoToastBody');
            const toast = new bootstrap.Toast(toastEl);
            
            toastEl.classList.remove('text-bg-success', 'text-bg-danger');
            toastEl.classList.add('text-bg-danger');
            toastBody.innerText = 'Erro de conexão ao enviar a mensagem. Verifique sua internet e tente novamente.';
            toast.show();
        } finally {
            // Restaura o botão
            submitButton.disabled = false;
            submitButton.innerText = originalButtonText;
        }
    });
}