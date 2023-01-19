import ssl

from django.contrib.auth import get_user_model
from django.db.models import Q
from pymongo import MongoClient

from judge.models import Contest, Problem, TestCase, Submission, ContestProblem, LANGUAGE_CPP

User = get_user_model()


class B12JMongoDB:
    def __init__(self, link: str):
        self.my_client = MongoClient(link, ssl_cert_reqs=ssl.CERT_NONE)
        self.my_db = self.my_client['b12j_db']
        self.user_table = self.my_db['user_user']
        self.contest_table = self.my_db['judge_contest']
        self.contest_testers_table = self.my_db['judge_contest_testers']
        self.contest_hosts_table = self.my_db['judge_contest_hosts']
        self.problem_table = self.my_db['judge_problem']
        self.submission_table = self.my_db['judge_submission']
        self.test_case_table = self.my_db['judge_testcase']
    def convert_m_user_id(self, user_id):
        user = self.user_table.find_one({'id': user_id})
        q = Q(email=user['email']) | Q(username=user['username'])
        user = User.objects.filter(q).first()
        return user.id
    def convert_m_contest_id(self, contest_id):
        contest = self.contest_table.find_one({'id': contest_id})
        contest = Contest.objects.get(title=contest['title'])
        return contest.id
    def convert_m_problem_id(self, problem_id):
        problem = self.problem_table.find_one({'id': problem_id})
        problem = Problem.objects.get(title=problem['title'])
        return problem.id


class B12JMongoDBGet(B12JMongoDB):
    def __init__(self, link: str):
        super().__init__(link)
    def users(self):
        for user in self.user_table.find():
            needed_attrs = {
                'username': user['username'],
                'email': user['email'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'date_joined': user['date_joined']
            }
            q = Q(username=user['username']) | Q(email=user['email'])
            if User.objects.filter(q).exists():
                continue
            User.objects.create(**needed_attrs)
    def problems(self):
        problems = self.problem_table.find()
        for problem in problems:
            problem = dict(problem)
            if Problem.objects.filter(title=problem['title']).exists():
                continue
            needed_attrs = {
                'correct_code': problem['corCode'],
                'correct_lang': LANGUAGE_CPP,
                'description': problem['text'],
                'input_terms': problem['inTerms'],
                'notice': 'Restored from old judge',
                'output_terms': problem['outTerms'],
                'title': problem['title'],
                'user_id': self.convert_m_user_id(problem['by_id']),
                'created_at': problem['date']
            }
            problem = Problem.objects.create(**needed_attrs)
            print(problem)
    def contests(self):
        contests = self.contest_table.find()
        for contest in contests:
            if Contest.objects.filter(title=contest['title']).exists():
                continue
            problems = self.problem_table.find({'contest_id': contest['id']})
            writers = self.contest_hosts_table.find({'contest_id': contest['id']})
            testers = self.contest_testers_table.find({'contest_id': contest['id']})
            needed_attrs = {
                'description': contest['text'],
                'end_time': contest['end_time'],
                'start_time': contest['start_time'],
                'title': contest['title'],
                'created_at': contest['date']
            }
            contest = Contest.objects.create(**needed_attrs)
            for problem in problems:
                problem_id = self.convert_m_problem_id(problem['id'])
                ContestProblem.objects.create(problem_id=problem_id, contest=contest, problem_char=problem['conProbId'])
            for host in writers:
                contest.writers.add(User.objects.get(id=self.convert_m_user_id(host['user_id'])))
            for tester in testers:
                contest.testers.add(User.objects.get(id=self.convert_m_user_id(tester['user_id'])))
            contest.save()
    def submissions(self):
        submissions = self.submission_table.find()
        for submission in submissions:
            submission = dict(submission)
            user_id = self.convert_m_user_id(submission['by_id'])
            problem_id = self.convert_m_problem_id(submission['problem_id'])
            if Submission.objects.filter(code=submission['code'], user_id=user_id, problem_id=problem_id).exists():
                continue
            needed_attrs = {
                'user_id': user_id,
                'problem_id': problem_id,
                'contest_id': self.convert_m_contest_id(submission['contest_id']),
                'code': submission['code'],
                'language': submission['language'],
                'created_at': submission['date']
            }
            Submission.objects.create(**needed_attrs)
    def test_cases(self):
        test_cases = self.test_case_table.find()
        for test_case in test_cases:
            test_case = dict(test_case)
            problem_id = self.convert_m_problem_id(test_case['problem_id'])
            if TestCase.objects.filter(problem_id=problem_id, inputs=test_case['inputs']).exists():
                continue
            needed_attrs = {
                'problem_id': problem_id,
                'inputs': test_case['inputs'],
                'output': test_case['output'],
                'created_at': test_case['date']

            }
            test_case = TestCase.objects.create(**needed_attrs)
            print(test_case)
    def full_restore(self):
        self.users()
        self.problems()
        self.contests()
        self.submissions()
        self.test_cases()
