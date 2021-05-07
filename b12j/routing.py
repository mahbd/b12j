from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import ws.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    'websocket': URLRouter(ws.routing.websocket_urlpatterns),
})
