import json
import os

import requests


class ConfigFileManagement:
    def __init__(self, file_path):
        self.dir = file_path
        if not os.path.isfile(self.dir):
            open(self.dir, 'w+').close()
        with open(self.dir, 'r') as config:
            try:
                self.config = json.loads(config.read())
            except json.JSONDecodeError:
                self.config = {}

    def write(self, key, value):
        self.config[key] = value
        with open(self.dir, 'w+') as config:
            config.write(json.dumps(self.config))

    def read(self, key, default=None):
        value = self.config.get(key, None)
        if value is None:
            self.write(key, default)
            return default
        return value


def link_to_json_file(path, link):
    if os.path.isfile(path):
        return path
    data = requests.get(link).json()
    with open(path, 'w+') as file:
        file.write(json.dumps(data))
    return path
