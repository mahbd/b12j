import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.serializers import serialize

from judge.models import Contest, Submission, Problem, TestCase, Tutorial
from user.models import User, UserGroup
from ws.models import ActiveChannels


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_group_name = get_group_name(self.user)
        await add_new_channel(self.scope['user'], self.channel_name, self.room_group_name)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

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
        if text_data_json.get('method'):
            message = await route_to_view(text_data_json, self.user)
            await self.send(text_data=json.dumps({'data': message}))
        else:
            message = text_data_json['data']
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_data',
                    'data': message
                }
            )

    # Receive message from room group
    async def send_data(self, event):
        message = event['data']
        if not message['target']:
            return

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'data': message
        }))


def get_group_name(cur_user):
    if cur_user.is_authenticated:
        group_name = ''
        for m in cur_user.email:
            if m.isalnum():
                group_name += m
        return group_name if len(group_name) > 0 else 'bad_email'
    return 'unauthenticated'


@database_sync_to_async
def add_new_channel(cur_user, channel, room):
    if cur_user.is_authenticated:
        ActiveChannels.objects.create(user=cur_user, channel_name=channel, room_name=room)
    else:
        ActiveChannels.objects.create(channel_name=channel, room_name=room)


@database_sync_to_async
def remove_channel(channel):
    if ActiveChannels.objects.filter(channel_name=channel):
        ActiveChannels.objects.filter(channel_name=channel).delete()


def get_model_data_from_id(model, request):
    try:
        json_data = json.loads(serialize('json', model.objects.filter(id=request['id'])))[0]
    except IndexError:
        print(request)
        return {'target': False}
    data = json_data['fields']
    data['id'] = json_data['pk']
    data['target'] = request['target']
    return data


@database_sync_to_async
def route_to_view(data, cur_user):
    if data.get('target') == 'user':
        return user(data)
    elif data.get('target') == 'contest':
        return contest(data)
    elif data.get('target') == 'problem':
        return problem(data, cur_user)
    elif data.get('target') == 'submission':
        return submission(data)
    elif data.get('target') == 'tutorial':
        return tutorial(data)


def user(request):
    if request['method'] == 'GET':
        return get_model_data_from_id(User, request)


def contest(request):
    if request['method'] == 'GET':
        return get_model_data_from_id(Contest, request)


def problem(request, cur_user):
    if request['method'] == 'GET':
        data = get_model_data_from_id(Problem, request)
        try:
            test_cases = TestCase.objects.filter(problem_id=data['id'])
        except TypeError:
            return {'target': False}
        test = [{"input": test_case.inputs, "output": test_case.output} for test_case in
                test_cases[:data['examples']]]
        data['test_cases'] = test
        return data
    if request['method'] == 'POST':
        if cur_user.is_authenticated:
            group = UserGroup.objects.all()[0]
            Problem.objects.create(**request['data'], by=cur_user, group=group)
        return {'target': False}
    if request['method'] == 'PUT':
        if cur_user.is_authenticated:
            problem_obj = Problem.objects.get(id=request['id'])
            data = request['data']
            problem_obj.title = data['title']
            problem_obj.text = data['text']
            problem_obj.inTerms = data['inTerms']
            problem_obj.outTerms = data['outTerms']
            problem_obj.corCode = data['corCode']
            problem_obj.time_limit = data['time_limit']
            problem_obj.examples = data['examples']
            problem_obj.notice = data['notice']
            problem_obj.group_id = data['group']
            problem_obj.conProbId = data['conProbId']
            problem_obj.save()
        return {'target': False}


def submission(request):
    if request['method'] == 'GET':
        data = get_model_data_from_id(Submission, request)
        try:
            data['problem_title'] = Submission.objects.get(id=request['id']).problem.title
        except Submission.DoesNotExist:
            pass
        return data


def tutorial(request):
    if request['method'] == 'GET':
        return get_model_data_from_id(Tutorial, request)
