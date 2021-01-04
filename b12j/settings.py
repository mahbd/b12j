import os
from pathlib import Path
from corsheaders.defaults import default_headers

from .settings_helper import link_to_json_file

BASE_DIR = Path(__file__).resolve().parent.parent
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
    'user',
    'ws',
    'judge',
    'api',
    'attendance',
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
        'ENGINE': 'djongo',
        'ENFORCE_SCHEMA': False,
        'NAME': 'b12j_db',
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

STATIC_URL = '/static/'
STATICFILES_DIRS = (os.path.join(BASE_DIR, 'b12j-front', 'build', 'static'), )
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')

AUTH_USER_MODEL = 'user.User'
AUTH_USER_GROUP = 'user.UserGroup'
AUTHENTICATION_BACKENDS = ['user.backends.ModelBackendWithJWT']

# Channels
ASGI_APPLICATION = 'b12j.routing.application'
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

REST_FRAMEWORK = {
    # 'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'user.backends.RestBackendWithJWT',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 30,
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_HEADERS = list(default_headers) + [
    'x-auth-token', 'token'
]
