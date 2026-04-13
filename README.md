# 🖥️ FAHAN Distribuidora Tech

Sistema web de gerenciamento para distribuidora de tecnologia, desenvolvido como projeto integrador do curso técnico de Informática da **EETEPA Deodoro de Mendonça**.

---

## 📋 Sobre o Projeto

A **FAHAN Distribuidora Tech** é uma aplicação web fullstack construída com Django que simula o sistema interno de uma distribuidora de produtos de tecnologia. O sistema contempla autenticação de usuários, painel administrativo com CRUD de produtos.

---

## ✨ Funcionalidades

- **Autenticação** — Cadastro, login e logout com notificações toast e redirecionamento automático
- **Painel Administrativo** — Gerenciamento completo de produtos (criar, visualizar, editar e excluir), restrito a staff
- **Interface Responsiva** — Layout adaptado para desktop e mobile com Bootstrap 5
- **Em desenvolvimento...**

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Backend | Python · Django |
| Frontend | HTML5 · CSS3 · JavaScript · Bootstrap 5 |
| Banco de Dados | SQLite3 |
| Variáveis de Ambiente | python-dotenv |

---

## 📁 Estrutura do Projeto

```projeto_distribuidora/
├── apps/
│   ├── auth/          
│   ├── core/
│   ├── dashboard/
│   ├── pedidos/
│   ├── produtos/
│
├── prj_distribuidora/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── static/
│   ├── css/
│   ├── img/
│   └── js/
│
├── templates/
│   └── base.html
│
├── .env                # Variáveis de ambiente (não comitado)
├── .gitignore          
├── db.sqlite3          # Banco de dados local (não comitado)
├── manage.py          
└── requirements.txt    # Dependências do projeto
```

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

- Python 3.11+
- Git

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/unnebell/projeto_distribuidora.git
cd projeto_distribuidora
```

**2. Crie e ative o ambiente virtual**
```bash
# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# Linux / macOS
python -m venv .venv
source .venv/bin/activate
```

**3. Instale as dependências**
```bash
pip install -r requirements.txt
```

**4. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
```

> Para gerar uma `SECRET_KEY` segura:
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```

**5. Execute as migrações**
```bash
python manage.py migrate
```

**6. Crie um superusuário (acesso ao painel admin)**
```bash
python manage.py createsuperuser
```

**7. Inicie o servidor**
```bash
python manage.py runserver
```

Acesse em: [http://localhost:8000](http://localhost:8000)

---

## 👥 Equipe

Projeto desenvolvido por alunos do curso técnico de Informática da EETEPA Deodoro de Mendonça:

| Nome | Função |
|---|---|
| Fábio | Desenvolvedor Fullstack |
| Adriele | Front-End |
| Andreia | Banco de Dados |
| Maria de Nazaré | Designer |
| Helionete | Documentadora |

---

## 🏫 Instituição

**EETEPA Deodoro de Mendonça**  
Escola de Educação Técnica e Profissional do Pará  
Curso Técnico em Informática

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.
