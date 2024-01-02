import threading

from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from .judge import judge_solution, get_output
from .models import Contest, Submission, TestCase

User = get_user_model()


@receiver(post_save, sender=Submission)
def judge_submission(instance: Submission, created, **kwargs):
    if created:
        thread = threading.Thread(target=judge_solution, args=[instance])
        thread.start()


@login_required
def rejudge(request, sub_id):
    if request.user.is_superuser:
        submission = get_object_or_404(Submission, pk=sub_id)
        judge_submission(submission, True)
        return JsonResponse({'details': 'ok'})
    return JsonResponse({'details': 'User does not have enough permission'}, status=403)


@receiver(post_save, sender=TestCase)
def generate_output(instance: TestCase, created, **kwargs):
    if created:
        language = instance.problem.correct_lang
        code = instance.problem.correct_code
        input_txt = instance.inputs
        time_limit = instance.problem.time_limit
        memory_limit = instance.problem.memory_limit
        output, status_code, _, _ = get_output(language, code, input_txt, time_limit, memory_limit)
        if status_code == 3:
            instance.output = output
            instance.save()
        else:
            print('Error happened')


def _calculate_standing(submission_list):
    submission_list.reverse()
    info, time_count, problem_count = {}, {}, {}
    final_info = []
    for submission in submission_list:
        info[f'{submission.user_id}___{submission.problem_id}'] = (
                submission.created_at - submission.contest.start_time).total_seconds()
        problem_count[str(submission.user_id)] = 0
        time_count[str(submission.user_id)] = 0
    for key in info:
        time_count[key.split('___')[0]] += info[key]
        problem_count[key.split('___')[0]] += 1
    for key in time_count:
        final_info.append([key, problem_count[key], time_count[key]])
    final_info.sort(key=lambda item: item[2])
    return sorted(final_info, key=lambda item: item[1], reverse=True)


def standing(request, contest_id):
    contest = get_object_or_404(Contest, id=contest_id)
    submissions = Submission.objects.filter(contest_id=contest_id, verdict='AC')
    during_contest, after_contest = [], []
    for submission in submissions:
        if contest.end_time >= submission.created_at >= contest.start_time:
            during_contest.append(submission)
        else:
            after_contest.append(submission)
    during_contest = _calculate_standing(during_contest)
    after_contest = _calculate_standing(after_contest)
    return JsonResponse({'during': during_contest, 'after': after_contest})
