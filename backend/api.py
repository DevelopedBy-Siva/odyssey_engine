from flask import request, jsonify
import json
from datetime import datetime

from data import Data


class Api:

    def __init__(self, app):
        self.app = app
        self.run()

    def run(self):

        @self.app.route("/login", methods=["POST"])
        def login():
            """User login/registration endpoint"""
            try:
                data = request.get_json()
                if not data or "username" not in data:
                    return jsonify({
                        "success": False,
                        "error": "Username is required"
                    }), 400
                
                username = data["username"].strip()
                if not username:
                    return jsonify({
                        "success": False,
                        "error": "Username cannot be empty"
                    }), 400
                
                user = Data.get_user(username)
                is_exist = True
                if not user:
                    Data.add_user(username)
                    is_exist = False
                
                return jsonify({
                    "success": True,
                    "message": "Login successful",
                    "is_exist": is_exist,
                    "username": username
                }), 200
                
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": f"Login failed: {str(e)}"
                }), 500

        @self.app.route("/logout", methods=["POST"])
        def logout():
            """User logout endpoint"""
            try:
                data = request.get_json()
                if not data or "username" not in data:
                    return jsonify({
                        "success": False,
                        "error": "Username is required"
                    }), 400
                
                username = data["username"].strip()
                if not username:
                    return jsonify({
                        "success": False,
                        "error": "Username cannot be empty"
                    }), 400
                
                # Update user's last active time
                Data.update_user_last_active(username)
                
                return jsonify({
                    "success": True,
                    "message": "Logout successful",
                    "username": username
                }), 200
                
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": f"Logout failed: {str(e)}"
                }), 500

        @self.app.route('/api/rankings', methods=['GET'])
        def get_rankings():
            """Get all users rankings from Redis"""
            try:
                rankings = Data.get_all_users_rankings()
                return jsonify({
                    "success": True,
                    "data": rankings,
                    "total_users": len(rankings)
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": str(e)
                }), 500

        @self.app.route('/api/user/<username>', methods=['GET'])
        def get_user_profile(username):
            """Get user profile and stats"""
            try:
                user_data = Data.get_user(username)
                user_stats = Data.get_user_stats(username)
                
                if not user_data:
                    return jsonify({
                        "success": False,
                        "error": "User not found"
                    }), 404
                
                return jsonify({
                    "success": True,
                    "user_data": user_data,
                    "user_stats": user_stats
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": str(e)
                }), 500

        @self.app.route('/api/rooms', methods=['GET'])
        def get_available_rooms():
            """Get all available rooms"""
            try:
                rooms = Data.get_rooms()
                return jsonify({
                    "success": True,
                    "rooms": rooms,
                    "total_rooms": len(rooms)
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": str(e)
                }), 500

        @self.app.route('/api/rooms/<room_id>', methods=['GET'])
        def get_room_info(room_id):
            """Get specific room information"""
            try:
                room_info = Data.get_room_info(room_id)
                if not room_info:
                    return jsonify({
                        "success": False,
                        "error": "Room not found"
                    }), 404
                
                return jsonify({
                    "success": True,
                    "room_info": room_info
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": str(e)
                }), 500

        @self.app.route('/api/active-games', methods=['GET'])
        def get_active_games():
            """Get all active games"""
            try:
                active_games = Data.get_active_games()
                return jsonify({
                    "success": True,
                    "active_games": active_games,
                    "total_active": len(active_games)
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": str(e)
                }), 500

        @self.app.route('/api/leaderboard', methods=['GET'])
        def get_leaderboard():
            """Get leaderboard with optional limit"""
            try:
                limit = request.args.get('limit', 10, type=int)
                if limit < 1 or limit > 100:
                    limit = 10
                
                leaderboard = Data.get_leaderboard(limit)
                return jsonify({
                    "success": True,
                    "leaderboard": leaderboard,
                    "limit": limit
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": str(e)
                }), 500

        @self.app.route('/api/health', methods=['GET'])
        def health_check():
            """Health check endpoint"""
            try:
                # Test Redis connection
                redis_client = Data.get_redis_client()
                redis_client.ping()
                
                return jsonify({
                    "success": True,
                    "status": "healthy",
                    "timestamp": datetime.now().isoformat(),
                    "services": {
                        "redis": "connected",
                        "api": "running"
                    }
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "status": "unhealthy",
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                }), 500

        @self.app.route('/api/stats', methods=['GET'])
        def get_system_stats():
            """Get system statistics"""
            try:
                total_users = len(Data.get_all_users_rankings())
                total_rooms = len(Data.get_rooms())
                active_games = len(Data.get_active_games())
                
                return jsonify({
                    "success": True,
                    "stats": {
                        "total_users": total_users,
                        "total_rooms": total_rooms,
                        "active_games": active_games,
                        "timestamp": datetime.now().isoformat()
                    }
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": str(e)
                }), 500