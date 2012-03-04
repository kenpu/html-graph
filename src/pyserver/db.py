from sqlite3 import connect
import os, conf

def db_setup(db):
  c = db.cursor()
  c.execute("""
    create table Concept (
      id integer primary key autoincrement,
      json text
    )
  """)
  db.commit()

def db_connect():
  if os.path.exists(conf.DB_FILE):
    db = connect(conf.DB_FILE)
  else:
    db = connect(conf.DB_FILE)
    db_setup(db)
  return db  

def db_get_concepts(db):
  c = db.cursor()
  c.execute("select oid, json from Concept");
  return c.fetchall()

def db_get_concept(db, oid):
  c = db.cursor()
  c.execute("select json from Concept where id = ?", [oid])
  try:
    return c.fetchone([0])
  except:
    raise Exception("Not Found")

def db_create_concept(db, data):
  c = db.cursor()
  c.execute("insert into Concept(json) values (?)", [data])
  db.commit()
  return c.lastrowid

def db_update_concept(db, oid, data):
  c = db.cursor()
  c.execute("update Concept set json = ? where oid = ?", [data, oid])
  db.commit()
  return {'updated': '3/3/2012'}

def db_delete_concept(db, oid):
  c = db.cursor()
  c.execute("delete from Concept where oid = ?", [oid])
  db.commit()
  return {'updated': '3/3/2012'}
