import firebase_admin
from firebase_admin import auth

firebase = firebase_admin.initialize_app()


def verify_token(token):
    try:
        return auth.verify_id_token(token)
    except Exception as exception:
        print(exception, token)
