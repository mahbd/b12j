from datetime import datetime

from django.db.models import Q
from django.shortcuts import get_list_or_404
from rest_framework import permissions, viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response

# from api.serializers import, TutorialCommentSerializer
from api.permissions import IsPermittedEditContest, IsPermittedAddContest
from api.serializers import ContestSer, UserSer, ProblemSer, SubmissionSer, TutorialSer, TestCaseSerializer
# , ProblemCommentSerializer
from judge.models import Contest, Problem, Submission, Tutorial, TestCase
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
            contests = ContestSer(Contest.objects.filter(hosts=request.user), many=True).data
            return Response({"results": contests})
        return Response({"details": "User is not authenticated"}, status=301)

    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsPermittedAddContest, IsPermittedEditContest]
    queryset = Contest.objects.all()
    serializer_class = ContestSer


class ProblemViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Problem.objects.filter(hidden_till__lte=datetime.now())

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def user_problems(self, request, *args):
        if request.user:
            problems = ProblemSer(Problem.objects.filter(by=request.user), many=True).data
            return Response({"results": problems})
        return Response({"details": "User is not authenticated"}, status=301)

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def test_problems(self, request, *args):
        q = Q(contest__hosts=request.user) | Q(contest__testers=request.user)
        problems = ProblemSer(Problem.objects.filter(q, contest__start_time__gt=datetime.now()), many=True).data
        return Response({"results": problems})

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def solved_problems(self, request, *args):
        problems = ProblemSer(Problem.objects.filter(submission__verdict='AC', submission__by=request.user),
                              many=True).data
        return Response({"results": problems})

    serializer_class = ProblemSer


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSer

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def user_submissions(self, request, *args):
        submissions = SubmissionSer(Submission.objects.filter(by=request.user), many=True).data
        return Response({"results": submissions})


class TutorialViewSet(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('contest_id'):
            return get_list_or_404(Tutorial, contest_id=self.request.GET['contest_id'], hidden_till__lt=datetime.now())
        if self.request.GET.get('problem_id'):
            return get_list_or_404(Tutorial, problem_id=self.request.GET['problem_id'], hidden_till__lt=datetime.now())
        return Tutorial.objects.filter(hidden_till__lt=datetime.now())

    serializer_class = TutorialSer


# class ProblemCommentViewSet(viewsets.ModelViewSet):
#     def get_queryset(self):
#         if self.request.GET.get('problem_id'):
#             return get_list_or_404(ProblemComment, problem_id=self.request.GET.get('problem_id'))
#         return ProblemComment.objects.all()
#
#     serializer_class = ProblemCommentSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]
#
#
# class SubmissionCreate(generics.CreateAPIView):
#     queryset = Submission.objects.exclude(time_code='BC')
#     serializer_class = SubmissionSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]
#
#
# class TutorialCommentViewSet(viewsets.ModelViewSet):
#     def get_queryset(self):
#         if self.request.GET.get('tutorial_id'):
#             return get_list_or_404(TutorialComment, tutorial_id=self.request.GET.get('tutorial_id'))
#         return TutorialComment.objects.all()
#
#     serializer_class = TutorialCommentSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TestCaseViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('problem_id'):
            return get_list_or_404(TestCase, problem_id=self.request.GET.get('problem_id'))
        return TestCase.objects.all()

    serializer_class = TestCaseSerializer
