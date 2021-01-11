import json
import os
import threading
from datetime import datetime

import requests
from rest_framework import permissions
from rest_framework import serializers

from judge.models import Contest, Problem, ProblemComment, Submission, TestCase, Tutorial, TutorialComment
from user.models import User

judge_url = os.environ.get('JUDGE_URL', 'http://127.0.0.1:8001/')


def add_user_in_serializer(self, attrs):
    if self.instance:
        pass
    else:
        if not attrs.get('by'):
            attrs['by'] = self.context['request'].user
    return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']


# noinspection PyMethodMayBeStatic
class ContestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = '__all__'


def judge_connect(submission_id):
    """Send signal to judge to judge submission\nIf Fails it just print failure reason"""
    try:
        submission = Submission.objects.get(id=submission_id)
        try:
            problem = submission.problem
            data = {
                "id": submission.id,
                "title": problem.title,
                "code": submission.code,
                "language": submission.language,
                "time_limit": problem.time_limit,
            }
            try:
                res = requests.post(judge_url, data)
            except Exception as e:
                print("Failed", submission_id, e)
                submission.verdict = 'FJ'
                submission.save()
                return
            if res.status_code != 200:
                try:
                    judge_url2 = "http://oj.mahbd.heliohost.org/judge/"
                except Exception as e:
                    print("Failed", submission_id, e)
                    submission.verdict = 'FJ'
                    submission.save()
                    return
                res = requests.get(f'{judge_url2}{submission_id}')
                if res.status_code == 200:
                    data = res.json()
                    print("From Judge Response", data.get('status'))
                    submission = Submission.objects.get(id=submission_id)
                    submission.verdict = data.get('status')
                    submission.save()
                    return
            elif res.status_code != 200:
                print("Failed", submission_id)
                submission.verdict = 'FJ'
                submission.save()
                return
            status = res.json()['status']
            submission.verdict = status[0]
            if status[0] == 'CE':
                submission.details = json.dumps([status[1], ['', '', '']])
            else:
                submission.details = json.dumps([status[2], status[1]])
            submission.save()
        except Exception as e:
            print(e)
    except Submission.DoesNotExist:
        pass


class SubmissionSerializer(serializers.ModelSerializer):
    problem_title = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        exclude = ('details',)
        read_only_fields = ['verdict', 'contest', 'by', 'time_code']
        extra_kwargs = {
            'code': {'write_only': True},
        }

    def create(self, validated_data):
        submission = Submission(by=self.context['request'].user,
                                contest_id=validated_data['problem'].contest_id,
                                **validated_data)
        contest = submission.contest
        if contest.start_time > datetime.now(tz=contest.start_time.tzinfo):
            submission.time_code = 'BC'
        elif contest.end_time < datetime.now(tz=contest.end_time.tzinfo):
            submission.time_code = 'AC'
        else:
            submission.time_code = 'DC'
        submission.save()
        thread = threading.Thread(target=judge_connect, args=[submission.id])
        thread.start()
        return submission

    # noinspection PyMethodMayBeStatic
    def get_problem_title(self, submission):
        return submission.problem.title


class ProblemSerializer(serializers.ModelSerializer):
    test_cases = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Problem
        fields = '__all__'
        extra_kwargs = {'corCode': {'write_only': True}}
        read_only_fields = ['by']

    # noinspection PyMethodMayBeStatic
    def get_test_cases(self, problem):
        test_cases = TestCase.objects.filter(problem=problem.id)
        return [{"input": test_case.inputs, "output": test_case.output} for test_case in
                test_cases[:problem.examples]]

    def validate(self, attrs):
        if self.instance:
            pass
        else:
            attrs = add_user_in_serializer(self, attrs)
        return attrs


class ProblemCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemComment
        fields = '__all__'
        read_only_fields = ['by']

    def validate(self, attrs):
        if self.instance:
            pass
        else:
            attrs = add_user_in_serializer(self, attrs)
        return attrs


class TutorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutorial
        fields = '__all__'
        read_only_fields = ['by']

    def validate(self, attrs):
        if self.instance:
            pass
        else:
            attrs = add_user_in_serializer(self, attrs)
        return attrs


class TutorialCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorialComment
        fields = '__all__'
        read_only_fields = ['by']

    def validate(self, attrs):
        if self.instance:
            pass
        else:
            attrs = add_user_in_serializer(self, attrs)
        return attrs


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = '__all__'


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.username == obj.by.username


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff


class IsPermittedReadProblem(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        contest = obj.contest
        start_time = contest.start_time
        if start_time <= datetime.now(tz=start_time.tzinfo):
            return True
        all_username = []
        for user in contest.hosts.all():
            all_username.append(user.username)
        for user in contest.testers.all():
            all_username.append(user.username)
        if request.user.username in all_username:
            return True
        return False


class IsPermittedEditContest(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        all_username = []
        if request.user.is_staff:
            return True
        for user in obj.hosts.all():
            all_username.append(user.username)
        for user in obj.testers.all():
            all_username.append(user.username)
        if request.user.username in all_username:
            return True
        return False
