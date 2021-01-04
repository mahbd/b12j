from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import ws.routing
from user.backends import QueryAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    'websocket': QueryAuthMiddleware(URLRouter(ws.routing.websocket_urlpatterns)),
})
