from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver

from api.serializers import ProblemSer, ContestSer, TutorialSer, SubmissionSer
from judge.models import Contest, Problem, Tutorial, Submission


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


@receiver(post_save, sender=Contest)
def contest(instance, **kwargs):
    data = ContestSer(instance).data
    data['target'] = 'contest'
    send2all_group(data)


@receiver(post_save, sender=Problem)
def problem(instance, **kwargs):
    data = ProblemSer(instance).data
    data['target'] = 'problem'
    send2all_group(data)


@receiver(post_save, sender=Tutorial)
def tutorial(instance, **kwargs):
    data = TutorialSer(instance).data
    data['target'] = 'tutorial'
    send2all_group(data)


@receiver(post_save, sender=Submission)
def submission(instance, **kwargs):
    data = SubmissionSer(instance).data
    data['target'] = 'submission'
    send2all_group(data)
