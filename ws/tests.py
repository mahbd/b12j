from django.test import TestCase, Client

from .models import ActiveChannel

c = Client()


class ActiveChannelTestCase(TestCase):

    def test_create_without_user(self):
        try:
            ActiveChannel.objects.create(channel_name='hello')
        except Exception as e:
            print(e)
            self.assert_(False, "Couldn't record when user is not logged in")

    def test_create_with_user(self):
        try:
            ActiveChannel.objects.create(channel_name='hello')
        except Exception as e:
            print(e)
            self.assert_(False, "Couldn't record when user is logged in")
