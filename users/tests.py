from django.test import TestCase, Client

from .models import User

c = Client()
csrf_c = Client(enforce_csrf_checks=True)


def create_user(username, email, password):
    return User.objects.create_user(username=username, email=email, password=password)


class UserTestCase(TestCase):
    def setUp(self) -> None:
        create_user(username='mah_with_email', password='12345678', email='mahmuduly2000@gmail.com')

    # Login
    def test_login_with_wrong_username(self):
        response = c.post('/api/auth/jwt/create/', data={'username': 'mah_with_email1', 'password': '1234568'})
        self.assertEqual(response.status_code, 401, f'Login with wrong password')

    def test_login_with_wrong_password(self):
        response = c.post('/api/auth/jwt/create/', data={'username': 'mah_with_email', 'password': '123456798'})
        self.assertEqual(response.status_code, 401, f'Login with wrong email')

    def test_loginWithUsername(self):
        response = c.post('/api/auth/jwt/create/', data={'username': 'mah_with_email', 'password': '12345678'})
        self.assertEqual(response.status_code, 200, f'Failed to login with username\n{response.json()}')

    # Create users
    def test_create_user_without_email(self):
        response = c.post('/api/auth/users/', username='mah_test', password='12345678')
        self.assertEqual(response.status_code, 400, msg='Shouldn\'t be able to create account without email')

    def test_create_user_duplicate_email(self):
        response = c.post('/api/auth/users/',
                          data={'email': 'mahmuduly2000@gmail.com', 'password': '12345678'})
        self.assertEqual(response.status_code, 400, msg='Shouldn\'t be able to create account with duplicate email')

    def test_createUserWithoutUsername(self):
        response = c.post('/api/auth/users/', data={'email': 'hello@gmail.com', 'password': '12345678',
                                                    're_password': '12345678'})
        self.assertEqual(response.status_code, 400, f'Failed to create account\n{response.json()}')

    def test_createUser(self):
        response = c.post('/api/auth/users/',
                          data={'username': 'userMe', 'email': 'hello@gmail.com', 'password': '12345678Bq@1',
                                're_password': '12345678Bq@1'})
        self.assertEqual(response.status_code, 201, f'Failed to create account\n{response.content}')
