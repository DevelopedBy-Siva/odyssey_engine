from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

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

    @socket.on_error_default
    def socket_error(e):
        print(e)
        emit(
            "notification",
            {"message": "Unexpected error occurred. Try again later."},
            to=request.sid,
        )

    return app, socket


if __name__ == "__main__":
    app, socket = start()
    socket.run(app, debug=True)
