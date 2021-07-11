import ssl

from django.contrib.auth import get_user_model
from pymongo import MongoClient

from judge.models import Contest, Problem, TestCase, Submission, ContestProblem

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
        try:
            user = User.objects.get(email=user['email'])
        except TypeError:
            print(user_id, user)
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
            user.pop('_id')
            user.pop('id')
            user.pop('picture')
            user.pop('cf_handle')
            user.pop('batch')
            user.pop('is_admin')
            User.objects.create(**user)

    def contests(self):
        contests = self.contest_table.find()
        for contest in contests:
            contest.pop('_id')
            contest.pop('group_id')
            problems = self.problem_table.find({'contest_id': contest['id']})
            hosts = self.contest_hosts_table.find({'contest_id': contest['id']})
            testers = self.contest_testers_table.find({'contest_id': contest['id']})
            contest.pop('id')
            try:
                contest = Contest.objects.create(**contest)
            except Exception as e:
                contest = Contest.objects.get(**contest)
                print(e)

            for problem in problems:
                problem_id = self.convert_m_problem_id(problem['id'])
                ContestProblem.objects.create(problem_id=problem_id, contest=contest, problem_char=problem['conProbId'])
            for host in hosts:
                contest.writers.add(User.objects.get(id=self.convert_m_user_id(host['user_id'])))
            for tester in testers:
                contest.testers.add(User.objects.get(id=self.convert_m_user_id(tester['user_id'])))
            contest.save()

    def problems(self):
        problems = self.problem_table.find()
        for problem in problems:
            problem = dict(problem)
            problem.pop('_id')
            problem.pop('id')
            problem['by_id'] = self.convert_m_user_id(problem['by_id'])
            problem.pop('contest_id')
            problem.pop('group_id')
            problem.pop('conProbId')
            Problem.objects.create(**problem)

    def submissions(self):
        submissions = self.submission_table.find()
        for submission in submissions:
            submission = dict(submission)
            submission.pop('_id')
            submission.pop('id')
            submission.pop('time_code')
            submission['by_id'] = self.convert_m_user_id(submission['by_id'])
            submission['problem_id'] = self.convert_m_problem_id(submission['problem_id'])
            submission['contest_id'] = self.convert_m_contest_id(submission['contest_id'])
            Submission.objects.create(**submission)

    def test_cases(self):
        test_cases = self.test_case_table.find()
        for test_case in test_cases:
            test_case = dict(test_case)
            test_case.pop('_id')
            test_case.pop('id')
            test_case['problem_id'] = self.convert_m_problem_id(test_case['problem_id'])
            TestCase.objects.create(**test_case)

    def full_restore(self):
        self.users()
        self.problems()
        self.contests()
        self.submissions()
        self.test_cases()
