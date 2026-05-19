document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
        // 1. Impede o comportamento padrão de atualizar a URL
        event.preventDefault(); 
        
        // 2. Pega o ID da seção alvo através do atributo data-target
        const targetId = this.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        // 3. Faz a rolagem suave até o elemento
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth', // Rolagem suave animada
                block: 'start'      // Alinha o topo da seção com o topo da tela
            });
        }
    });
});