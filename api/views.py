from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from api.permissions import IsOwnerOrReadOnly, HasContestOrReadOnly
from api.serializers import ContestSerializer, ProblemSerializer, CommentSerializer, SubmissionSerializer, \
    TestCaseSerializer, UserSerializer, TutorialSerializer, ProblemOwnerSerializer, ContestProblemSerializer, \
    SubmissionDetailsSerializer
from judge.models import Contest, Problem, Submission, Tutorial, TestCase, Comment, ContestProblem
from users.models import User


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ContestViewSet(viewsets.ModelViewSet):
    @action(detail=True, methods=['OPTIONS', 'HEAD', 'GET', 'POST'])
    @permission_classes([HasContestOrReadOnly])
    def problems(self, request, pk, *args, **kwargs):
        if request.method == 'GET':
            contest = get_object_or_404(Contest, pk=pk)
            contest_problems = ContestProblem.objects.filter(contest_id=pk)
            if not HasContestOrReadOnly().has_object_permission(request, None, contest, True):
                contest_problems = contest_problems.exclude(contest__start_time__lt=timezone.now())
            return Response({
                "count": contest_problems.count(),
                "results": ContestProblemSerializer(contest_problems, many=True).data,
                "id": pk,
            }, status=200)

        elif request.method == 'POST':
            try:
                problems = request.data['problems_data']
                problem_chars = {x['problem']: x['problem_char'] for x in problems}
                problems = Problem.objects.filter(pk__in=[x['problem'] for x in problems])
            except Exception as e:
                return Response({'details': f"Invalid form structure {e}",
                                 'valid_structure': {
                                     'problems_data': [
                                         {'problem': 'problem id', 'problem_char': 'Character to show'}
                                     ]
                                 }}, status=400)
            ContestProblem.objects.filter(contest_id=pk).delete()
            for problem in problems:
                ContestProblem.objects.create(contest_id=pk, problem=problem,
                                              problem_char=problem_chars[problem.id])
            contest_problems = ContestProblem.objects.filter(contest_id=pk)
            return Response({
                "count": contest_problems.count(),
                "results": ContestProblemSerializer(contest_problems, many=True).data,
                "id": pk
            }, status=200)

    def get_queryset(self):
        if self.request.GET.get('user_contests'):
            return Contest.objects.filter(writers=self.request.user)
        return Contest.objects.all()

    permission_classes = [HasContestOrReadOnly]
    serializer_class = ContestSerializer


class ProblemViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('user_problems'):
            return Problem.objects.filter(user=self.request.user)
        if self.request.GET.get('solved_problems'):
            return Problem.objects.filter(submission__verdict='AC', submission__user=self.request.user)
        if self.request.GET.get('unsolved_problems'):
            solved_ids = [problem.id for
                          problem in Problem.objects.only('id').filter(submission__verdict='AC',
                                                                       submission__user=self.request.user)]
            return Problem.objects.exclude(id__in=solved_ids).filter(hidden_till__gt=timezone.now())
        if self.request.GET.get('test_problems'):
            q = Q(contest__writers=self.request.user) | Q(contest__testers=self.request.user)
            return Problem.objects.filter(q, contest__start_time__gt=timezone.now())
        return Problem.objects.filter(hidden_till__lt=timezone.now())

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
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SubmissionDetailsSerializer
        submission = Submission.objects.filter(pk=self.kwargs.get('pk'))
        if submission.exists():
            submission = submission.first()
            user = self.request.user
            if not submission.contest or submission.user == user or user.is_staff or\
                    submission.contest.end_time < timezone.now():
                return SubmissionDetailsSerializer
        return SubmissionSerializer

    http_method_names = ['get', 'post', 'head', 'options']
    queryset = Submission.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['problem_id', 'user_id', 'contest_id']
    permission_classes = [IsOwnerOrReadOnly]


class TutorialViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('user_tutorials'):
            return Tutorial.objects.filter(user=self.request.user)
        return Tutorial.objects.filter(hidden_till__lt=timezone.now())

    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = TutorialSerializer


class TestCaseViewSet(viewsets.ModelViewSet):
    queryset = TestCase.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['problem_id', 'user_id']
    serializer_class = TestCaseSerializer
    permission_classes = [IsOwnerOrReadOnly]
