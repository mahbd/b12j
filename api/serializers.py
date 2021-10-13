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


class ContestProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestProblem
        fields = '__all__'


# TODO: Add validators to start_time, end_time
class ContestSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Contest
        fields = ('description', 'end_time', 'problems', 'start_time',
                  'testers', 'title', 'user', 'writers')


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = '__all__'


class ProblemSerializer(serializers.ModelSerializer):
    test_cases = TestCaseSerializer(many=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Problem
        exclude = ('created_at', 'checker_function', 'checker_func_lang',
                   'correct_code', 'correct_lang')

    def create(self, validated_data):
        options = validated_data.pop('test_cases', [])
        instance = TestCase.objects.create(**validated_data)
        for task_data in options:
            task = TestCase.objects.create(**task_data)
            instance.options.add(task)
        return instance

    def update(self, instance, validated_data):
        if hasattr(validated_data, 'test_cases'):
            validated_data.pop('test_cases')
        return super().update(instance, validated_data)


class ProblemOwnerSerializer(ProblemSerializer):
    class Meta(ProblemSerializer.Meta):
        exclude = ('created_at',)


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Comment
        fields = '__all__'


class SubmissionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Submission
        fields = '__all__'


class TutorialSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Tutorial
        fields = '__all__'
