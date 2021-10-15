import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from api.serializers import UserSerializer, ContestSerializer, ProblemSerializer, SubmissionSerializer, TutorialSerializer, ProblemOwnerSerializer
from extra import validate_jwt
from judge.models import Contest, Problem, Submission, Tutorial
from users.models import User
from ws.models import ActiveChannel


# noinspection PyAttributeOutsideInit
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'webSocket'
        self.scope['user'] = AnonymousUser()
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        self.channel_info = await add_new_channel(self.scope['user'], self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await remove_channel(self.channel_name)
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        if text_data_json.get('id_token') and not self.scope['user'].is_authenticated:
            self.scope['user'] = await verify_user(text_data_json.get('id_token'))
            if self.scope['user'].is_authenticated:
                self.channel_info = await update_user(self.channel_info, self.scope['user'])

        if text_data_json.get('method'):
            text_data_json.pop('id_token')
            message = await route_to_view(text_data_json, self.scope['user'])
            await self.send(text_data=json.dumps({'data': message}))
        elif text_data_json.get('data'):
            message = text_data_json['data']
            # Send message to room group
            print(message)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_data',
                    'data': message
                }
            )
        elif text_data_json.get('logout'):
            self.scope['user'] = AnonymousUser()

    # Receive message from room group
    async def send_data(self, event):
        message = event['data']
        if not message['target']:
            return

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'data': message
        }))


@database_sync_to_async
def verify_user(id_token) -> User:
    return validate_jwt(id_token) or AnonymousUser()


@database_sync_to_async
def add_new_channel(cur_user, channel) -> ActiveChannel:
    if cur_user.is_authenticated:
        return ActiveChannel.objects.create(user=cur_user, channel_name=channel)
    return ActiveChannel.objects.create(channel_name=channel)


@database_sync_to_async
def update_user(ac_channel: ActiveChannel, cur_user):
    ac_channel.user = cur_user
    ac_channel.save()
    return ac_channel


@database_sync_to_async
def remove_channel(channel):
    if ActiveChannel.objects.filter(channel_name=channel):
        ActiveChannel.objects.filter(channel_name=channel).delete()


@database_sync_to_async
def route_to_view(data, current_user):
    if data.get('target') == 'user':
        return user(data)
    elif data.get('target') == 'contest':
        return contest(data)
    elif data.get('target') == 'problem':
        return problem(data, current_user)
    elif data.get('target') == 'submission':
        return submission(data)
    elif data.get('target') == 'tutorial':
        return tutorial(data)


def user(request):
    if request['method'] == 'GET':
        if User.objects.filter(id=request['id']):
            return dict(UserSerializer(User.objects.get(id=request['id'])).data) | request
        return {'target': False}


def contest(request):
    if request['method'] == 'GET':
        if Contest.objects.filter(id=request['id']):
            return dict(ContestSerializer(Contest.objects.get(id=request['id'])).data) | request
        return {'target': False}


def problem(request, current_user: User):
    if request['method'] == 'GET':
        if Problem.objects.filter(pk=request['id']).exists():
            p = Problem.objects.get(id=request['id'])
            if current_user.is_staff or current_user.id == p.user_id:
                return dict(ProblemOwnerSerializer(p).data) | request
            else:
                return dict(ProblemSerializer(p).data) | request
        return {'target': False}


def submission(request):
    if request['method'] == 'GET':
        if Submission.objects.filter(id=request['id']):
            return dict(SubmissionSerializer(Submission.objects.get(id=request['id'])).data) | request
        return {'target': False}


def tutorial(request):
    if request['method'] == 'GET':
        if Tutorial.objects.filter(id=request['id']):
            return dict(TutorialSerializer(Tutorial.objects.get(id=request['id'])).data) | request
