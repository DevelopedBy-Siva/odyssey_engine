from flask_socketio import emit, join_room, leave_room
from flask import request
import json
import threading
import time
import random

from data import Data
from ai_engine import AIEngine


class SocketEngine:
    def __init__(self, socket):
        self.rooms = {}
        self.socket = None
        self.socket = socket
        self.ai_engine = AIEngine()
        self.active_games = {}  # Track active game sessions
        self.__events()

    def __events(self):
        self.socket.on_event("connect", self.__connect)
        self.socket.on_event("join", self.__join_room)
        self.socket.on_event("leave", self.__leave_room)
        self.socket.on_event("send-story", self.__story)
        self.socket.on_event("rooms", self.__available_rooms)
        self.socket.on_event("delete-room", self.__delete_room)
        
        # Game flow events
        self.socket.on_event("start_game", self.__start_game)
        self.socket.on_event("submit_decision", self.__submit_decision)
        self.socket.on_event("get_game_state", self.__get_game_state)
        self.socket.on_event("end_game", self.__end_game)
        self.socket.on_event("confirm_winner_popup", self.__confirm_winner_popup)

    def __connect(self):
        username = request.args.get("username")

    def __join_room(self, data):
        username = data["username"]
        room_id = data.get("room")
        option = data.get("option")
        if option == "create":
            
            room_name = data.get("roomName")
            room_theme = data.get("roomTheme")
            max_players = data.get("maxPlayers", 4)

            # Enforce min 2 and max 4 with feedback
            if not isinstance(max_players, int) or not (2 <= max_players <= 4):
                self.__notify(msg="Player count must be between 2 and 4")
                return
            
            Data.create_room(room_id, username, room_name, room_theme, max_players)
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
        message = data.get("message")
        leave_room(room)
        Data.exit_room(room, username)
        self.__notify(message, id=room)
        self.__available_rooms({}, True)

    def __notify(self, msg, id=None):
        if not id:
            id = request.sid
        emit("notification", {"message": msg}, to=id)

    def __game_room(self, username, room_id):
        join_room(room_id)
        
        # Get room info for navigation
        room_info = Data.get_room_info(room_id)
        
        emit(
            "game-room",
            {"message": f"'{username}' joined the game."},
            to=room_id,
            include_self=False,
        )
        # Send a separate event to the current user for their own join confirmation
        emit(
            "room-joined",
            {"message": f"Successfully joined room {room_id}"},
            to=request.sid,
        )
        emit(
            "navigate-to-room",
            {
                "room": room_id,
                "room_name": room_info.get("room_name", "") if room_info else "",
                "room_theme": room_info.get("theme", {}) if room_info else {},
                "room_players": room_info.get("max_players", 4) if room_info else 4,
                "option": "create" if username == room_info.get("host", "") else "join"
            },
            to=request.sid,
        )
        emit(
            "entered-game",
            {"room_id": room_id},
            to=request.sid,
        )
        self.__available_rooms({}, True)

    def __story(self, data):
        emit(
            "receive-story",
            {"message": data["message"], "username": data["username"]},
            to=data["room"],
            include_self=False,
        )

    def __available_rooms(self, _, broadcast=False):
        rooms = Data.get_rooms()
        emit("available-rooms", {"rooms": rooms}, to=request.sid, broadcast=broadcast)

    def __delete_room(self, data):
        """Delete a room"""
        room_id = data.get("room")
        username = request.args.get("username")
        
        if not room_id or not username:
            self.__notify("Invalid delete request")
            return
        
        # Check if room exists and user is the host
        room_info = Data.get_room_info(room_id)
        if not room_info:
            self.__notify("Room not found")
            return
        
        if room_info.get("host") != username:
            self.__notify("Only the host can delete the room")
            return
        
        # Check if game is already started
        if room_info.get("started", False):
            self.__notify("Cannot delete room while game is in progress")
            return
        
        # Delete the room
        success = Data.delete_room(room_id)
        if success:
            # Notify all room members that room was deleted
            for member in room_info.get("members", []):
                emit("room_deleted", {
                    "message": f"Room {room_id} has been deleted by the host"
                }, to=member)
            
            # Update available rooms for all users
            self.__available_rooms({}, True)
            self.__notify("Room deleted successfully")
        else:
            self.__notify("Failed to delete room")

    def __start_game(self, data):
        """Start a new game session with AI"""
        room_id = data.get("room_id")
        username = data.get("username")
        
        if not room_id or not username:
            self.__notify("Invalid game start request")
            return
        
        # Check if user is in the room
        room = Data.get_room_info(room_id)
        if not room or username not in room["members"]:
            self.__notify("You are not in this room")
            return
        
        # Check if game can start (2-4 players)
        if len(room["members"]) < 2:
            self.__notify("Need at least 2 players to start game")
            return
        
        if room.get("started", False):
            self.__notify("Game already started")
            return
        
        # Initialize game with AI
        try:
            game_data = self.ai_engine.generate_initial_scenario_and_roles(
                theme=room.get("theme", "climate_change"),
                player_count=len(room["members"])
            )
            
            if "error" in game_data:
                self.__notify(f"Failed to start game: {game_data['error']}")
                return
            
            # Create game session
            game_session = {
                "room_id": room_id,
                "theme": room.get("theme", "climate_change"),
                "players": room["members"],
                "roles": game_data.get("roles", {}),
                "scenario": game_data.get("scenario", ""),
                "crisis_score": game_data.get("initial_crisis_score", 50),
                "current_round": 1,
                "max_rounds": 3,
                "game_state": "waiting_for_decisions",
                "player_decisions": {},
                "game_history": [],
                "started_at": time.time(),
                # Individual score tracking
                "player_total_scores": {player: 0 for player in room["members"]},
                "player_round_scores": {player: [] for player in room["members"]}
            }
            
            # Randomly assign roles to players
            player_roles = {}
            available_roles = list(game_data.get("roles", {}).keys())
            random.shuffle(available_roles)  # Shuffle roles randomly
            
            for i, player in enumerate(room["members"]):
                if i < len(available_roles):
                    role_key = available_roles[i]
                    if role_key in game_data.get("roles", {}):
                        player_roles[player] = game_data["roles"][role_key]
            
            game_session["player_roles"] = player_roles
            self.active_games[room_id] = game_session
            
            # Mark room as started
            Data.update_room_status(room_id, True)
            
            # Send immediate notification to all players that game is starting
            emit("game_starting", {
                "message": "🚀 Game is starting... AI is generating scenario..."
            }, to=room_id)
            
            # Send game start to all players
            emit("game_started", {
                "scenario": game_data.get("scenario", ""),
                "time_pressure": game_data.get("time_pressure", ""),
                "stakeholders": game_data.get("stakeholders", ""),
                "resources": game_data.get("resources", ""),
                "challenges": game_data.get("challenges", ""),
                "crisis_score": game_data.get("initial_crisis_score", 50),
                "roles": player_roles,
                "next_decision_point": game_data.get("next_decision_point", ""),
                "round": 1,
                "decision_time_limit": 60
            }, to=room_id)
            
            # Start timer for first round
            self.__start_decision_timer(room_id)
            # Emit decision timer started event to enable typing for all players
            emit("decision_timer_started", {
                "time_limit": 120,
                "message": "You have 2 minutes to submit your decision"
            }, to=room_id)
            
        except Exception as e:
            self.__notify("Failed to start game")

    def __submit_decision(self, data):
        """Handle player decision submission"""
        room_id = data.get("room_id")
        username = data.get("username")
        decision = data.get("decision")
        
        if not room_id or not username or not decision:
            self.__notify("Invalid decision submission")
            return
        
        game_session = self.active_games.get(room_id)
        if not game_session:
            self.__notify("No active game in this room")
            return
        
        if username not in game_session["players"]:
            self.__notify("You are not part of this game")
            return
        
        # Store player decision
        game_session["player_decisions"][username] = decision
        
        # Notify other players
        emit("player_decision_submitted", {
            "username": username,
            "decision": decision,
            "remaining_players": len(game_session["players"]) - len(game_session["player_decisions"])
        }, to=room_id, include_self=False)
        
        # Check if all players have submitted decisions
        submitted_count = len(game_session["player_decisions"])
        total_players = len(game_session["players"])
        
        if submitted_count == total_players:
            # Process all decisions with AI
            self.__process_round(room_id)
        else:
            # Check if we should add timeout decisions for missing players
            # Only do this if it's been a while since the round started
            import time
            current_time = time.time()
            round_start_time = game_session.get("round_start_time", current_time)
            
            # If more than 2.5 minutes have passed, add timeout decisions
            if current_time - round_start_time > 150:  # 2.5 minutes
                missing_players = []
                for player in game_session["players"]:
                    if player not in game_session["player_decisions"]:
                        missing_players.append(player)
                        game_session["player_decisions"][player] = "No response provided - timeout"
                
                if missing_players:
                    # Notify about timeout
                    emit("timeout_notification", {
                        "message": f"⏰ Time's up! {len(missing_players)} player(s) didn't respond in time.",
                        "missing_players": missing_players,
                        "timeout_count": len(missing_players)
                    }, to=room_id)
                    
                    # Process round with timeout decisions
                    self.__process_round(room_id)


    def __process_round(self, room_id):
        """Process a complete round with AI"""
        game_session = self.active_games.get(room_id)
        if not game_session:
            return
        
        try:
            # Score individual responses with detailed criteria
            individual_scores = {}
            round_scores = {}
            
            for username, decision in game_session["player_decisions"].items():
                role = game_session["player_roles"].get(username, {})
                score_result = self.ai_engine.score_individual_response(
                    theme=game_session["theme"],
                    player_response=decision,
                    role=role.get("role_name", "Player"),
                    round_number=game_session["current_round"]
                )
                
                if "error" not in score_result:
                    # Extract individual criteria scores
                    creativity = score_result.get("creativity_score", 0)
                    helping_nature = score_result.get("helping_nature_score", 0)
                    team_strategy = score_result.get("team_strategy_score", 0)
                    role_appropriateness = score_result.get("role_appropriateness_score", 0)
                    total_round_score = score_result.get("total_individual_score", 0)
                    
                    # Store detailed scores
                    individual_scores[username] = score_result
                    round_scores[username] = {
                        "creativity": creativity,
                        "helping_nature": helping_nature,
                        "team_strategy": team_strategy,
                        "role_appropriateness": role_appropriateness,
                        "total_round_score": total_round_score,
                        "round": game_session["current_round"]
                    }
                    
                    # Update player's total score
                    game_session["player_total_scores"][username] += total_round_score
                    game_session["player_round_scores"][username].append(round_scores[username])
                else:
                    # Use default scores if AI fails
                    round_scores[username] = {
                        "creativity": 0,
                        "helping_nature": 0,
                        "team_strategy": 0,
                        "role_appropriateness": 0,
                        "total_round_score": 0,
                        "round": game_session["current_round"]
                    }
            
            # Notify all players that AI analysis is starting
            try:
                emit("ai_analysis_started", {
                    "message": "🤖 AI is analyzing your responses and creating the next scenario..."
                }, to=room_id)
            except Exception as e:
                pass
            
            # Update crisis score with error handling and timeout
            try:
                crisis_update = self.ai_engine.update_crisis_score(
                    theme=game_session["theme"],
                    current_crisis_score=game_session["crisis_score"],
                    all_player_responses=game_session["player_decisions"],
                    round_number=game_session["current_round"]
                )
            except Exception as e:
                # Fallback: keep current crisis score
                crisis_update = {
                    "new_crisis_score": game_session["crisis_score"], 
                    "score_change": 0,
                    "reasoning": "AI analysis unavailable - maintaining current crisis level"
                }
            
            # Generate story continuation with error handling
            try:
                story_continuation = self.ai_engine.generate_story_continuation(
                    theme=game_session["theme"],
                    current_scenario=game_session["scenario"],
                    crisis_score=game_session["crisis_score"],
                    all_responses=game_session["player_decisions"],
                    round_number=game_session["current_round"]
                )
                
                # Check if AI returned an error
                if isinstance(story_continuation, dict) and "error" in story_continuation:
                    # Use fallback content
                    story_continuation = {
                        "story_continuation": f"The team's decisions in Round {game_session['current_round']} have been noted. The situation continues to evolve...",
                        "next_decision_point": "What should the team do next? Consider the current crisis level and work together to find solutions."
                    }
                
            except Exception as e:
                # Fallback: provide basic story continuation
                story_continuation = {
                    "story_continuation": f"The team's decisions in Round {game_session['current_round']} have been noted. The situation continues to evolve...",
                    "next_decision_point": "What should the team do next? Consider the current crisis level and work together to find solutions."
                }
            
            # Notify all players that AI analysis is complete
            try:
                emit("ai_analysis_completed", {
                    "message": "✅ AI analysis complete! Preparing next round..."
                }, to=room_id)
            except Exception as e:
                pass
            
            # Update game state
            game_session["crisis_score"] = crisis_update.get("new_crisis_score", game_session["crisis_score"])
            game_session["scenario"] = story_continuation.get("story_continuation", game_session["scenario"])
            game_session["current_round"] += 1
            
            # Add to history with detailed scoring
            game_session["game_history"].append({
                "round": game_session["current_round"] - 1,
                "decisions": game_session["player_decisions"].copy(),
                "individual_scores": individual_scores,
                "round_scores": round_scores,
                "crisis_update": crisis_update,
                "story_continuation": story_continuation,
                "player_total_scores": game_session["player_total_scores"].copy()
            })
            
            # Check if game should end
            if (game_session["crisis_score"] >= 80 or 
                game_session["crisis_score"] <= 20 or 
                game_session["current_round"] > game_session["max_rounds"]):
                self.__end_game_automatically(room_id)
                return
            
            # Send round results to all players with detailed scoring
            try:
                round_data = {
                    "round": game_session["current_round"] - 1,
                    "individual_scores": individual_scores,
                    "round_scores": round_scores,
                    "player_total_scores": game_session["player_total_scores"],
                    "crisis_score": game_session["crisis_score"],
                    "score_change": crisis_update.get("score_change", 0),
                    "story_continuation": story_continuation.get("story_continuation", ""),
                    "new_challenges": story_continuation.get("new_challenges", ""),
                    "next_decision_point": story_continuation.get("next_decision_point", ""),
                    "team_collaboration": crisis_update.get("team_collaboration", ""),
                    "reasoning": crisis_update.get("reasoning", "")
                }
                # Ensure we have content for story continuation and next decision point
                if not round_data['story_continuation'] or round_data['story_continuation'].strip() == "":
                    round_data['story_continuation'] = f"The team's decisions in Round {game_session['current_round']} have been noted. The situation continues to evolve..."
                
                if not round_data['next_decision_point'] or round_data['next_decision_point'].strip() == "":
                    round_data['next_decision_point'] = "What should the team do next? Consider the current crisis level and work together to find solutions."
                
                emit("round_completed", round_data, to=room_id)
            except Exception as e:
                pass
            
            # Reset for next round
            game_session["player_decisions"] = {}
            game_session["game_state"] = "waiting_for_decisions"
            
            # Start timer for next round if game continues
            if game_session["current_round"] <= game_session["max_rounds"]:
                self.__start_decision_timer(room_id)
                # Add a small delay to let the frontend process the round_completed messages first
                import time
                time.sleep(0.5)  # 500ms delay
                
                # Emit decision timer started event to enable typing for all players
                try:
                    emit("decision_timer_started", {
                        "time_limit": 120,
                        "message": "You have 2 minutes to submit your decision"
                    }, to=room_id)
                except Exception as e:
                    pass
            
        except Exception as e:
            pass

    def __start_decision_timer(self, room_id):
        """Start decision phase - frontend handles timer"""
        import time
        if room_id in self.active_games:
            game_session = self.active_games[room_id]
            game_session["game_state"] = "waiting_for_decisions"
            game_session["round_start_time"] = time.time()  # Track when round started
        
        # Notify players about timer
        emit("decision_timer_started", {
            "time_limit": 120,
            "message": "You have 2 minutes to submit your decision"
        }, to=room_id)

    def __end_game_automatically(self, room_id):
        """End game automatically based on conditions"""
        game_session = self.active_games.get(room_id)
        if not game_session:
            return
        
        try:
            # Calculate final scores
            final_scores = self.ai_engine.calculate_final_game_scores(
                theme=game_session["theme"],
                all_rounds_data=game_session["game_history"],
                final_crisis_score=game_session["crisis_score"]
            )
            
            # Update user stats based on accumulated individual scores
            player_rankings = []
            for username in game_session["players"]:
                total_score = game_session["player_total_scores"].get(username, 0)
                round_scores = game_session["player_round_scores"].get(username, [])
                
                # Calculate average scores across all criteria
                total_creativity = sum(round.get("creativity", 0) for round in round_scores)
                total_helping_nature = sum(round.get("helping_nature", 0) for round in round_scores)
                total_team_strategy = sum(round.get("team_strategy", 0) for round in round_scores)
                total_role_appropriateness = sum(round.get("role_appropriateness", 0) for round in round_scores)
                
                player_rankings.append({
                    "username": username,
                    "total_score": total_score,
                    "creativity_total": total_creativity,
                    "helping_nature_total": total_helping_nature,
                    "team_strategy_total": total_team_strategy,
                    "role_appropriateness_total": total_role_appropriateness,
                    "round_scores": round_scores
                })
            
            # Sort players by total_score to determine rankings
            player_rankings.sort(key=lambda x: x["total_score"], reverse=True)
            
            # Assign numeric ranks
            for i, player in enumerate(player_rankings):
                player["rank"] = i + 1
            
            # Update stats based on rankings
            Data.update_user_stats_from_rankings(player_rankings)
            
            # Prepare player scores data for frontend
            player_scores = {}
            for player in player_rankings:
                player_scores[player["username"]] = {
                    "total_score": player["total_score"],
                    "rank": player["rank"],
                    "round_scores": player.get("round_scores", [])
                }
            
            # Send final results with rankings and winner popup
            emit("game_ended", {
                "final_scores": final_scores,
                "player_rankings": player_rankings,
                "player_scores": player_scores,
                "game_summary": final_scores.get("game_summary", ""),
                "crisis_outcome": final_scores.get("crisis_outcome", ""),
                "final_crisis_score": game_session["crisis_score"],
                "team_highlights": final_scores.get("team_highlights", ""),
                "learning_points": final_scores.get("learning_points", ""),
                "winner": player_rankings[0]["username"] if player_rankings else None,
                "show_winner_popup": True,
                "auto_exit_after_popup": True
            }, to=room_id)
            
            # Schedule auto-exit after 10 seconds (time for players to see popup)
            import threading
            def auto_exit():
                import time
                time.sleep(10)  # Wait 10 seconds for popup
                for player in game_session["players"]:
                    try:
                        Data.exit_room(room_id, player)
                        emit("notification", {
                            "message": "Game ended. You have been automatically removed from the room."
                        }, to=player)
                    except:
                        pass
                # Clean up room if empty
                Data.cleanup_empty_rooms()
            
            exit_thread = threading.Thread(target=auto_exit)
            exit_thread.daemon = True
            exit_thread.start()
            
            # Clean up
            del self.active_games[room_id]
            Data.update_room_status(room_id, False)
            
        except Exception as e:
            self.__notify("Error ending game", id=room_id)

    def __get_game_state(self, data):
        """Get current game state"""
        room_id = data.get("room_id")
        username = data.get("username")
        
        if not room_id or not username:
            self.__notify("Invalid request")
            return
        
        game_session = self.active_games.get(room_id)
        if not game_session:
            emit("game_state", {"error": "No active game"}, to=request.sid)
            return
        
        if username not in game_session["players"]:
            emit("game_state", {"error": "Not part of this game"}, to=request.sid)
            return
        
        # Send current game state
        emit("game_state", {
            "scenario": game_session["scenario"],
            "crisis_score": game_session["crisis_score"],
            "current_round": game_session["current_round"],
            "max_rounds": game_session["max_rounds"],
            "game_state": game_session["game_state"],
            "player_role": game_session["player_roles"].get(username, {}),
            "remaining_decisions": len(game_session["players"]) - len(game_session["player_decisions"]),
            "theme": game_session["theme"]
        }, to=request.sid)

    def __end_game(self, data):
        """Manually end game"""
        room_id = data.get("room_id")
        username = data.get("username")
        
        if not room_id or not username:
            self.__notify("Invalid request")
            return
        
        game_session = self.active_games.get(room_id)
        if not game_session:
            self.__notify("No active game")
            return
        
        # Only host can end game
        if username != game_session["players"][0]:
            self.__notify("Only host can end game")
            return
        
        # End game manually
        self.__end_game_automatically(room_id)
    
    def __confirm_winner_popup(self, data):
        """Player confirms they've seen the winner popup"""
        username = data.get("username")
        room_id = data.get("room_id")
        
        # Just acknowledge - the auto-exit will handle the rest
        emit("winner_popup_confirmed", {
            "message": "Thank you for playing! You will be automatically removed from the room."
        }, to=request.sid)