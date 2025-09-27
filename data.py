from datetime import datetime
import redis
import json
from config import Config

app_config = Config()

class Data:
    users = []
    rooms = {}
    
    @staticmethod
    def get_redis_client():
        return redis.Redis(
            host=app_config.REDIS_HOST,
            port=app_config.REDIS_PORT,
            db=app_config.REDIS_DB,
            username=app_config.REDIS_USERNAME,
            password=app_config.REDIS_PASSWORD,
            decode_responses=True
        )

    @staticmethod
    def get_user(username):
        redis_client = Data.get_redis_client()
        user_data = redis_client.json().get(f"user:{username}")
        return user_data
        # for user in Data.users:
        #     if username.lower().strip() in user:
        #         return user
        # return None

    @staticmethod
    def get_user_stats(username):
        """Get user stats"""
        redis_client = Data.get_redis_client()
        user_stats = redis_client.json().get(f"user_stats:{username}")
        return user_stats

    @staticmethod
    def add_user(username):
        """Add new user with basic data and stats"""
        current_time = datetime.now().isoformat()
        
        # Check if user already exists
        if Data.get_user(username):
            return False
        
        # Create user data
        user_data = {
            "user_details": username,
            "created_at": current_time,
            "last_active": current_time
        }
        user_stats = {
            "user_details": username,
            "total_score": 0,
            "total_games": 0,
            "average_score": 0.0,
            "games_won": 0,
            "last_played": None,
            "achievements": []
        }
        
        #Store in Redis
        redis_client = Data.get_redis_client()
        redis_client.json().set(f"user:{username}", "$", user_data)
        redis_client.json().set(f"user_stats:{username}", "$", user_stats)
        
        return True

    @staticmethod
    def update_user_stats(username, game_score):
        """Update user stats after game completion"""
        redis_client = Data.get_redis_client()
        
        # Get current stats
        current_stats = Data.get_user_stats(username)
        if not current_stats:
            return False
        
        # Update stats
        current_stats["user_details"] = username  # Store user details
        current_stats["total_games"] += 1
        current_stats["total_score"] += game_score
        current_stats["average_score"] = current_stats["total_score"] / current_stats["total_games"]
        current_stats["last_played"] = datetime.now().isoformat()
        
        if game_score >= 80:
            current_stats["games_won"] += 1
        
        # Save updated stats
        redis_client.json().set(f"user_stats:{username}", "$", current_stats)
        
        # Update last_active in user data
        user_data = Data.get_user(username)
        if user_data:
            user_data["last_active"] = datetime.now().isoformat()
            redis_client.json().set(f"user:{username}", "$", user_data)
        
        return True
    

    @staticmethod
    def get_leaderboard(limit=10):
        """Get top users by total score"""
        redis_client = Data.get_redis_client()
        
        # Get all user stats
        keys = redis_client.keys("user_stats:*")
        leaderboard = []
        
        for key in keys:
            stats = redis_client.json().get(key)
            if stats:
                leaderboard.append({
                    "username": stats["username"],
                    "total_score": stats["total_score"],
                    "average_score": stats["average_score"],
                    "games_won": stats["games_won"]
                })
        
        # Sort by total score and return top users
        leaderboard.sort(key=lambda x: x["total_score"], reverse=True)
        return leaderboard[:limit]

    @staticmethod
    def create_room(room_id, username):
        """Create a new game room"""
        room = {"members": [username], "started": False}
        Data.rooms[room_id] = room

    @staticmethod
    def join_room(room_id, username):
        # room = Data.rooms.get(room_id)
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
        # room = Data.rooms.get(room_id)
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
    
    @staticmethod
    def get_all_users_rankings():
        """Get rankings of all users with their stats and last active time"""
        redis_client = Data.get_redis_client()
        all_users = []
        
        # Get all users from redis storage
        stats_keys = redis_client.keys("user_stats:*")
    
        for stats_key in stats_keys:
            # Extract username from key (user_stats:username)
            username = stats_key.replace("user_stats:", "")
            
            # Get user stats
            user_stats = redis_client.json().get(stats_key)
            if user_stats:
                # Get user data for last_active
                user_data = redis_client.json().get(f"user:{username}")
                last_active = user_data.get("last_active") if user_data else None
                
                # Extract username from user_details
                user_details = user_stats.get("user_details", username)
                if isinstance(user_details, dict) and "username" in user_details:
                    actual_username = user_details["username"]
                else:
                    actual_username = user_details if user_details else username
                
                user_info = {
                    "username": actual_username,
                    "total_score": user_stats.get("total_score", 0),
                    "total_games": user_stats.get("total_games", 0),
                    "average_score": user_stats.get("average_score", 0.0),
                    "games_won": user_stats.get("games_won", 0),
                    "last_played": user_stats.get("last_played"),
                    "achievements": user_stats.get("achievements", []),
                    "lastActive": last_active
                }
                all_users.append(user_info)
        
        # Sort by total_score in descending order
        all_users.sort(key=lambda x: x["total_score"], reverse=True)
        
        return all_users
