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
            if not user:
                Data.add_user(json)
            return jsonify({"message": "Login successful"}), 200
