from flask import Flask, request, render_template, g
from flask import make_response, redirect, url_for, abort
from sqlite3 import connect
from json import loads, dumps
import conf
import os
from db import *
from pprint import pprint

app = Flask(__name__, static_folder=conf.STATIC_FOLDER)

@app.before_request
def before_request():
  g.db = db_connect()

@app.teardown_request
def teardown_request(exception):
  if g.db: g.db.close()

#---------------------------------------------------------
# UI views
#---------------------------------------------------------

@app.route("/edit")
def edit():
  return redirect(url_for('static', filename="editor/editor.html"))

#---------------------------------------------------------
# RESTful
#---------------------------------------------------------

@app.route("/concepts", methods=['GET', 'POST'])
def get_concepts():
  try:
    if request.method == 'GET':
      data = [dict(loads(x[1]).items() + [('id', x[0])]) for x in db_get_concepts(g.db)]
      pprint(data)
      return dumps(data)
    elif request.method == 'POST':
      return dumps(dict(id=db_create_concept(g.db, request.data)))
    else:
      abort(404)
  except Exception, e:
    print "Server error: ", e
    abort(500)

@app.route("/concepts/<int:oid>", methods=['GET', 'PUT', 'DELETE'])
def get_concept(oid):
  try:
    if request.method == 'GET':
      data = db_get_concept(g.db, oid)
      return data
    elif request.method == 'PUT':
      return dumps(db_update_concept(g.db, oid, request.data))
    elif request.method == 'DELETE':
      return dumps(db_delete_concept(g.db, oid))
    else:
      abort(404)
  except Exception, e:
    print "Server error: ", e
    abort(500)

@app.route("/<path:urlpath>", methods=['GET', 'PUT', 'POST', 'DELETE'])
def index(urlpath):
  print "%s: urlpath=%s" % (request.method, urlpath)
  print request.data
  return abort(404)
