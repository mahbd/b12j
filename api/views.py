from datetime import datetime

from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_list_or_404
from rest_framework import permissions, viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

# from api.serializers import, TutorialCommentSerializer
from api.permissions import IsPermittedEditContest, IsPermittedAddContest, IsPermittedDeleteDiscussion
from api.serializers import ContestSer, ProblemSer, ProblemDiscussionSer, SubmissionSer, TestCaseSer, UserSer, \
    TutorialSer, TutorialDiscussionSer, ProblemSerOwner
from judge.models import Contest, Problem, Submission, Tutorial, TestCase, ProblemDiscussion, TutorialDiscussion
from users.models import User


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "username"
    queryset = User.objects.all()
    serializer_class = UserSer


class ContestViewSet(viewsets.ModelViewSet):
    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def user_contests(self, request, *args):
        if request.user:
            contests = ContestSer(Contest.objects.filter(writers=request.user), many=True).data
            return Response({"results": contests})
        return Response({"details": "User is not authenticated"}, status=301)

    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsPermittedAddContest, IsPermittedEditContest]
    queryset = Contest.objects.all()
    serializer_class = ContestSer


class ProblemViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.method == 'PUT' or self.request.method == 'POST':
            return Problem.objects.all()
        return [problem for problem in Problem.objects.all() if not problem.lone_problem()]

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def user_problems(self, request, *args):
        problems = ProblemSer(Problem.objects.filter(by=request.user), many=True).data
        return Response({"results": problems, "name": "user_problems"})

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def test_problems(self, request, *args):
        q = Q(contest__writers=request.user) | Q(contest__testers=request.user)
        problems = ProblemSer(Problem.objects.filter(q, contest__start_time__gt=datetime.now()), many=True).data
        return Response({"results": problems, "name": "test_problems"})

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def solved_problems(self, request, *args):
        problems = ProblemSer(Problem.objects.filter(submission__verdict='AC', submission__by=request.user),
                              many=True).data
        return Response({"results": problems, "name": "solved_problems"})

    @action(detail=False)
    def contest_problems(self, request, *args):
        contest_id = request.GET.get('contest_id')
        if contest_id:
            try:
                problems = Problem.objects.filter(contestproblem__contest_id=contest_id)
            except Exception as e:
                print(e)
                raise ValidationError('Internal error')
            return Response({'problems': ProblemSer(problems, many=True).data, 'contest_id': contest_id})
        raise ValidationError('Contest id must be present on parameter')

    def get_serializer_class(self):
        if self.request.method == 'PUT' or self.request.method == 'POST':
            return ProblemSerOwner
        return ProblemSer


class ProblemDiscussionViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return ProblemDiscussion.objects.filter(problem_id=self.kwargs.get('problem_id'))

    serializer_class = ProblemDiscussionSer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsPermittedDeleteDiscussion]


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSer

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def user_submissions(self, request, *args):
        submissions = SubmissionSer(Submission.objects.filter(by=request.user), many=True).data
        return Response({"results": submissions, "name": "user_submission"})


class TutorialViewSet(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('contest_id'):
            return get_list_or_404(Tutorial, contest_id=self.request.GET['contest_id'], hidden_till__lt=datetime.now())
        if self.request.GET.get('problem_id'):
            return get_list_or_404(Tutorial, problem_id=self.request.GET['problem_id'], hidden_till__lt=datetime.now())
        return Tutorial.objects.filter(hidden_till__lt=datetime.now())

    serializer_class = TutorialSer


class TutorialDiscussionViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return TutorialDiscussion.objects.filter(tutorial_id=self.kwargs.get('tutorial_id'))

    serializer_class = TutorialDiscussionSer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsPermittedDeleteDiscussion]


class TestCaseViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('problem_id'):
            try:
                problem = Problem.objects.get(id=self.request.GET.get('problem_id'))
            except Problem.DoesNotExist:
                raise ValidationError("Requested problem doesn't exist")
            if not self.request.user.is_staff and self.request.user.id != problem.by_id:
                raise ValidationError("Only problem writer and staff can add and edit new test cases")
            return problem.testcase_set.all()
        return TestCase.objects.all()

    serializer_class = TestCaseSer
    permission_classes = [permissions.IsAuthenticated]
