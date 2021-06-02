import os
from datetime import datetime

import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404, render

from .models import Contest, Submission

# Problem, TestCase, Submission

User = get_user_model()


@receiver(post_save, sender=Submission)
def judge_submission(sub, **kwargs):
    pass

# def add_tc(request, problem_id):
#     problem = get_object_or_404(Problem, id=problem_id)
#     context = {"problem": problem, "error": None}
#     if request.method == 'POST':
#         data = request.POST
#         inputs = data['inputs']
#         tc = TestCase(inputs=inputs, problem=problem)
#         data = requests.post(f'{judge_url}add_tc/', {"inputs": inputs,
#                                                      "code": problem.corCode,
#                                                      "time_limit": problem.time_limit,
#                                                      "id": tc.id,
#                                                      "title": problem.title})
#         data = data.json()
#         if data['status'] == 'OK':
#             tc.output = data['output']
#             tc.save()
#             return {"test_case": tc}
#         return {"problem": problem, "error": data['status']}
#     return context
#
#
# def add_test_case(request, problem_id):
#     context = add_tc(request, problem_id)
#     if context.get('test_case'):
#         return render(request, 'contest/test_case_success.html', context)
#     return render(request, 'contest/test_case.html', context)
#
#
# def add_test_case_python(request, problem_id):
#     context = add_tc(request, problem_id)
#     if context.get('test_case'):
#         return JsonResponse({'output': context.get('test_case').output})
#     return JsonResponse({}, status=400)
#
#
# @login_required
# def add_problem(request, contest_id):
#     contest = get_object_or_404(Contest, id=contest_id)
#     if request.method == 'POST':
#         pass
#
#
# def show_problem(request, problem_id):
#     if problem_id:
#         if problem_id:
#             problem = get_object_or_404(Problem, id=problem_id)
#             context = {"problem": problem}
#             render(request, 'contest/problem.html', context)
#     raise Http404


def _calculate_standing(submission_list):
    submission_list.reverse()
    info, time_count, problem_count = {}, {}, {}
    final_info = []
    for submission in submission_list:
        info[submission.by_id + '___' + submission.problem_id] = (
                submission.date - submission.contest.start_time).total_seconds()
        problem_count[submission.by_id] = 0
        time_count[submission.by_id] = 0
    for key in info:
        time_count[key.split('___')[0]] += info[key]
        problem_count[key.split('___')[0]] += 1
    for key in time_count:
        final_info.append([key, problem_count[key], time_count[key]])
    final_info.sort(key=lambda item: item[2])
    return sorted(final_info, key=lambda item: item[1], reverse=True)


def standing(request, contest_id):
    q = Q()
    contest = get_object_or_404(Contest, id=contest_id)
    submissions = Submission.objects.filter(contest_id=contest_id, verdict='AC')
    during_contest, after_contest = [], []
    for submission in submissions:
        if contest.end_time >= submission.date >= contest.start_time:
            during_contest.append(submission)
        else:
            after_contest.append(submission)
    during_contest = _calculate_standing(during_contest)
    after_contest = _calculate_standing(after_contest)
    return JsonResponse({'during': during_contest, 'after': after_contest})
