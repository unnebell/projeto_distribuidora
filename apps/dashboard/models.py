from django.db import models
from django.contrib.auth.models import User

class Atividade(models.Model):
    TIPOS = [
        ('produto_criado',   'Produto criado'),
        ('produto_editado',  'Produto editado'),
        ('produto_deletado', 'Produto deletado'),
        ('login',    'Login'),
        ('registro', 'Registro'),
        ('pedido_criado',    'Pedido criado'),
        ('pedido_deletado',  'Pedido deletado'),
    ]

    tipo      = models.CharField(max_length=30, choices=TIPOS)
    descricao = models.CharField(max_length=255)
    usuario   = models.ForeignKey(User, null=True, blank=True,
                                  on_delete=models.SET_NULL)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Atividade'
        verbose_name_plural = 'Atividades'

    def __str__(self):
        return f'{self.tipo} — {self.criado_em:%d/%m/%Y %H:%M}'