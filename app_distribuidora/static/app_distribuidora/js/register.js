// Valida quando o usuário SAI do campo (onblur)
document.getElementById('username').addEventListener('blur', function() {
    if (!this.value.trim()) {
        this.classList.add('is-invalid');
        this.placeholder = 'Preencha o usuário.';
    } else {
        this.classList.remove('is-invalid');
    }
});

document.getElementById('email').addEventListener('blur', function() {
    if (!this.value.trim()) {
        this.classList.add('is-invalid');
        this.placeholder = 'Preencha o email.';
    } else {
        this.classList.remove('is-invalid');
    }
});

document.getElementById('senha').addEventListener('blur', function() {
    if (!this.value.trim()) {
        this.classList.add('is-invalid');
        this.placeholder = 'Preencha a senha.';
    } else {
        this.classList.remove('is-invalid');
    }
});

// Remove o erro enquanto digita
document.getElementById('username').addEventListener('input', function() {
    if (this.value.trim()) this.classList.remove('is-invalid');
});

document.getElementById('email').addEventListener('input', function() {
    if (this.value.trim()) this.classList.remove('is-invalid');
});

document.getElementById('senha').addEventListener('input', function() {
    if (this.value.trim()) this.classList.remove('is-invalid');
});

// Valida tudo antes de submeter
document.getElementById('formRegister').addEventListener('submit', function(e) {
    const campos = [
        { id: 'username', msg: 'Preencha o usuário.' },
        { id: 'email',    msg: 'Preencha o email.' },
        { id: 'senha',    msg: 'Preencha a senha.' },
    ];

    let valido = true;
    campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            input.placeholder = campo.msg;
            valido = false;
        }
    });

    if (!valido) e.preventDefault();
});

// =======================================================

// função para mostrar/ocultar senha
document.getElementById('toggleSenha').addEventListener('touchstart', function(e) {
    e.preventDefault();
    toggleSenha('senha', this);
});

document.getElementById('toggleSenha').addEventListener('click', function(e) {
    toggleSenha('senha', this);
});

function toggleSenha(inputId, icone) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icone.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        input.type = 'password';
        icone.classList.replace('bi-eye-slash', 'bi-eye');
    }
}