from flask import Flask, Response, request, session, jsonify
from flask_cors import CORS, cross_origin
import json
import requests
import pprint
from pymongo import MongoClient
from bson import json_util
import time
import configparser

config = configparser.ConfigParser()
config.read('env.ini')

MONGO_PATH = config['MONGO']['path']
MONGO_DB = config['MONGO']['db']

client = MongoClient(MONGO_PATH)
test_flask_db = client[MONGO_DB]   # db
store = test_flask_db.store         # collection
users = test_flask_db.users

app = Flask(__name__, static_url_path='/static')
CORS(app)


def cursor_to_json(cursor):
    array = list(cursor)
    return json.dumps(array, default=json_util.default)


@app.route("/test", methods=['GET'])
def test():
    stores = store.find()
    js = cursor_to_json(stores)
    resp = Response(js, status=200, mimetype='application/json')
    return resp

@app.route("/login", methods=['POST'])
def login():
    data = request.json
    access_token = data['socialToken']['access_token']
    pprint.pprint("login request")
    pprint.pprint(data)

    url = 'https://graph.facebook.com/v2.7/me'
    payload = {'fields': 'id,name,picture,first_name,last_name', 'access_token': access_token}
    resp = requests.get(url, params = payload)
    profile = resp.json()
    profile['created_at'] = time.time()

    pprint.pprint("facebook response")
    pprint.pprint(profile)

    users.insert_one(profile)
    return Response(json.dumps(profile, default=json_util.default), status=200, mimetype='application/json')


@app.route("/login_history", methods=['GET'])
def login_history():
    pprint.pprint("loading history")
    history = users.find()
    js = cursor_to_json(history)
    return Response(js, status=200, mimetype='application/json')


if __name__ == '__main__':
    app.run(port=5000, debug=True)