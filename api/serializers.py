import os
from datetime import datetime

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from judge.models import Contest, Problem, ContestProblem, Submission, Tutorial, TestCase, ProblemDiscussion, \
    TutorialDiscussion
from users.models import User

judge_url = os.environ.get('JUDGE_URL', 'http://127.0.0.1:8001/')


def add_user_in_serializer(self, attrs):
    if self.instance:
        pass
    else:
        if not attrs.get('by'):
            attrs['by'] = self.context['request'].user
    return attrs


def validate_start_end_contest(data):
    if data['start_time'] >= datetime.now(tz=data['start_time'].tzinfo):
        raise ValidationError('Shouldn\'t start in past')
    if data['start_time'] >= data['end_time']:
        raise ValidationError('Shouldn\'t start before end')


class UserSer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']


class ContestProblemSer(serializers.ModelSerializer):
    class Meta:
        model = ContestProblem
        fields = '__all__'


class ContestSer(serializers.ModelSerializer):
    problems = serializers.SerializerMethodField()

    class Meta:
        model = Contest
        fields = '__all__'
        validators = [validate_start_end_contest]

    # noinspection PyMethodMayBeStatic
    def get_problems(self, contest):
        return [ContestProblemSer(cp).data for cp in ContestProblem.objects.filter(contest=contest)]


class ProblemSer(serializers.ModelSerializer):
    test_cases = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Problem
        fields = '__all__'
        extra_kwargs = {
            'corCode': {'write_only': True},
            'checker': {'write_only': True},
        }
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


class ProblemDiscussionSer(serializers.ModelSerializer):
    class Meta:
        model = ProblemDiscussion
        fields = '__all__'

    def validate(self, attrs):
        if self.instance:
            pass
        else:
            attrs = add_user_in_serializer(self, attrs)
        return attrs


class SubmissionSer(serializers.ModelSerializer):
    problem_title = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ['verdict', 'contest', 'by']
        extra_kwargs = {
            'code': {'write_only': True},
        }

    # noinspection PyMethodMayBeStatic
    def get_problem_title(self, submission):
        return submission.problem.title

    def validate(self, attrs):
        if self.instance:
            pass
        else:
            attrs = add_user_in_serializer(self, attrs)
        return attrs


class TutorialSer(serializers.ModelSerializer):
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


class TutorialDiscussionSer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = TutorialDiscussion
        fields = '__all__'


class TestCaseSer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = '__all__'

# def judge_connect(submission_id):
#     """Send signal to judge to judge submission\nIf Fails it just print failure reason"""
#     try:
#         submission = Submission.objects.get(id=submission_id)
#         try:
#             problem = submission.problem
#             data = {
#                 "id": submission.id,
#                 "title": problem.title,
#                 "code": submission.code,
#                 "language": submission.language,
#                 "time_limit": problem.time_limit,
#             }
#             try:
#                 res = requests.post(judge_url, data)
#             except Exception as e:
#                 print("Failed", submission_id, e)
#                 submission.verdict = 'FJ'
#                 submission.save()
#                 return
#             if res.status_code != 200:
#                 try:
#                     judge_url2 = "http://oj.mahbd.heliohost.org/judge/"
#                 except Exception as e:
#                     print("Failed", submission_id, e)
#                     submission.verdict = 'FJ'
#                     submission.save()
#                     return
#                 res = requests.get(f'{judge_url2}{submission_id}')
#                 if res.status_code == 200:
#                     data = res.json()
#                     print("From Judge Response", data.get('status'))
#                     submission = Submission.objects.get(id=submission_id)
#                     submission.verdict = data.get('status')
#                     submission.save()
#                     return
#             elif res.status_code != 200:
#                 print("Failed", submission_id)
#                 submission.verdict = 'FJ'
#                 submission.save()
#                 return
#             status = res.json()['status']
#             submission.verdict = status[0]
#             if status[0] == 'CE':
#                 submission.details = json.dumps([status[1], ['', '', '']])
#             else:
#                 submission.details = json.dumps([status[2], status[1]])
#             submission.save()
#         except Exception as e:
#             print(e)
#     except Submission.DoesNotExist:
#         pass


# class ProblemCommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProblemComment
#         fields = '__all__'
#         read_only_fields = ['by']
#
#     def validate(self, attrs):
#         if self.instance:
#             pass
#         else:
#             attrs = add_user_in_serializer(self, attrs)
#         return attrs
#
#
# class TutorialCommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TutorialComment
#         fields = '__all__'
#         read_only_fields = ['by']
#
#     def validate(self, attrs):
#         if self.instance:
#             pass
#         else:
#             attrs = add_user_in_serializer(self, attrs)
#         return attrs
#
#
# class IsOwnerOrReadOnly(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return request.user.username == obj.by.username
#
#
# class IsStaffOrReadOnly(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return request.user.is_staff
#
#
# class IsPermittedReadProblem(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         contest = obj.contest
#         start_time = contest.start_time
#         if start_time <= datetime.now(tz=start_time.tzinfo):
#             return True
#         all_username = []
#         for user in contest.hosts.all():
#             all_username.append(user.username)
#         for user in contest.testers.all():
#             all_username.append(user.username)
#         if request.user.username in all_username:
#             return True
#         return False
