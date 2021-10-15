from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from api.serializers import ProblemSerializer, ContestSerializer, TutorialSerializer, SubmissionSerializer, \
    CommentSerializer
from judge.models import Contest, Problem, Tutorial, Submission, Comment
from users.models import User
from .models import ActiveChannel


def send2channel(channel_name, data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.send)(channel_name, {
        "type": "send_data",
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


def send2user(user: User, data):
    channels = ActiveChannel.objects.filter(user=user)
    for channel in channels:
        send2channel(channel.channel_name, data)


@receiver(post_save, sender=Contest, dispatch_uid="contest_changed_signal")
def contest_changed_signal(instance, **kwargs):
    data = ContestSerializer(instance).data
    data['target'] = 'contest'
    send2all_group(data)


@receiver(post_save, sender=Problem, dispatch_uid="problem_changed_signal")
def problem_changed_signal(instance: Problem, **kwargs):
    data = ProblemSerializer(instance).data
    data['target'] = 'problem'
    if instance.hidden_till > timezone.now():
        allowed_users = [instance.user]
        if not instance.is_unused():
            if instance.contest_set.all():
                for contest in instance.contest_set.all():
                    allowed_users = [*allowed_users, *[user for user in contest.writers.all()]]
            for user in allowed_users:
                send2user(user, data)
        else:
            send2user(instance.user, data)
    else:
        send2all_group(data)


@receiver(post_save, sender=Comment, dispatch_uid="problem_discussion_changed_signal")
def problem_discussion_changed_signal(instance: Comment, **kwargs):
    data = CommentSerializer(instance).data
    data['target'] = 'problem_discussion'
    send2all_group(data)


@receiver(post_save, sender=Submission)
def submission_changed_signal(instance: Submission, **kwargs):
    data = SubmissionSerializer(instance).data
    data['target'] = 'submission'
    if instance.contest and instance.contest.end_time <= timezone.now():
        send2user(instance.user, data)
    else:
        send2all_group(data)


@receiver(post_save, sender=Tutorial)
def tutorial_changed_signal(instance: Tutorial, **kwargs):
    data = TutorialSerializer(instance).data
    data['target'] = 'tutorial'
    if instance.hidden_till <= timezone.now():
        send2user(instance.user, data)
    elif instance.contest and instance.contest.end_time <= timezone.now():
        allowed_users = {*list(instance.contest.writers), *list(instance.contest.testers)}
        for user in allowed_users:
            send2user(user, data)
    else:
        send2all_group(data)
