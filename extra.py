from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication

from users.models import User


def validate_jwt(jwt_string) -> User | AnonymousUser:
    try:
        c = JWTAuthentication()
        validated_string = c.get_validated_token(jwt_string)
        return c.get_user(validated_string)
    except Exception as e:
        print(e)
    return AnonymousUser()


@database_sync_to_async
def get_user_for_ws_jwt(jwt_dict):
    jwt_string = jwt_dict.get('jwt')
    if jwt_string:
        user = validate_jwt(jwt_string)
        if user:
            return user
    return AnonymousUser()
