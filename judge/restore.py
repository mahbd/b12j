import json
import threading
from random import randint

import requests
from django.contrib.auth import get_user_model
from django.http import JsonResponse

from judge.models import get_random_id, Contest, Problem, TestCase, Submission
from user.models import UserGroup

User = get_user_model()


def get_user_from_username(username):
    try:
        return User.objects.get(first_name=username, username=username)
    except User.DoesNotExist:
        return User.objects.create(first_name=username, username=username,
                                   email=str(get_random_id()) + str(randint(1, 1000)) + '@' + '.gmail.com', )


def contests_from_old():
    url = 'http://mahbd.pythonanywhere.com/compiler/con_tra'
    response = requests.get(url).json()['response']
    print("started adding contest")
    for m in response:
        host = get_user_from_username(m['owner'])
        tester = get_user_from_username(m['tester'])
        UserGroup.objects.get_or_create(name=m['group'])
        group = UserGroup.objects.get(name=m['group'])
        Contest.objects.get_or_create(title=m['contest_name'], text='Restored from old Judge',
                                      start_time=m['start_time'], end_time=m['end_time'], group=group)
        contest = Contest.objects.get(title=m['contest_name'], text='Restored from old Judge',
                                      start_time=m['start_time'], end_time=m['end_time'], group=group)
        contest.hosts.add(host)
        contest.testers.add(tester)
        contest.save()
    print('contest add complete')


def contests_from_old_handle(request):
    thread = threading.Thread(target=contests_from_old)
    thread.start()
    return JsonResponse({'details': "Success"})


def problem_from_old():
    url = 'http://mahbd.pythonanywhere.com/compiler/prob_tra'
    response = requests.get(url).json()['response']
    print('started problem add')
    for m in response:
        try:
            contest_name = m['contest_name'][0]
            contest = Contest.objects.get(title=contest_name)
            by = get_user_from_username(m['creator'])
            UserGroup.objects.get_or_create(name=m['group'])
            group = UserGroup.objects.get(name=m['group'])
            Problem.objects.get_or_create(by=by, contest=contest, title=m['problem_name'], text=m['problem_statement'],
                                          inTerms=m['input_terms'], outTerms=m['output_terms'],
                                          corCode=m['code'], notice='Restored from previous judge', date=m['date'],
                                          group=group, conProbId=m['conProb'])
        except (KeyError, IndexError):
            pass
    print('problem add complete')


def problem_from_old_handle(request):
    thread = threading.Thread(target=problem_from_old)
    thread.start()
    return JsonResponse({"status": True})


def test_case_from_old():
    url = 'http://mahbd.pythonanywhere.com/compiler/test_tra'
    response = requests.get(url).json()['response']
    print('started tc add')
    for m in response:
        try:
            inp = m['input']
            output = m['output']
            problem_name = m['problem_name']
            try:
                problem = Problem.objects.get(title=problem_name)
            except Problem.DoesNotExist:
                continue
            TestCase.objects.get_or_create(problem=problem, inputs=inp, output=output)
        except KeyError:
            pass
    print('tc add complete')


def test_case_from_old_handle(request):
    thread = threading.Thread(target=test_case_from_old)
    thread.start()
    return JsonResponse({"status": True})


def submission_from_old():
    url = 'http://mahbd.pythonanywhere.com/compiler/sub_tra'
    response = requests.get(url).json()['response']
    print('started submission add')
    for m in response:
        try:
            by = get_user_from_username(m['username'])
            problem_name = m['problem_name']
            try:
                problem = Problem.objects.get(title=problem_name)
            except Problem.DoesNotExist:
                continue
            contest_name = m['contest'][0]
            contest = Contest.objects.get(title=contest_name)
            Submission.objects.get_or_create(by=by, problem=problem, contest=contest, code=m['code'],
                                             language='c_cpp', verdict=m['verdict'], date=m['date'],
                                             details=json.dumps(['Restored from old', [['', '', '']]]))
            submission = Submission.objects.get(code=m['code'], date=m['date'], by=by)
            if contest.start_time > submission.date:
                submission.time_code = 'BC'
            elif contest.end_time < submission.date:
                submission.time_code = 'AC'
            else:
                submission.time_code = 'DC'
            submission.save()
        except (KeyError, IndexError):
            pass
    print('submission add complete')


def submission_from_old_handle(request):
    thread = threading.Thread(target=submission_from_old)
    thread.start()
    return JsonResponse({"status": True})