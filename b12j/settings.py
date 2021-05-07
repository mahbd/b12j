import os
import sys
from pathlib import Path

import django.db.models
from corsheaders.defaults import default_headers

from .settings_helper import link_to_json_file

TESTING = len(sys.argv) > 1 and sys.argv[1] == 'test'

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = os.path.dirname(__file__)
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', True)

if os.environ.get('FIREBASE_ADMIN'):
    firebase_admin_path = link_to_json_file(str(BASE_DIR) + '/firebase_admin.json', os.environ.get('FIREBASE_ADMIN'))
else:
    firebase_admin_path = str(BASE_DIR) + '/firebase_admin.json'
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = firebase_admin_path

ALLOWED_HOSTS = ['b12j.herokuapp.com', '127.0.0.1']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'channels',
    'users',
    'ws',
    'judge',
    'api',
    # 'attendance',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
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
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'b12j',
        'USER': 'b12j_admin',
        'PASSWORD': os.environ.get('B12J_DB_PASS'),
        'HOST': '127.0.0.1',
        'PORT': '5432',
    },
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
AUTHENTICATION_BACKENDS = ['users.backends.ModelBackendWithJWT']  #
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
        'rest_framework.authentication.SessionAuthentication',  #
        'users.backends.RestBackendWithJWT',  #
    ],  #
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 30,  #
}  #
#####################################################################
CORS_ALLOW_ALL_ORIGINS = True  #
CORS_ALLOW_HEADERS = list(default_headers) + [  #
    'x-auth-token', 'token', 'username', 'password'  #
]  #
#####################################################################

# Constants
EMAIL_REGEX = r'^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$'
