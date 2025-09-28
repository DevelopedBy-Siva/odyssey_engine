from datetime import datetime
import redis
from config import Config

app_config = Config()

class Data:
    
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
        current_stats["user_details"] = username 
        current_stats["total_games"] += 1
        current_stats["total_score"] += game_score
        current_stats["average_score"] = current_stats["total_score"] / current_stats["total_games"]
        current_stats["last_played"] = datetime.now().isoformat()
        
        # Note: games_won will be updated separately based on final rankings
        
        # Save updated stats
        redis_client.json().set(f"user_stats:{username}", "$", current_stats)
        
        # Update last_active in user data
        user_data = Data.get_user(username)
        if user_data:
            user_data["last_active"] = datetime.now().isoformat()
            redis_client.json().set(f"user:{username}", "$", user_data)
        
        return True

    @staticmethod
    def update_user_last_active(username):
        """Update user's last active time"""
        redis_client = Data.get_redis_client()
        
        # Get current user data
        user_data = Data.get_user(username)
        if user_data:
            user_data["last_active"] = datetime.now().isoformat()
            redis_client.json().set(f"user:{username}", "$", user_data)
            return True
        return False

    @staticmethod
    def update_user_stats_from_rankings(game_results):
        """Update user stats based on game final rankings"""
        redis_client = Data.get_redis_client()
        
        # game_results should be a list of players sorted by rank
        # [{"username": "player1", "rank": 1, "total_score": 95}, ...]
        
        for i, player_result in enumerate(game_results):
            username = player_result["username"]
            rank = player_result.get("rank", i + 1)
            total_score = player_result.get("total_score", 0)
            
            # Get current stats
            current_stats = Data.get_user_stats(username)
            if not current_stats:
                continue
            
            # Update basic stats
            current_stats["total_games"] += 1
            current_stats["total_score"] += total_score
            current_stats["average_score"] = current_stats["total_score"] / current_stats["total_games"]
            current_stats["last_played"] = datetime.now().isoformat()
            
            # Award win based on rank (1st place wins)
            if rank == 1:
                current_stats["games_won"] += 1
            
            # Add achievement based on rank
            if rank == 1:
                if "First Place" not in current_stats.get("achievements", []):
                    current_stats.setdefault("achievements", []).append("First Place")
            elif rank == 2:
                if "Second Place" not in current_stats.get("achievements", []):
                    current_stats.setdefault("achievements", []).append("Second Place")
            elif rank == 3:
                if "Third Place" not in current_stats.get("achievements", []):
                    current_stats.setdefault("achievements", []).append("Third Place")
            
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
                # Extract username from user_details field
                user_details = stats.get("user_details", "")
                username = user_details if isinstance(user_details, str) else key.replace("user_stats:", "")
                
                leaderboard.append({
                    "username": username,
                    "total_score": stats.get("total_score", 0),
                    "average_score": stats.get("average_score", 0.0),
                    "games_won": stats.get("games_won", 0)
                })
        
        # Sort by total score and return top users
        leaderboard.sort(key=lambda x: x["total_score"], reverse=True)
        return leaderboard[:limit]


    # Add the parameters room name, room theme, and players to be saved in Data
    @staticmethod
    def create_room(room_id, username, room_name=None, room_theme=None, max_players=4):
        """Create a new game room"""
        if not(2 <= max_players <= 4):
            max_players = 4
        
        redis_client = Data.get_redis_client()
        
        # Check if room already exists
        if redis_client.exists(f"room:{room_id}"):
            return False
            
        room = {
            "members": [username], 
            "started": False,
            "room_name": room_name or "",
            "theme": room_theme or "climate_change",
            "max_players": max_players,
            "created_at": datetime.now().isoformat(),
            "host": username
        }
        
        # Store room in Redis
        redis_client.json().set(f"room:{room_id}", "$", room)
        return True

    @staticmethod
    def join_room(room_id, username):
        """Join a room"""
        redis_client = Data.get_redis_client()
        
        # Get room data from Redis
        room = redis_client.json().get(f"room:{room_id}")
        if not room:
            return None
        
        if room.get("started", False):
            return None
        
        members = room.get("members", [])
        max_players = room.get("max_players", 4)
        
        # Allow only up to the max players defined for the room
        if len(members) < max_players and username not in members:
            members.append(username)
            room["members"] = members
            redis_client.json().set(f"room:{room_id}", "$", room)
            return True

        return False

    @staticmethod
    def exit_room(room_id, username):
        """Exit a room"""
        redis_client = Data.get_redis_client()
        
        # Get room data from Redis
        room = redis_client.json().get(f"room:{room_id}")
        if not room:
            return None
        
        if room.get("started", False):
            return None
        
        members = room.get("members", [])
        if members:
            members = [member for member in members if member != username]
            if len(members) == 0:
                # Delete room if empty
                redis_client.delete(f"room:{room_id}")
                return True
            else:
                # Update room with remaining members
                room["members"] = members
                redis_client.json().set(f"room:{room_id}", "$", room)
                return True

        return False

    @staticmethod
    def join_random_room(room_id, username):
        """Join a random available room"""
        redis_client = Data.get_redis_client()
        
        # Get all room keys
        room_keys = redis_client.keys("room:*")
        
        for room_key in room_keys:
            room = redis_client.json().get(room_key)
            if room and len(room.get("members", [])) < 4 and not room.get("started", False):
                # Found available room, join it
                members = room.get("members", [])
                if username not in members:
                    members.append(username)
                    room["members"] = members
                    redis_client.json().set(room_key, "$", room)
                    return True
        return False

    @staticmethod
    def get_rooms():
        """Get all available rooms"""
        redis_client = Data.get_redis_client()
        rooms = []
        
        # Get all room keys
        room_keys = redis_client.keys("room:*")
        
        for room_key in room_keys:
            room = redis_client.json().get(room_key)
            if room:
                members = len(room.get("members", []))
                max_players = room.get("max_players", 4)
                if not room.get("started", False) and members < max_players:
                    # Extract room_id from key (room:room_id)
                    room_id = room_key.replace("room:", "")
                    rooms.append({
                        "room_id": room_id, 
                        "room_size": members,
                        "max_players": max_players,
                        "room_name": room.get("room_name", ""),
                        "theme": room.get("theme", ""),
                        "host": room.get("host", "")
                    })
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

    @staticmethod
    def get_room_info(room_id):
        """Get detailed room information"""
        redis_client = Data.get_redis_client()
        room = redis_client.json().get(f"room:{room_id}")
        
        if not room:
            return None
        
        return {
            "room_id": room_id,
            "room_name": room.get("room_name", ""),
            "theme": room.get("theme", ""),
            "members": room.get("members", []),
            "max_players": room.get("max_players", 4),
            "started": room.get("started", False),
            "host": room.get("host", ""),
            "created_at": room.get("created_at", ""),
            "current_players": len(room.get("members", []))
        }

    @staticmethod
    def update_room_status(room_id, status):
        """Update room status"""
        redis_client = Data.get_redis_client()
        room = redis_client.json().get(f"room:{room_id}")
        
        if room:
            room["started"] = status
            redis_client.json().set(f"room:{room_id}", "$", room)
            return True
        return False

    @staticmethod
    def get_active_games():
        """Get all active games"""
        redis_client = Data.get_redis_client()
        active_games = []
        
        # Get all room keys
        room_keys = redis_client.keys("room:*")
        
        for room_key in room_keys:
            room = redis_client.json().get(room_key)
            if room and room.get("started", False):
                # Extract room_id from key (room:room_id)
                room_id = room_key.replace("room:", "")
                active_games.append({
                    "room_id": room_id,
                    "room_name": room.get("room_name", ""),
                    "theme": room.get("theme", ""),
                    "players": room.get("members", []),
                    "host": room.get("host", "")
                })
        return active_games

    @staticmethod
    def delete_room(room_id):
        """Delete a specific room"""
        redis_client = Data.get_redis_client()
        
        # Check if room exists
        if not redis_client.exists(f"room:{room_id}"):
            return False
        
        # Delete the room
        redis_client.delete(f"room:{room_id}")
        return True

    @staticmethod
    def cleanup_empty_rooms():
        """Clean up empty rooms"""
        redis_client = Data.get_redis_client()
        empty_rooms = []
        
        # Get all room keys
        room_keys = redis_client.keys("room:*")
        
        for room_key in room_keys:
            room = redis_client.json().get(room_key)
            if not room or not room.get("members") or len(room.get("members", [])) == 0:
                empty_rooms.append(room_key)
        
        # Delete empty rooms
        for room_key in empty_rooms:
            redis_client.delete(room_key)
        
        return len(empty_rooms)