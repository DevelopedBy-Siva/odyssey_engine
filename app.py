from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from socket_engine import SocketEngine
from api import Api


def start():
    app = Flask(__name__)
    CORS(app)
    # Api calls
    Api(app)

    # Socket calls
    socket = SocketIO(app, cors_allowed_origins="*")
    SocketEngine(socket)

    return app, socket


if __name__ == "__main__":
    app, socket = start()
    socket.run(app, debug=True)
