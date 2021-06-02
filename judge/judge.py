import os


def create_files(path, files_with_text):
    for name, text in files_with_text:
        with open(f'{os.path.join(path, name)}', 'w+') as new_file:
            new_file.write(str(text))
        os.chmod(f'{os.path.join(path, name)}', 0o755)


def delete_files(path, file_names):
    for name in file_names:
        if os.path.exists(os.path.join(path, name)):
            os.remove(os.path.join(path, name))


def compile_code_cpp(path, code):
    if os.path.exists(path):
        return 'OK', None
    create_files(path, zip(['.cpp', '_err.txt'], [code, '']))
    if os.system(f'g++ {path}.cpp -o {path} 2> {path}_err.txt') != 0:
        with open(f'{path}_err.txt', 'r') as file_err:
            errors = file_err.read()
        delete_files(path, ['.cpp', '_err.txt'])
        return 'CE', '\n'.join(errors.split('\n')[1:4])
    delete_files(path, ['.cpp', '_err.txt'])
    return 'OK', None


def compile_code_python(path, code, sample):
    if os.path.exists(path):
        return 'OK', None
    create_files(path, zip(['.py', '_in.txt', '_err.txt'], [code, sample, '']))
    stat = os.system(f'timeout {2} python3 {path}.py < {path}_in.txt 2> {path}_err.txt')
    if stat != 0:
        with open(f'{path}_err.txt', 'r') as file_err:
            errors = file_err.read()
        delete_files(path, ['_err.txt', '_in.txt'])
        return 'CE', f"Error Code: {stat}\n" + '\n'.join(errors.split('\n')[1:4])
    delete_files(path, ['_err.txt', '_in.txt'])
    return 'OK', None


def compile_code(path, code, language, sample=None):
    if language == 'c_cpp':
        return compile_code_cpp(path, code)
    if language == 'python':
        if sample:
            return compile_code_python(path, code, sample)
        return 'OK', 'No sample provided'
    return 'CE', f'Wrong language choice.\nOnly c_cpp and python supported\nYour choice {language}'


def get_output(path, input_txt, language, time_limit=1):
    create_files(path, zip(['_in.txt', '_out.txt'], [input_txt, '']))
    cid = path.split('/')[-1]
    bf_cid = '/'.join(path.split('/')[:-1]) + '/'
    if language == 'c_cpp':
        cr = os.system(f'timeout {time_limit} {bf_cid}./{cid} < {path}_in.txt > {path}_out.txt')
    else:
        cr = os.system(f'timeout {int(time_limit) + 1} python3 {path}.py < {path}_in.txt > {path}_out.txt')
    if cr != 0:
        delete_files(path, ['_in.txt', '_out.txt'])
        return 'TLE', None
    with open(f'{path}_out.txt') as file_out:
        output = file_out.read().strip()
    delete_files(path, ['_in.txt', '_out.txt'])
    return 'OK', output
