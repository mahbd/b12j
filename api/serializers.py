import os

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


class ProblemSerMeta:
    model = Problem
    fields = '__all__'
    read_only_fields = ['by']


class ProblemSer(serializers.ModelSerializer):
    test_cases = serializers.SerializerMethodField(read_only=True)

    class Meta(ProblemSerMeta):
        extra_kwargs = {
            'corCode': {'write_only': True},
            'checker': {'write_only': True},
        }

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


class ProblemSerOwner(ProblemSer):
    class Meta(ProblemSerMeta):
        pass


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
