from django.db import models
from django.contrib.auth.models import User
from apps.produtos.models import Produto

class Pedido(models.Model):
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Concluído', 'Concluído'),
    ]

    cliente = models.ForeignKey(User, on_delete=models.PROTECT, related_name='pedidos')
    criado_em = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')

    def total(self):
        return sum(item.subtotal() for item in self.itens.all())

    def __str__(self):
        return f'Pedido #{self.pk} - {self.cliente.username} - {self.status}'


class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    quantidade = models.PositiveIntegerField()
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.quantidade * self.preco_unitario

    def __str__(self):
        return f'{self.quantidade}x {self.produto.nome}'