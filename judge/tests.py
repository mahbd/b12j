from datetime import datetime

from judge.models import Contest, Problem, ProblemDiscussion
from users.models import User


def create_contest(title, text, start_time: datetime, end_time: datetime):
    return Contest.objects.create(title=title, text=text,
                                  start_time=start_time,
                                  end_time=end_time)


def create_problem(by, title, text, in_terms, out_terms, cor_code):
    return Problem.objects.create(by=by, title=title, text=text,
                                  inTerms=in_terms, outTerms=out_terms,
                                  corCode=cor_code)


def create_problem_discussion(by: User, problem: Problem,
                              parent: ProblemDiscussion, text):
    return ProblemDiscussion.objects.create(by=by, problem=problem,
                                            parent=parent, text=text)
