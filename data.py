from flask import request


class Data:

    users = []
    rooms = {}

    @staticmethod
    def get_user(username):
        for user in Data.users:
            if username.lower().strip() in user:
                return user

    @staticmethod
    def add_user(user):
        data = dict(user)
        data["username"] = data["username"].lower().strip()
        for user in Data.users:
            if data["username"] in user:
                return False
        Data.users.append(data)
        return True

    @staticmethod
    def refresh_sid(username, sid):
        for user in Data.users:
            if username in user:
                user["sid"] = sid
                return True
        return False

    @staticmethod
    def get_sid(username):
        for user in Data.users:
            if user["username"] == username:
                sid = user["sid"]
                if not sid:
                    sid = request.sid
                    user["sid"] = sid
                return sid

    @staticmethod
    def create_room(room_id, username):
        room = {"id": room_id, "members": [username], "started": False}
        Data.rooms[room_id] = room

    @staticmethod
    def join_room(room_id, username):
        room = Data.rooms[room_id]
        if not room or not room["started"]:
            return None
        members = room.members
        if not members and len(members) < 5:
            Data.rooms[room_id].members.append(username)
            return True
        return False

    @staticmethod
    def join_random_room(room_id, username):
        for room_id in Data.rooms:
            room = Data.rooms[room_id]
            if len(room["members"]) < 4 and not room["started"]:
                Data.rooms[room_id].members.append(username)
                return True
        return False
