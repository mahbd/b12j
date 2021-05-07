from datetime import datetime, timedelta

from django.test import TestCase, Client

from b12j import settings
from judge.models import Contest
from users.models import User

c = Client()


def login(user: User):
    c.force_login(user, settings.AUTHENTICATION_BACKENDS[0])


class ContestTestCase(TestCase):
    def setUp(self) -> None:
        self.api = '/api/contests/'
        self.user = User.objects.create_user(username='mah', email='mahmudula2000@gmail.com', password='1234')
        self.admin = User.objects.create_user(username='admin', email='admin@gmail.com', password='1234')
        self.user2 = User.objects.create_user(username='mahBd', email='mahmudulk2000@gmail.com', password='1234')
        self.user.is_active = True
        self.user.save()
        self.admin.is_active = True
        self.admin.is_staff = True
        self.admin.save()
        self.contest1 = {
            'writers': self.user2.id, 'testers': self.admin.id, 'title': 'Test Contest',
            'text': '', 'start_time': datetime.now(),
            'end_time': datetime.now() + timedelta(hours=5)
        }
        self.wrongContest = {
            'writers': self.user.id, 'testers': self.admin.id, 'title': 'Test Contest',
            'text': '', 'start_time': datetime.now() + timedelta(days=366),
            'end_time': datetime.now()
        }

    # Create Contest
    def test_createContest(self):
        response = c.post(self.api, data=self.contest1)
        self.assertEqual(response.status_code, 403, 'Shouldn\'t be able to start contest without login')

    def test_createContestLogin(self):
        login(self.user)
        response = c.post(self.api, data=self.contest1)
        self.assertEqual(response.status_code, 403, f'Only staff can start contest\n{response.json()}')
        c.logout()

    def test_createContestLoginStaff(self):
        login(self.admin)
        response = c.post(self.api, data=self.contest1)
        self.assertEqual(response.status_code, 201, f'{response.json()}\n{c.cookies}')
        c.logout()

    def test_createContestWrong(self):
        login(self.admin)
        response = c.post(self.api, data=self.wrongContest)
        self.assertEqual(response.status_code, 400, f'should not create wrong time.\n{response.json()}\n{c.cookies}')
        c.logout()

    # Delete contest
    def test_deleteContest(self):
        self.test_createContestLoginStaff()
        login(self.user)
        response = c.delete(self.api + f'{Contest.objects.all()[0].id}/')
        self.assertEqual(response.status_code, 403, f'Shouldn\'t delete\n{response.content}')
        c.logout()

    def test_deleteContestUser(self):
        self.test_createContestLoginStaff()
        login(self.admin)
        response = c.delete(self.api + f'{Contest.objects.all()[0].id}/')
        self.assertEqual(response.status_code, 204, f'Should delete delete\n{response.content}')
        c.logout()

    # View contests
    def test_viewContestBlank(self):
        response = c.get(self.api)
        contests = response.json()
        self.assertEqual(response.status_code, 200, 'Failed to read')
        self.assertEqual(contests.get('count', -1), 0, 'Must be zero at initial position')

    def test_viewContestBlankLogged(self):
        login(self.user)
        response = c.get(self.api)
        contests = response.json()
        self.assertEqual(response.status_code, 200, 'Failed to read')
        self.assertEqual(contests.get('count', -1), 0, 'Must be zero at initial position')
        c.logout()

    def test_viewContest(self):
        self.test_createContestLoginStaff()
        response = c.get(self.api)
        contests = response.json()
        self.assertEqual(response.status_code, 200, 'Failed to read')
        self.assertEqual(contests.get('count', -1), 1, 'Must be 1 at initial position')

    def test_viewContestLogin(self):
        self.test_createContestLoginStaff()
        login(self.user)
        response = c.get(self.api)
        contests = response.json()
        self.assertEqual(response.status_code, 200, 'Failed to read')
        self.assertEqual(contests.get('count', -1), 1, 'Must be 1 at initial position')
