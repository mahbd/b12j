import json
import os
import re
import time

import requests

from judge.models import LANGUAGE_IDS, Submission


def get_output(language, code, input_txt, time_limit, memory_limit):
    body = {
        'language_id': LANGUAGE_IDS[language],
        'source_code': code,
        'stdin': input_txt,
        'cpu_time_limit': time_limit,
        'memory_limit': memory_limit * 1000,
    }
    JUDGE0_URL = os.environ.get('JUDGE0_URL')
    JUDGE0_KEY = os.environ.get('JUDGE0_KEY')
    headers = {
        'Content-Type': 'application/json',
        'X-Auth-User': JUDGE0_KEY
    }
    res = requests.post(JUDGE0_URL + '/submissions', json=body, headers=headers)
    submission_token = res.json()['token']
    time.sleep(1)
    submission_url = f"{JUDGE0_URL}/submissions/{submission_token}?fields=stdout,stderr,status_id,time,memory"
    res = requests.get(submission_url, headers=headers)
    while res.json()['status_id'] <= 2:
        res = requests.get(submission_url, headers=headers)
        time.sleep(1)
    status_id = res.json()['status_id']
    memory = res.json()['memory']
    cpu_time = res.json()['time']
    if status_id >= 6:
        output = res.json()['stderr']
    else:
        output = res.json()['stdout']
    return output, status_id, memory, cpu_time


def check_float(s):
    s = s.strip()
    if re.match(r'^-?\d+(?:\.\d+)$', s) is None:
        return False
    return True


def is_equal(words):
    word1, word2 = words
    if check_float(word1):
        try:
            word1, word2 = float(word1), float(word2)
        except TypeError:
            return False
        word1, word2 = (round(word1 * 1000)) / \
                       1000, (round(word2 * 1000)) / 1000
        return word1 == word2
    return word1.strip() == word2.strip()


def compare_output(output_text, correct_text):
    out_line_arr, corr_line_arr = str(output_text).strip().split(
        '\n'), str(correct_text).strip().split('\n')
    if len(out_line_arr) != len(corr_line_arr):
        return 'WA', 0
    line = 0
    tuple_line = zip(out_line_arr, corr_line_arr)
    for inp, cor in tuple_line:
        line += 1
        inp_arr, cor_arr = inp.strip().split(), cor.strip().split()
        if len(inp_arr) != len(cor_arr):
            return 'WA', line
        tuple_word = zip(cor_arr, inp_arr)
        for words in tuple_word:
            if not is_equal(words):
                return 'WA', line
    return 'AC', None


def check_correctness(correct_output, overall_status, present_output, test_case, input_text):
    status = compare_output(present_output, correct_output)
    if status[0] == 'WA':
        overall_status[0] = 'WA'
        overall_status[1].append(
            [input_text[:200], present_output[:200], correct_output[:200]])
        overall_status[2] = f'Wrong answer on test case {test_case} in line {status[1]}'
    else:
        overall_status[0] = 'AC'
        overall_status[1].append(
            [input_text[:200], present_output[:200], correct_output[:200]])
        overall_status[2] = 'Everything looks good'
    overall_status = overall_status
    return overall_status


def judge_solution(submission: Submission):
    submission.verdict = 'Running'
    submission.save()
    language = submission.language
    time_limit = submission.problem.time_limit
    memory_limit = submission.problem.memory_limit
    test_cases = submission.problem.testcase_set.all()
    input_list, output_list = [], []
    for tc in test_cases:
        input_list.append(tc.inputs)
        output_list.append(tc.output)

    overall_status = ['OK', [], 'Everything looks fine']
    test_case = 0
    for input_txt, correct_output in zip(input_list, output_list):
        test_case += 1
        submission.verdict = f"Running on test case {test_case}"
        submission.save()
        status = get_output(language, submission.code, input_txt, time_limit, memory_limit)
        if status[1] == 5:
            overall_status[0] = 'TLE'
            overall_status[1].append([input_txt[:200], '', ''])
            overall_status[2] = f'Time limit exceed on test case {test_case}'
            break
        else:
            present_output = status[0]
            overall_status = check_correctness(
                correct_output, overall_status, present_output, test_case, input_txt)
            if overall_status[0] == 'WA':
                break

    submission.verdict = overall_status[0]
    submission.details = json.dumps(overall_status)
    submission.save()
