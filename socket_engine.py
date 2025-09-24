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
        self.socket.on_event("send-story", self.__story)

    def __connect(self):
        username = request.args.get("username")
        print(f"User '{username}' is online...")

    def __join_room(self, data):
        username = data["username"]
        room_id = data.get("room")
        option = data.get("option")

        if option == "create":
            Data.create_room(room_id, username)
            self.__game_room(username, room_id)

        elif option == "join":
            is_join = Data.join_room(room_id, username)
            if not is_join:
                self.__notify(msg="Cannot join the room")
            else:
                self.__game_room(username, room_id)
        else:
            is_join = Data.join_random_room(room_id, username)
            if is_join:
                self.__game_room(username, room_id)
            else:
                self.__notify(msg="No room free at this time")

    def __leave_room(self, data):
        username = data["username"]
        room = data.get("room")
        leave_room(room)
        send(f"{username} has left the room.", to=room)

    def __notify(self, msg):
        emit("notification", {"message": msg}, to=request.sid)

    def __game_room(self, username, room_id):
        join_room(room_id)
        emit(
            "game-room",
            {"message": f"'{username}' joined the game. Welcome!"},
            to=room_id,
            include_self=False,
        )
        emit(
            "entered-game",
            {"room_id": room_id},
            to=request.sid,
        )

    def __story(self, data):
        emit(
            "receive-story",
            {"message": data["message"], "username": data["username"]},
            to=data["room"],
            include_self=False,
        )
