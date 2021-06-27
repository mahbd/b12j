import json
import os
import ssl
import threading
from random import randint

import requests
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from pymongo import MongoClient

from judge.models import Contest, Problem, TestCase, Submission, ContestProblem

User = get_user_model()


class B12JMongoDB:
    def __init__(self, link: str):
        self.my_client = MongoClient(link, ssl_cert_reqs=ssl.CERT_NONE)
        self.my_db = self.my_client['b12j_db']
        self.user_table = self.my_db['user_user']
        self.contest_table = self.my_db['judge_contest']
        self.contest_testers_table = self.my_db['judge_contest_testers']
        self.contest_hosts_table = self.my_db['judge_contest_hosts']
        self.problem_table = self.my_db['judge_problem']
        self.submission_table = self.my_db['judge_submission']


class B12JMongoDBGet(B12JMongoDB):
    def __init__(self, link: str):
        super().__init__(link)

    def users(self):
        for user in self.user_table.find():
            user.pop('_id')
            user.pop('id')
            user.pop('picture')
            user.pop('cf_handle')
            user.pop('batch')
            user.pop('is_admin')
            User.objects.create(**user)

    def convert_m_user_id(self, user_id):
        user = self.user_table.find_one({'id': user_id})
        try:
            user = User.objects.get(email=user['email'])
        except TypeError:
            print(user_id, user)
        return user.id

    def contests(self):
        contests = self.contest_table.find()
        for contest in contests:
            contest.pop('_id')
            contest.pop('group_id')
            problems = self.problem_table.find({'contest_id': contest['id']})
            hosts = self.contest_hosts_table.find({'contest_id': contest['id']})
            testers = self.contest_testers_table.find({'contest_id': contest['id']})
            contest.pop('id')
            try:
                contest = Contest.objects.create(**contest)
            except Exception as e:
                contest = Contest.objects.get(**contest)
                print(e)

            for problem in problems:
                problem_id = self.convert_m_problem_id(problem['id'])
                ContestProblem.objects.create(problem_id=problem_id, contest=contest, problem_char=problem['conProbId'])
            for host in hosts:
                contest.writers.add(User.objects.get(id=self.convert_m_user_id(host['user_id'])))
            for tester in testers:
                contest.testers.add(User.objects.get(id=self.convert_m_user_id(tester['user_id'])))
            contest.save()

    def problems(self):
        problems = self.problem_table.find()
        for problem in problems:
            problem = dict(problem)
            problem.pop('_id')
            problem.pop('id')
            problem['by_id'] = self.convert_m_user_id(problem['by_id'])
            problem.pop('contest_id')
            problem.pop('group_id')
            problem.pop('conProbId')
            Problem.objects.create(**problem)

    def convert_m_problem_id(self, problem_id):
        problem = self.problem_table.find_one({'id': problem_id})
        problem = Problem.objects.get(title=problem['title'])
        return problem.id

    def submissions(self):
        submissions = self.submission_table.find()
        for submission in submissions:
            submission = dict(submission)
            submission.pop('_id')
            submission.pop('id')


def get_user_from_username(username):
    try:
        return User.objects.get(first_name=username, username=username)
    except User.DoesNotExist:
        return User.objects.create(first_name=username, username=username,
                                   email=str(randint(1, 10000)) + str(randint(1, 1000)) + '@' + '.gmail.com', )


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
