from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save)
def judge_submission(instance, **kwargs):
    pass
