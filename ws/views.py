import json

from asgiref.sync import async_to_sync
from django.core.serializers import serialize
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer

from judge.models import Problem, Tutorial, Submission, Contest, ProblemComment, TutorialComment, TestCase


def send2channel(channel_name, data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.send)("channel_name", {
        "type": "send.data",
        "data": data,
    })


def send2group(group_name, data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'send_data',
            'data': data
        }
    )


def send2all_group(data):
    channel_layer = get_channel_layer()
    for group_name in channel_layer.groups:
        send2group(group_name, data)


def get_model_data(kwargs):
    json_data = json.loads(serialize('json', [kwargs['instance']]))[0]
    data = json_data['fields']
    data['id'] = json_data['pk']
    return data


@receiver(post_save, sender=Contest)
def contest(sender, **kwargs):
    try:
        data = get_model_data(kwargs)
        data['target'] = 'contest'
        send2all_group(data)
    except AttributeError:
        pass


@receiver(post_save, sender=Problem)
def problem(sender, **kwargs):
    try:
        data = get_model_data(kwargs)
        data['target'] = 'problem'
        test_cases = TestCase.objects.filter(problem_id=data['id'])
        test = [{"input": test_case.inputs, "output": test_case.output} for test_case in
                test_cases[:data['examples']]]
        data['test_cases'] = test
        send2all_group(data)
    except AttributeError:
        pass


@receiver(post_save, sender=ProblemComment)
def problem_comment(sender, **kwargs):
    data = get_model_data(kwargs)
    data['target'] = 'problemComment'
    send2all_group(data)


@receiver(post_save, sender=Tutorial)
def tutorial(sender, **kwargs):
    data = get_model_data(kwargs)
    data['target'] = 'tutorial'
    send2all_group(data)


@receiver(post_save, sender=TutorialComment)
def tutorial(sender, **kwargs):
    data = get_model_data(kwargs)
    data['target'] = 'tutorialComment'
    send2all_group(data)


@receiver(post_save, sender=Submission)
def submission(sender, **kwargs):
    try:
        data = get_model_data(kwargs)
        data['target'] = 'submission'
        send2all_group(data)
    except AttributeError:
        pass
