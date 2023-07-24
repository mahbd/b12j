import debug_toolbar
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include


def index(request):
    return render(request, 'build/index.html')


urlpatterns = [
    path('accounts/', include('django.contrib.auth.urls')),
    path('__debug__/', include(debug_toolbar.urls)),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('judge/', include('judge.urls')),
    path('ws/', include('ws.urls')),
    path('users/', include('users.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns.append(url(r'^.*$', index, name='index'))
