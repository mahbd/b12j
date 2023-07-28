import json
import os
import re

from django.conf import settings

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))


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


def check_float(s):
    s = s.strip()
    if re.match(r'^-?\d+(?:\.\d+)$', s) is None:
        return False
    return True


def create_files(path, files_with_text):
    for name, text in files_with_text:
        with open(f'{path}{name}', 'w+') as new_file:
            new_file.write(str(text))
        os.chmod(f'{path}{name}', 0o755)


def delete_files(path, file_names):
    for name in file_names:
        if os.path.exists(f'{path}{name}'):
            os.remove(f'{path}{name}')


def check_output(output_text, correct_text):
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
    status = check_output(present_output, correct_output)
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


def get_output(path, input_txt, language, time_limit=1):
    create_files(path, zip(['_in.txt', '_out.txt'], [input_txt, '']))
    cid = path.split('/')[-1]
    bf_cid = '/'.join(path.split('/')[:-1]) + '/'
    if language == 'c_cpp':
        cr = os.system(
            f'timeout {time_limit} {bf_cid}./{cid} < {path}_in.txt > {path}_out.txt')
    else:
        cr = os.system(
            f'timeout {time_limit + 1} python3 {path}.py < {path}_in.txt > {path}_out.txt')
    if cr != 0:
        delete_files(path, ['_in.txt', '_out.txt'])
        return 'TLE', None
    with open(f'{path}_out.txt') as file_out:
        output = file_out.read().strip()
    delete_files(path, ['_in.txt', '_out.txt'])
    return 'OK', output


def check_test_case(path, input_list, output_list, language, time_limit, websocket, check_id):
    overall_status = ['OK', [], 'Everything looks fine']
    test_case = 0
    for input_txt, correct_output in zip(input_list, output_list):
        test_case += 1
        try:
            if websocket:
                websocket.send(json.dumps({'status': f'Running test case {test_case}', 'id': check_id}))
        except:
            pass
        status = get_output(path, input_txt, language, time_limit)
        if status[0] == 'TLE':
            overall_status[0] = 'TLE'
            overall_status[1].append([input_txt[:200], '', ''])
            overall_status[2] = f'Time limit exceed on test case {test_case}'
            break
        else:
            present_output = status[1]
            overall_status = check_correctness(
                correct_output, overall_status, present_output, test_case, input_txt)
            if overall_status[0] == 'WA':
                break
    return overall_status


def compile_code_cpp(path, code):
    create_files(path, zip(['.cpp', '_err.txt'], [code, '']))
    if os.system(f'g++ -std=c++20 {path}.cpp -o {path} 2> {path}_err.txt') != 0:
        with open(f'{path}_err.txt', 'r') as file_err:
            errors = file_err.read()
        delete_files(path, ['.cpp', '_err.txt'])
        return 'CE', '\n'.join(errors.split('\n')[1:4])
    delete_files(path, ['.cpp', '_err.txt'])
    return 'OK', None


def compile_code_python(path, code, sample):
    create_files(path, zip(['.py', '_in.txt', '_err.txt'], [code, sample, '']))
    stat = os.system(
        f'timeout {2} python3 {path}.py < {path}_in.txt 2> {path}_err.txt')
    if stat != 0:
        with open(f'{path}_err.txt', 'r') as file_err:
            errors = file_err.read()
        delete_files(path, ['_err.txt', '_in.txt'])
        return 'CE', f"Error Code: {stat}\n" + '\n'.join(errors.split('\n')[1:4])
    delete_files(path, ['_err.txt', '_in.txt'])
    return 'OK', None


def compile_code(path, code, language, sample):
    if language == 'c_cpp':
        status = compile_code_cpp(path, code)
    elif language == 'python':
        status = compile_code_python(path, code, sample)
    else:
        status = [
            'CE', f'Wrong language choice.\nOnly c_cpp and python supported\nYour choice {language}']
    return status


def get_information(data: dict):
    try:
        code = data['code']
        language = data['language']
        time_limit = data['time_limit']
        input_list = data['input_list']
        output_list = data['output_list']
        return code, input_list, language, output_list, time_limit, True
    except KeyError:
        pass
    return 'code', 'input_list', 'language', 'output_list', 'time_limit', False


def judge_solution(check_id, data, websocket=None):
    path = os.path.join(settings.BASE_DIR, 'static', str(check_id))
    code, input_list, language, output_list, time_limit, correct = get_information(data)
    if not correct:
        return json.dumps(data), 400
    status = compile_code(path, code, language, input_list[0])
    if status[0] == 'CE':
        overall_status = [*status, 'Compilation Error']
    else:
        overall_status = check_test_case(path, input_list, output_list, language, time_limit, websocket, check_id)
    if language == 'c_cpp':
        delete_files(path, [''])
    elif language == 'python':
        delete_files(path, ['.py'])
    return overall_status, 200


def just_output(check_id, data):
    path = os.path.join(settings.BASE_DIR, 'static', str(check_id))
    code, input_text, time_limit, language = data['code'], data[
        'input_text'], data['time_limit'], data['language']
    status, message = compile_code(path, code, language, input_text)
    if status == 'OK':
        _, output = get_output(path, input_text, language, time_limit)
    else:
        return {'output': f'{status}: {message}'}
    if not output:
        output = "Your input or code is wrong. You got TLE or RE"
    delete_files(path, [''])
    return output, 200
