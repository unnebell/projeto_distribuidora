from django.db.models.signals import post_save, post_delete
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.contrib.auth.models import User
from apps.produtos.models import Produto
from apps.pedidos.models import Pedido
from .models import Atividade
from apps.dashboard.middleware import get_current_user

# Adicionar ou atualizar produto
@receiver(post_save, sender=Produto)
def produto_salvo(sender, instance, created, **kwargs):
    usuario = get_current_user()
    if usuario and usuario.is_authenticated and usuario.is_staff:
        if created:
            Atividade.objects.create(
                tipo='produto_criado',
                descricao=f'Produto "{instance.nome}" foi cadastrado por {usuario.get_full_name() or usuario.username}.',
                usuario=usuario,
            )
        else:
            Atividade.objects.create(
                tipo='produto_editado',
                descricao=f'Produto "{instance.nome}" foi atualizado por {usuario.get_full_name() or usuario.username}.',
                usuario=usuario,
            )

# remoção de produto
@receiver(post_delete, sender=Produto)
def produto_deletado(sender, instance, **kwargs):
    usuario = get_current_user()
    if usuario and usuario.is_authenticated and usuario.is_staff:
        Atividade.objects.create(
            tipo='produto_deletado',
            descricao=f'Produto "{instance.nome}" foi removido por {usuario.get_full_name() or usuario.username}.',
            usuario=usuario,
        )

# criação de pedido
@receiver(post_save, sender=Pedido)
def pedido_criado(sender, instance, created, **kwargs):
    if created:
        usuario = get_current_user()
        if usuario and usuario.is_authenticated:
            Atividade.objects.create(
                tipo='pedido_criado',
                descricao=f'Pedido #{instance.pk} criado por {usuario.get_full_name() or usuario.username}.',
                usuario=usuario,
            )

# cancelamento ou remoção de pedido
@receiver(post_delete, sender=Pedido)
def pedido_deletado(sender, instance, **kwargs):
    usuario = get_current_user()
    if usuario and usuario.is_authenticated:
        Atividade.objects.create(
            tipo='pedido_deletado',
            descricao=f'Pedido #{instance.pk} foi cancelado/removido por {usuario.get_full_name() or usuario.username}.',
            usuario=usuario,
        )

# login de usuario
@receiver(user_logged_in)
def usuario_login(sender, request, user, **kwargs):
    Atividade.objects.create(
        tipo='login',
        descricao=f'{user.get_full_name() or user.username} fez login.',
        usuario=user,
    )

# registro de usuario
@receiver(post_save, sender=User)
def usuario_registro(sender, instance, created, **kwargs):
    if created:
        Atividade.objects.create(
            tipo='registro',
            descricao=f'Novo registro: {instance.username}.',
            usuario=instance,
        )