from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework.authentication import TokenAuthentication

from extra import validate_jwt

UserModel = get_user_model()


def is_valid_jwt_header(request):
    if request.headers.get('x-auth-token', False):
        jwt_str = request.headers['x-auth-token']
        return validate_jwt(jwt_str)


class RestBackendWithJWT(TokenAuthentication):
    def authenticate(self, request):
        user = is_valid_jwt_header(request)
        return user, None


class ModelBackendWithJWT(ModelBackend):
    def authenticate(self, request, username=None, password=None, email=None, **kwargs):
        if request.headers.get('x-auth-token', False):
            if is_valid_jwt_header(request):
                return is_valid_jwt_header(request)
        if (username is None and email is None) or password is None:
            return
        try:
            if email:
                user = UserModel.objects.get(email=email)
            else:
                user = UserModel.objects.get(username=username)
        except UserModel.DoesNotExist:
            UserModel().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
