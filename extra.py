from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser


def validate_jwt(jwt_string):
    print(jwt_string)
    return False


@database_sync_to_async
def get_user_for_ws_jwt(jwt_dict):
    jwt_string = jwt_dict.get('jwt')
    if jwt_string:
        user = validate_jwt(jwt_string)
        if user:
            return user
    return AnonymousUser()
