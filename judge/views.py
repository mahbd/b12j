import json
import os
import threading

import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from .models import Contest, Submission, TestCase

User = get_user_model()


def _judge_submission(data, check_id):
    judge_url = os.environ.get('JUDGE_URL') + f'/judge/{check_id}/'
    response = requests.post(judge_url, json=data)
    if response.status_code == 200:
        data = response.json()['status']
        submission = Submission.objects.get(id=check_id)
        data[0], data[2] = data[2], data[0]
        submission.verdict = data[2]
        submission.details = json.dumps(data)
        submission.save()
    else:
        # ToDo: implement remote logging system
        print('Error happened')


@receiver(post_save, sender=Submission)
def judge_submission(instance: Submission, created, **kwargs):
    if created:
        code = instance.code
        language = instance.language
        time_limit = instance.problem.time_limit
        test_cases = instance.problem.testcase_set.all()
        input_list, output_list = [], []
        for tc in test_cases:
            input_list.append(tc.inputs)
            output_list.append(tc.output)

        data = {
            'code': code,
            'language': language,
            'time_limit': time_limit,
            'input_list': input_list,
            'output_list': output_list
        }
        data = json.dumps(data)
        thread = threading.Thread(target=_judge_submission, args=[data, instance.id])
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
        code = instance.problem.correct_code
        time_limit = instance.problem.time_limit
        test_text = instance.inputs
        data = {
            'code': code,
            'language': instance.problem.correct_lang,
            'time_limit': time_limit,
            'input_text': test_text
        }
        data = json.dumps(data)

        judge_url = os.environ.get('JUDGE_URL') + f'/get_output/{instance.id}/'
        response = requests.post(judge_url, json=data)
        if response.status_code == 200:
            output = response.json()['output']
            instance.output = output
            instance.save()
        else:
            # ToDo: implement remote logging system
            print(response.content)
            print('Error happened')


def _calculate_standing(submission_list):
    submission_list.reverse()
    info, time_count, problem_count = {}, {}, {}
    final_info = []
    for submission in submission_list:
        info[f'{submission.by_id}___{submission.problem_id}'] = (
                submission.created_at - submission.contest.start_time).total_seconds()
        problem_count[str(submission.by_id)] = 0
        time_count[str(submission.by_id)] = 0
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
