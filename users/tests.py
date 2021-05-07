from django.test import TestCase, Client

from .models import User

c = Client()
csrf_c = Client(enforce_csrf_checks=True)


class UserTestCase(TestCase):
    def setUp(self) -> None:
        User.objects.create_user(username='mah_with_email', password='12345678', email='mahmuduly2000@gmail.com')

    # Login
    def test_loginWithEmail(self):
        response = c.post('/users/login/', data={'email': 'mahmuduly2000@gmail.com', 'password': '12345678'})
        self.assertEqual(response.status_code, 200, f'Failed to login email\n{response.json()}')

    def test_loginWithEmailWrongPass(self):
        response = c.post('/users/login/', data={'email': 'mahmuduly2000@gmail.com', 'password': '1234568'})
        self.assertEqual(response.status_code, 400, f'Login with wrong password')

    def test_loginWithEmailWrongEmail(self):
        response = c.post('/users/login/', data={'email': 'mahmuuly2000@gmail.com', 'password': '12345678'})
        self.assertEqual(response.status_code, 400, f'Login with wrong email')

    def test_loginWithUsername(self):
        response = c.post('/users/login/', data={'username': 'mah_with_email', 'password': '12345678'})
        self.assertEqual(response.status_code, 200, f'Failed to login with username\n{response.json()}')

    # Create users
    def test_create_user_without_email(self):
        response = c.post('/users/create-user-unsafe/', username='mah_test', password='12345678')
        self.assertEqual(response.status_code, 400, msg='Shouldn\'t be able to create account without email')

    def test_create_user_duplicate_email(self):
        response = c.post('/users/create-user-unsafe/',
                          data={'email': 'mahmuduly2000@gmail.com', 'password': '12345678'})
        self.assertEqual(response.status_code, 400, msg='Shouldn\'t be able to create account with duplicate email')

    def test_createUserWithoutUsername(self):
        response = c.post('/users/create-user-unsafe/', data={'email': 'hello@gmail.com', 'password': '12345678'})
        self.assertEqual(response.status_code, 201, f'Failed to create account\n{response.json()}')

    def test_createUser(self):
        response = c.post('/users/create-user-unsafe/',
                          data={'username': 'userMe', 'email': 'hello@gmail.com', 'password': '12345678'})
        self.assertEqual(response.status_code, 201, f'Failed to create account\n{response.json()}')
