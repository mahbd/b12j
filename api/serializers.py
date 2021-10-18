import os

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from judge.models import Contest, Problem, ContestProblem, Submission, Tutorial, TestCase, Comment
from users.models import User

judge_url = os.environ.get('JUDGE_URL', 'http://127.0.0.1:8001/')


def validate_start_end_contest(data):
    if data['start_time'] >= data['end_time']:
        raise ValidationError('Shouldn\'t start before end')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']


class ProblemSerializer(serializers.ModelSerializer):
    test_cases = serializers.SerializerMethodField()

    def get_test_cases(self, problem: Problem) -> dict:
        return TestCaseSerializer(problem.testcase_set.all()[:problem.example_number], many=True).data

    class Meta:
        model = Problem
        exclude = ('created_at', 'checker_function', 'checker_func_lang',
                   'correct_code', 'correct_lang')
        read_only_fields = ('user',)

    def validate(self, attrs):
        attrs['user'] = self.context['request'].user
        return attrs


class ProblemOwnerSerializer(ProblemSerializer):
    class Meta(ProblemSerializer.Meta):
        exclude = ('created_at',)


class ContestProblemSerializer(serializers.ModelSerializer):
    problem = ProblemSerializer()

    class Meta:
        model = ContestProblem
        fields = '__all__'


# TODO: Add validators to start_time, end_time
class ContestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = ('description', 'end_time', 'id', 'start_time',
                  'testers', 'title', 'user', 'writers')
        read_only_fields = ('user',)

    def validate(self, attrs):
        attrs['user'] = self.context['request'].user
        return attrs


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = '__all__'
        read_only_fields = ('user',)

    def validate(self, attrs):
        attrs['user'] = self.context['request'].user
        return attrs


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('user',)

    def validate(self, attrs):
        attrs['user'] = self.context['request'].user
        return attrs


class SubmissionSerializer(serializers.ModelSerializer):
    problem_title = serializers.SerializerMethodField()

    # noinspection PyMethodMayBeStatic
    def get_problem_title(self, submission: Submission) -> str:
        return submission.problem.title

    class Meta:
        model = Submission
        fields = ('id', 'user', 'problem', 'problem_title', 'contest', 'language',
                  'verdict', 'created_at')
        read_only_fields = ('user',)

    def validate(self, attrs):
        attrs['user'] = self.context['request'].user
        return attrs


class SubmissionDetailsSerializer(SubmissionSerializer):
    class Meta(SubmissionSerializer.Meta):
        fields = '__all__'


class TutorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutorial
        fields = '__all__'
        read_only_fields = ('user',)

    def validate(self, attrs):
        attrs['user'] = self.context['request'].user
        return attrs
