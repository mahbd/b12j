import json
from datetime import datetime
from random import randint

from django.core.serializers import serialize
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework import permissions, viewsets, generics
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response

from api.serializers import UserSerializer, ContestSerializer, ProblemSerializer, ProblemCommentSerializer
from api.serializers import SubmissionSerializer, TestCaseSerializer, TutorialSerializer, TutorialCommentSerializer
from extra import jwt_writer
from fun import verify_token
from judge.models import Contest, Problem, ProblemComment, Submission, TestCase, Tutorial, TutorialComment
from user.backends import is_valid_jwt_header
from user.models import User


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ContestViewSet(viewsets.ReadOnlyModelViewSet):
    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def user_contests(self, request, *args):
        if request.user:
            contests = Contest.objects.filter(hosts=request.user)
            contests = serialize('json', contests)
            contests = [{
                "id": contest['pk'], "title": contest['fields']['title'], "start": contest['fields']['start_time']
            }
                for contest in json.loads(contests)]
            return Response({"results": contests})
        return Response({"details": "User is not authenticated"}, status=301)
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer


def serialize_problems(problems):
    problems = serialize('json', problems)
    problems = [{
        "id": problem['pk'], "contest": Contest.objects.get(id=problem['fields']['contest']).title,
        "title": problem['fields']['title']
    }
        for problem in json.loads(problems)]
    return problems


class ProblemViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Problem.objects.filter(contest_id=self.request.GET.get('contest_id'))

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def user_problems(self, request, *args):
        if request.user:
            problems = Problem.objects.filter(by=request.user)
            problems = serialize_problems(problems)
            return Response({"results": problems})
        return Response({"details": "User is not authenticated"}, status=301)

    @action(detail=False)
    @permission_classes([permissions.IsAuthenticated])
    def test_problems(self, request, *args):
        if request.user:
            query = Q(hosts=request.user) | Q(testers=request.user)
            contests = Contest.objects.filter(query, start_time__gt=datetime.now())
            problems = []
            for contest in contests:
                for problem in contest.problem_set.all():
                    problems.append(problem)
            problems = serialize_problems(problems)
            return Response({"results": problems})
        return Response({"details": "User is not authenticated"}, status=301)

    serializer_class = ProblemSerializer


class ProblemCommentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('problem_id'):
            return get_list_or_404(ProblemComment, problem_id=self.request.GET.get('problem_id'))
        return ProblemComment.objects.all()

    serializer_class = ProblemCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.exclude(time_code='BC')
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False)
    def user_submissions(self, request, *args):
        if request.user:
            submissions = Submission.objects.filter(by=request.user)
            submissions = serialize('json', submissions)
            submissions = [{
                "id": submission['pk'], "contest": Contest.objects.get(id=submission['fields']['contest']).title,
                "problem": Problem.objects.get(id=submission['fields']['problem']).title,
                "verdict": submission['fields']['verdict']
            }
                for submission in json.loads(submissions)]
            return Response({"results": submissions})
        return Response({"details": "User is not authenticated"}, status=301)


class SubmissionCreate(generics.CreateAPIView):
    queryset = Submission.objects.exclude(time_code='BC')
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TutorialViewSet(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        return Tutorial.objects.filter(contest_id=self.request.GET.get('contest_id'))

    serializer_class = TutorialSerializer


class TutorialCommentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('tutorial_id'):
            return get_list_or_404(TutorialComment, tutorial_id=self.request.GET.get('tutorial_id'))
        return TutorialComment.objects.all()

    serializer_class = TutorialCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TestCaseViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.GET.get('problem_id'):
            return get_list_or_404(TestCase, problem_id=self.request.GET.get('problem_id'))
        return TestCase.objects.all()

    serializer_class = TestCaseSerializer


def is_logged_in(request):
    user = is_valid_jwt_header(request)
    if user:
        logged = True
    else:
        logged = False
    print(logged)
    return JsonResponse({"status": logged})


def verify_login(request):
    try:
        if request.headers.get('token'):
            id_token = request.headers.get('token')
        elif request.headers.get('Token'):
            id_token = request.headers.get('Token')
        else:
            id_token = json.loads(request.body).get('idToken')
    except json.JSONDecodeError:
        return JsonResponse({"errors": "Wrong place for jwt"}, status=400)
    payload = verify_token(id_token)
    if payload is None:
        return JsonResponse({"errors": "Couldn't login"}, status=400)
    if not payload['email_verified']:
        return JsonResponse({"errors": "Please verify email"})
    name = payload['name']
    picture = payload['picture']
    email = payload['email']
    username = payload['user_id']
    # Login user
    if User.objects.filter(username=username):
        user = User.objects.filter(username=username)[0]
        jwt_str = serialize_user(user)
        return JsonResponse({"jwt": jwt_str})
    # Register user
    name_array = name.split(' ')
    if len(name_array) > 2:
        if len(name_array[0]) < 4:
            first_name = ' '.join(name_array[:2])
            last_name = ' '.join(name_array[2:])
        else:
            first_name = name_array[0]
            last_name = name_array[1:]
    else:
        first_name = name_array[0]
        last_name = '' if len(name_array) < 2 else name_array[1]
    user = User.objects.create_user(username=username, email=email, password=str(randint(100000, 999999)),
                                    first_name=first_name, last_name=last_name, picture=picture)
    jwt_str = serialize_user(user)
    return JsonResponse({"jwt": jwt_str})


def serialize_user(user):
    json_data = json.loads(serialize('json', [user]))[0]
    user = json_data['fields']
    user['id'] = json_data['pk']
    user.pop('password', None)
    jwt_str = jwt_writer(**user)
    return jwt_str
