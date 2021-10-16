from datetime import datetime

from django.db.models import Q
from rest_framework import viewsets

from api.permissions import IsOwnerOrReadOnly, HasContestReadOnly
from api.serializers import ContestSerializer, ProblemSerializer, CommentSerializer, SubmissionSerializer, \
    TestCaseSerializer, UserSerializer, TutorialSerializer, ProblemOwnerSerializer
from judge.models import Contest, Problem, Submission, Tutorial, TestCase, Comment
from users.models import User


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ContestViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('user'):
            return Contest.objects.filter(writers=self.request.user)
        return Contest.objects.all()

    permission_classes = [HasContestReadOnly]
    serializer_class = ContestSerializer


class ProblemViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('user_problems'):
            return Problem.objects.filter(by=self.request.user)
        if self.request.GET.get('solved_problems'):
            return Problem.objects.filter(submission__verdict='AC', submission__by=self.request.user)
        if self.request.GET.get('test_problems'):
            q = Q(contest__writers=self.request.user) | Q(contest__testers=self.request.user)
            return Problem.objects.filter(q, contest__start_time__gt=datetime.now())
        return Problem.objects.all()

    def get_serializer_class(self):
        request = self.request
        if self.kwargs.get('pk'):
            if Problem.objects.filter(pk=self.kwargs.get('pk')).exists():
                if self.request.user == Problem.objects.filter(pk=self.kwargs.get('pk')).first().user:
                    return ProblemOwnerSerializer
        if request.method == 'POST':
            return ProblemOwnerSerializer
        return ProblemSerializer

    permission_classes = [IsOwnerOrReadOnly]


class CommentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Comment.objects.filter(problem_id=self.kwargs.get('problem_id'))

    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrReadOnly]


class SubmissionViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'head', 'options']
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsOwnerOrReadOnly]


class TutorialViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('user_tutorials'):
            return Tutorial.objects.filter(user=self.request.user)
        return Tutorial.objects.all()

    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = TutorialSerializer


class TestCaseViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return TestCase.objects.all()

    serializer_class = TestCaseSerializer
    permission_classes = [IsOwnerOrReadOnly]
