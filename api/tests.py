from django.core import mail
from django.test import TestCase, Client
from django.urls import reverse

from b12j import settings
from users.models import User

c = Client()


def login(user: User):
    c.force_login(user, settings.AUTHENTICATION_BACKENDS[0])


class UserTestCase(TestCase):
    def setUp(self) -> None:
        self.api = '/api/auth/users/'

    def test_register_user(self):
        res = c.post(self.api, {
            'username': 'test1',
            'email': 'hello1@gmail.com',
            'first_name': 'Mahmudul',
            'last_name': 'Alam',
            'password': 'DjangoTestPass',
            're_password': 'DjangoTestPass',
        })
        self.assertEqual(res.status_code, 201, 'Register User API')
        user_id = res.json()['id']
        user = User.objects.get(pk=user_id)
        self.assertEqual(user.is_active, False, 'Email must be confirmed')
        self.assertEqual(user.username, 'test1', 'Email must be confirmed')
        self.assertEqual(user.email, 'hello1@gmail.com', 'Email must be confirmed')
        token = mail.outbox[0].body.split('\n')[3].split('/')[6]
        uid = mail.outbox[0].body.split('\n')[3].split('/')[5]
        res = c.post(reverse('user-activation'), data={'uid': uid, 'token': token})
        self.assertEqual(res.status_code, 204)
        user.refresh_from_db()
        self.assertEqual(user.is_active, True, 'Must be activated')


def get_header(admin=False):
    if admin:
        jwt = c.post('/api/auth/jwt/create/', {'username': 'admin', 'password': '1234'}).json()['access']
    else:
        jwt = c.post('/api/auth/jwt/create/', {'username': 'mah', 'password': '1234'}).json()['access']
    return {'HTTP_authorization': "Bearer " + jwt, 'content_type': 'application/json', }


