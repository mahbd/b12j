import os
from pathlib import Path

import firebase_admin
import requests
from django.db.models import Q
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django_filters.rest_framework import DjangoFilterBackend
from firebase_admin import credentials, auth
from firebase_admin.auth import ExpiredIdTokenError
from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes, api_view
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from social_django.utils import psa

from api.permissions import IsOwnerOrReadOnly, HasContestOrReadOnly
from api.serializers import ContestSerializer, ProblemSerializer, CommentSerializer, SubmissionSerializer, \
    TestCaseSerializer, UserSerializer, TutorialSerializer, ProblemOwnerSerializer, ContestProblemSerializer, \
    SubmissionDetailsSerializer
from judge.models import Contest, Problem, Submission, Tutorial, TestCase, Comment, ContestProblem
from users.models import User

path = os.path.join(Path(__file__).resolve().parent.parent, "firebase-adminsdk.json")
if os.path.exists('firebase-adminsdk.json'):
    cred = credentials.Certificate('firebase-adminsdk.json')
    firebase_admin.initialize_app(cred)
else:
    if os.getenv('FIREBASE_SDK'):
        url = os.getenv('FIREBASE_SDK')
        json_data = requests.get(url).json()
        cred = credentials.Certificate(json_data)
        firebase_admin.initialize_app(cred)
    else:
        raise Exception('firebase-adminsdk.json not found')


def fill_token_with_extra(token, user) -> RefreshToken:
    token['name'] = user.get_full_name() or user.username
    token['is_staff'] = user.is_staff
    token['is_superuser'] = user.is_superuser
    token['username'] = user.username
    token['first_name'] = user.first_name
    token['last_name'] = user.last_name
    token['email'] = user.email
    return token


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user) -> RefreshToken:
        token = super().get_token(user)
        return fill_token_with_extra(token, user)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@psa()
def _psa(request, backend):
    pass


class CompleteView(APIView):  # Knox login view
    permission_classes = [AllowAny]

    @method_decorator(never_cache)
    def post(self, request, *args, **kwargs):
        provider = kwargs["provider"]
        _psa(request, provider)
        request.backend.data = request.data
        request.backend.redirect_uri = request.data.get("redirect_uri")
        request.backend.REDIRECT_STATE = False
        request.backend.STATE_PARAMETER = False
        user = request.user if request.user.is_authenticated else None
        user = request.backend.complete(user=user)
        if not isinstance(user, User):
            return user

        request.user = user
        token = RefreshToken.for_user(user)
        refresh = fill_token_with_extra(token, user)
        data = {'refresh': str(refresh), 'access': str(refresh.access_token)}
        return Response(data)


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
                contest_problems = contest_problems.filter(contest__start_time__lt=timezone.now())  # exclude is wrong
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
            return Problem.objects.exclude(id__in=solved_ids).filter(hidden_till__lt=timezone.now())
        if self.request.GET.get('test_problems'):
            q = Q(contest__writers=self.request.user) | Q(contest__testers=self.request.user)
            return Problem.objects.filter(q, contest__start_time__gt=timezone.now())
        return [problem for problem in
                Problem.objects.filter(hidden_till__lt=timezone.now())
                if problem.is_hidden() is False]

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
            if submission.user == user or user.is_staff:
                return SubmissionDetailsSerializer
            completed_all_contest = True
            for contest in submission.problem.contest_set.all():
                if contest.end_time < timezone.now():
                    completed_all_contest = False
            if completed_all_contest:
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


@api_view(['POST'])
def google_login(request):
    id_token = request.POST.get('id_token') or request.data.get('id_token')
    try:
        decoded_token = auth.verify_id_token(id_token)
    except ExpiredIdTokenError:
        return Response({'details': 'Token expired'}, status=400)
    except ValueError:
        return Response({'details': 'Invalid token'}, status=400)
    name = decoded_token['name']
    first_name = name.split(' ')[0]
    last_name = ' '.join(name.split(' ')[1:])
    email = decoded_token['email']
    user_id = decoded_token['uid']
    # check if user exists with this email
    user = User.objects.filter(email=email)
    if user.exists():
        user = user.first()
        token_obj = RefreshToken.for_user(user)
        fill_token_with_extra(token_obj, user)
        user.last_login = timezone.now()
        user.save()
        return Response({'access': str(token_obj), 'refresh': str(token_obj)})
    else:
        user = User.objects.create(username=user_id, email=email, first_name=first_name, last_name=last_name)
        token_obj = RefreshToken.for_user(user)
        fill_token_with_extra(token_obj, user)
        return Response({'access': str(token_obj), 'refresh': str(token_obj)})
