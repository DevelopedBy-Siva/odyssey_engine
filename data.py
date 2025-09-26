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
    def create_room(room_id, username):
        room = {"members": [username], "started": False}
        Data.rooms[room_id] = room

    @staticmethod
    def join_room(room_id, username):
        room = Data.rooms[room_id]
        if not room or room["started"]:
            return None
        members = room["members"]
        if len(members) < 4:
            Data.rooms[room_id]["members"].append(username)
            return True

        return False

    @staticmethod
    def exit_room(room_id, username):
        room = Data.rooms[room_id]
        if not room or room["started"]:
            return None
        members = room["members"]
        if members:
            members = [member for member in members if member != username]
            if len(members) == 0:
                del Data.rooms[room_id]
                return True
            Data.rooms[room_id]["members"] = members
            return True

        return False

    @staticmethod
    def join_random_room(room_id, username):
        for room_id in Data.rooms:
            room = Data.rooms[room_id]
            if len(room["members"]) < 4 and not room["started"]:
                Data.rooms[room_id]["members"].append(username)
                return True
        return False

    @staticmethod
    def get_rooms():
        rooms = []
        for room in Data.rooms:
            members = len(Data.rooms[room]["members"])
            if not Data.rooms[room]["started"] and members < 4:
                rooms.append({"room_id": room, "room_size": members})
        return rooms
