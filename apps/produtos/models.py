from django.db import models
from django.contrib import admin

# Create your models here.
class Produto(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade = models.IntegerField()
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return self.nome
    
admin.site.register(Produto)