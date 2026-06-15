from django.test import TestCase
from django.contrib.auth.models import User
from apps.produtos.models import Produto
from apps.pedidos.models import Pedido
from apps.dashboard.models import Atividade
from apps.dashboard.middleware import _local

class DashboardSignalsTest(TestCase):
    def setUp(self):
        # Create users
        self.staff_user = User.objects.create_user(
            username='staff',
            password='password123',
            is_staff=True,
            first_name='Fábio',
            last_name='Staff'
        )
        self.client_user = User.objects.create_user(
            username='client',
            password='password123',
            is_staff=False,
            first_name='Jordana',
            last_name='Client'
        )
        # Ensure thread local user is cleared before each test
        if hasattr(_local, 'user'):
            delattr(_local, 'user')
        # Clear auto-generated registration activities to start tests with a clean slate
        Atividade.objects.all().delete()

    def tearDown(self):
        # Clear thread local user
        if hasattr(_local, 'user'):
            delattr(_local, 'user')

    def test_product_activity_logged_for_staff(self):
        """Verify that product creation and editing by a staff member logs activities."""
        _local.user = self.staff_user
        
        # Test creation
        produto = Produto.objects.create(
            nome="Produto Teste",
            descricao="Descrição Teste",
            preco=10.00,
            quantidade=100
        )
        
        activities = Atividade.objects.filter(usuario=self.staff_user)
        self.assertEqual(activities.count(), 1)
        self.assertEqual(activities[0].tipo, 'produto_criado')
        self.assertIn('cadastrado por Fábio Staff', activities[0].descricao)
        
        # Test edit
        produto.nome = "Produto Editado"
        produto.save()
        
        activities = Atividade.objects.filter(usuario=self.staff_user).order_by('-criado_em')
        self.assertEqual(activities.count(), 2)
        self.assertEqual(activities[0].tipo, 'produto_editado')
        self.assertIn('atualizado por Fábio Staff', activities[0].descricao)

    def test_product_activity_not_logged_for_client(self):
        """Verify that product creation and editing by a client does NOT log activities."""
        _local.user = self.client_user
        
        # Test creation
        produto = Produto.objects.create(
            nome="Produto Cliente",
            descricao="Descrição Teste",
            preco=10.00,
            quantidade=100
        )
        
        activities = Atividade.objects.filter(tipo__in=['produto_criado', 'produto_editado'])
        self.assertEqual(activities.count(), 0)
        
        # Test edit
        produto.quantidade = 90
        produto.save()
        
        activities = Atividade.objects.filter(tipo__in=['produto_criado', 'produto_editado'])
        self.assertEqual(activities.count(), 0)

    def test_product_activity_not_logged_without_user(self):
        """Verify that product creation and editing without user context (e.g. system tasks) does NOT log activities and does not crash."""
        if hasattr(_local, 'user'):
            delattr(_local, 'user')
            
        produto = Produto.objects.create(
            nome="Produto Sistema",
            descricao="Descrição Teste",
            preco=10.00,
            quantidade=100
        )
        
        activities = Atividade.objects.filter(tipo__in=['produto_criado', 'produto_editado'])
        self.assertEqual(activities.count(), 0)

    def test_pedido_activity_logged_for_client(self):
        """Verify that order activities are logged for clients."""
        _local.user = self.client_user
        
        pedido = Pedido.objects.create(cliente=self.client_user)
        
        activities = Atividade.objects.filter(usuario=self.client_user)
        self.assertEqual(activities.count(), 1)
        self.assertEqual(activities[0].tipo, 'pedido_criado')
        self.assertIn('Pedido #', activities[0].descricao)
        self.assertIn('criado por Jordana Client', activities[0].descricao)
