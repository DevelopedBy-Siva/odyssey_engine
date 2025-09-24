from flask_socketio import join_room, leave_room, send, emit
from flask import request

from data import Data


class SocketEngine:
    def __init__(self, socket):
        self.rooms = {}
        self.socket = socket
        self.__events()

    def __events(self):
        self.socket.on_event("connect", self.__connect)
        self.socket.on_event("join", self.__join_room)
        self.socket.on_event("leave", self.__leave_room)

    def __connect(self):
        username = request.args.get("username")
        Data.refresh_sid(username, request.sid)
        print(f"User {username} joined...")

    def __join_room(self, data):
        username = data["username"]
        room_id = data.get("room")
        option = data.get("option")

        sid = Data.get_sid(username)
        if option == "create":
            Data.add_user(room_id, username)
            emit(
                "join-room",
                {"status": "SUCCESS", "message": "New room created"},
                to=sid,
            )
        elif option == "join":
            is_join = Data.join_room(room_id, username)
            if is_join == None:
                emit(
                    "join-room",
                    {"status": "NOT_EXIST", "message": "Room doesn't exist"},
                    to=sid,
                )
            elif not is_join:
                emit(
                    "join-room",
                    {"status": "CANNOT_JOIN", "message": "Cannot join the room"},
                    to=sid,
                )
            else:
                emit(
                    "join-room",
                    {"status": "JOINED", "message": "Joined the room"},
                    to=sid,
                )

        else:
            is_join = Data.join_random_room(room_id, username)
            if is_join:
                emit(
                    "join-room",
                    {"status": "JOINED", "message": "Joined the room"},
                    to=sid,
                )
            else:
                emit(
                    "join-room",
                    {"status": "CANNOT_FIND", "message": "No room free at this time"},
                    to=sid,
                )

    def __leave_room(self, data):
        username = data["username"]
        room = data.get("room")
        leave_room(room)
        send(f"{username} has left the room.", to=room)
