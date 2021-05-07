import json

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from jwcrypto import jwk, jwt, jws

from b12j import settings
from b12j.settings_helper import ConfigFileManagement
from users.models import User


def jwk_key():
    config = ConfigFileManagement(str(settings.BASE_DIR) + '/config.json')
    return jwk.JWK(**json.loads(config.read('JWT_KEY', jwk.JWK(generate='oct', size=512).export())))


def jwt_reader(jwt_str):
    key = jwk_key()
    try:
        st = jwt.JWT(key=key, jwt=jwt_str)
        return json.loads(st.claims)
    except (jws.InvalidJWSSignature, jws.InvalidJWSObject):
        return None


def jwt_writer(**kwargs):
    key = jwk_key()
    token = jwt.JWT(header={'alg': 'HS256'}, claims=kwargs)
    token.make_signed_token(key)
    return token.serialize()


def validate_jwt(jwt_str):
    if not jwt_str:
        return None
    try:
        st = jwt.JWT(key=jwk_key(), jwt=jwt_str)
        data = json.loads(st.claims)
        try:
            return User.objects.get(username=data.get('username'), email=data.get('email'))
        except User.DoesNotExist:
            return None
    except (jws.InvalidJWSSignature, jws.InvalidJWSObject, ValueError):
        return None


@database_sync_to_async
def get_user_for_ws_jwt(jwt_dict):
    jwt_string = jwt_dict.get('jwt')
    if jwt_string:
        user = validate_jwt(jwt_string)
        if user:
            return user
    return AnonymousUser()
