from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask import jsonify
from data import Data
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
        emit(
            "notification",
            {"message": "Unexpected error occurred. Try again later."},
            to=request.sid,
        )

    return app, socket


# Create the app instance for Flask to find
app, socket = start()

if __name__ == "__main__":
    socket.run(app, debug=True)