from flask import Flask, request, render_template, g
from flask import make_response, redirect, url_for
from sqlite3 import connect
from json import loads, dumps

def db_connect():
  return None

app = Flask(__name__, static_folder="../static")

@app.before_request
def before_request():
  g.db = db_connect()

@app.teardown_request
def teardown_request(exception):
  if g.db: g.db.close()

@app.route("/edit")
def edit():
  return redirect(url_for('static', filename="editor/editor.html"))

@app.route("/<path:urlpath>")
def index(urlpath):
  print "%s: urlpath=%s" % (request.method, urlpath)
  return "okay"
