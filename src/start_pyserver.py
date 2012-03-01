from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from pyserver import app
import sys

server = HTTPServer(WSGIContainer(app))
server.listen(1234)
IOLoop.instance().start()
