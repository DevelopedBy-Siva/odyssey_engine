from flask import request, jsonify

from data import Data


class Api:

    def __init__(self, app):
        self.app = app
        self.run()

    def run(self):

        @self.app.route("/login", methods=["POST"])
        def login():
            json = request.get_json()
            user = Data.get_user(json["username"])  # TODO: replace this with DB
            is_exist = True
            if not user:
                Data.add_user(json)
                is_exist = False
            return jsonify({"message": "Login successful", "is_exist": is_exist}), 200
