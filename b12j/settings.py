import os
import sys
from datetime import timedelta
from pathlib import Path

from corsheaders.defaults import default_headers, default_methods
from djongo.base import DatabaseWrapper
from djongo.operations import DatabaseOperations

class PatchedDatabaseOperations(DatabaseOperations):

    def conditional_expression_supported_in_where_clause(self, expression):
        return False


DatabaseWrapper.ops_class = PatchedDatabaseOperations

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = os.path.dirname(__file__)
SECRET_KEY = os.environ.get('SECRET_KEY', 'FfjdkslajfLKJFdslkafjlk454')
DEBUG = os.environ.get('DEBUG', True)

ALLOWED_HOSTS = ['b12j.herokuapp.com', '127.0.0.1', 'b12j-api.herokuapp.com']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'debug_toolbar',
    'social_django',
    'rest_framework_simplejwt',
    'corsheaders',
    'rest_framework',
    'djoser',
    'channels',
    'users',
    'ws',
    'judge',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'b12j.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates'), os.path.join(BASE_DIR, 'b12j-front')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'b12j.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'ENFORCE_SCHEMA': False,
        'NAME': 'b12j',
        os.environ.get('MONGO_B12J', False) and
        'CLIENT': {
            'host': os.environ.get('MONGO_B12J'),
            'username': os.environ.get('MONGO_USERNAME'),
            'password': os.environ.get('MONGO_PASSWORD'),
            'authMechanism': 'SCRAM-SHA-1'
        },
        not os.environ.get('MONGO_B12J', False) and
        'CLIENT': {
            'host': "mongodb://localhost:27017/"
        }
    }
}


if 'test' in sys.argv:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'test.sqlite3',
        }
    }
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Dhaka'

USE_I18N = True

USE_L10N = True

USE_TZ = True
#####################################################################
MEDIA_ROOT = os.path.join(PROJECT_DIR, str('media/'))  #
MEDIA_URL = '/media/'  #
STATIC_URL = '/static/'  #
STATICFILES_DIRS = (os.path.join(BASE_DIR, 'b12j-front', 'build', 'static'),)
STATIC_ROOT = os.path.join(PROJECT_DIR, str('static/'))  #
LOGIN_URL = '/users/login/'  #
#####################################################################
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"  #
EMAIL_HOST = "smtp.gmail.com"  #
EMAIL_HOST_USER = 'mahmuduly2000@gmail.com'  #
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD')  #
EMAIL_PORT = 587  #
EMAIL_USE_TLS = True  #
#####################################################################
AUTH_USER_MODEL = 'users.User'  #

AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'django.contrib.auth.backends.ModelBackend'
)

#####################################################################
ASGI_APPLICATION = 'b12j.routing.application'  #
CHANNEL_LAYERS = {  #
    "default": {  #
        "BACKEND": "channels.layers.InMemoryChannelLayer"  #
    }  #
}  #
#####################################################################
REST_FRAMEWORK = {  #
    'DEFAULT_AUTHENTICATION_CLASSES': [  #
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],  #
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 30,  #
}  #
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=15),
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'BLACKLIST_AFTER_ROTATION': False,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SEND_CONFIRMATION_EMAIL': True,
    'SET_PASSWORD_RETYPE': True,
    'USERNAME_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'PASSWORD_RESET_CONFIRM_URL': 'email/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'users/activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    'SOCIAL_AUTH_TOKEN_STRATEGY': 'djoser.social.token.jwt.TokenStrategy',
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': ['https://b12j.ga/google',
                                          'https://b12j.ga/facebook'],
    'SERIALIZERS': {
        'user_create': 'users.serializers.UserCreateSerializer',
        'user_create_password_retype': 'users.serializers.UserCreatePasswordRetypeSerializer',
        'user': 'users.serializers.UserCreateSerializer',
        # 'current_user': 'users.serializers.UserCreateSerializer',
        # 'user_delete': 'djoser.serializers.UserDeleteSerializer',
    }
}
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '704405925886-dbk5n1mo85kdq96h7canvkul40if81ea.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '0f8crH11JaO71PgOS6GoIKK6'
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ['https://www.googleapis.com/auth/userinfo.email',
                                   'https://www.googleapis.com/auth/userinfo.profile', 'openid']
SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = ['first_name', 'last_name']

SOCIAL_AUTH_FACEBOOK_KEY = '874103216697597'
SOCIAL_AUTH_FACEBOOK_SECRET = 'd2c0fd6bd749b2e00360cb559e46fd5a'
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
    'fields': 'email, first_name, last_name'
}
#####################################################################
CORS_ALLOW_ALL_ORIGINS = True  #
CORS_ALLOW_METHODS = list(default_methods)
CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-auth-token",
]
#####################################################################

# Constants
EMAIL_REGEX = r'^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$'

INTERNAL_IPS = [
    # ...
    '127.0.0.1',
    # ...
]
