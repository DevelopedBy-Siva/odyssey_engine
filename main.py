import os
import json
import redis
import threading
import time
from mistralai.client import MistralClient

# --- CONFIG ---
MODEL = "mistral-large-latest"

REDIS_HOST = os.environ.get(
    'REDIS_HOST', 'redis-18552.c114.us-east-1-4.ec2.redns.redis-cloud.com'
)
REDIS_PORT = int(os.environ.get('REDIS_PORT', 18552))
REDIS_PASSWORD = os.environ.get(
    'REDIS_PASSWORD', 'l55AXKcgrS4UeVU3dE6waEmc39tkvyl9'
)  # Store securely in production

# --- CONNECT TO REDIS ---
try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD, decode_responses=True)
    r.ping()
    print("✅ Connected to Redis successfully!")
except redis.ConnectionError as e:
    print(f"Redis connection failed: {e}")
    print("Please ensure your Redis server is running and accessible with the provided credentials.")
    r = None

# --- MISTRAL SETUP ---
def setup_mistral_client():
    api_key = os.environ.get("MISTRAL_API_KEY")

    # if not api_key:
    #     # Only try Colab if environment variable missing
    #     try:
    #         import sys
    #         if "google.colab" in sys.modules:
    #             from google.colab import userdata
    #             api_key = userdata.get("MISTRAL_API_KEY")
    #     except (ImportError, AttributeError):
    #         print("⚠️ Not running in Colab or Colab secrets not set.")

    if not api_key:
        raise ValueError("MISTRAL_API_KEY not set in environment variables or Colab secrets.")

    try:
        client = MistralClient(api_key=api_key)
        print("✅ Mistral client configured successfully!")
        return client
    except Exception as e:
        print(f"Error configuring Mistral client: {e}")
        return None

# --- GAME FUNCTIONS ---
def generate_initial_scenario(client, theme):
    if not client:
        return "Error: AI client not initialized."

    system_prompt = "You are an AI Dungeon Master for a corporate crisis game."
    user_prompt = f"""
Create a detailed crisis scenario for theme: "{theme}".
It should:
- Be suitable for 2–4 corporate roles (CEO, CFO, etc.)
- End with: "What does the team decide to do?"
"""
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    try:
        chat_response = client.chat(model=MODEL, messages=messages)
        return chat_response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating scenario: {e}")
        return "Error generating scenario."

def progress_story(client, current_scenario, crisis_score, player_decisions):
    if not client:
        return {'error': 'AI client not initialized.'}

    decisions_text = "\n".join([f"- {role}: {decision}" for role, decision in player_decisions.items()])
    system_prompt = "You are an AI Dungeon Master for a crisis game. Respond ONLY with valid JSON."
    user_prompt = f"""
Current Scenario:
{current_scenario}

Crisis Score: {crisis_score}/100

Player Decisions:
{decisions_text}

Return JSON:
{{
  "story_continuation": "string",
  "crisis_score_change": "integer",
  "rationale": "string",
  "new_scenario": "string (end with 'What does the team do next?')"
}}
"""
    messages = [{"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}]
    try:
        response = client.chat(model=MODEL, messages=messages, response_format={"type": "json_object"})
        return json.loads(response.choices[0].message.content.strip())
    except Exception as e:
        print(f"Error progressing story: {e}")
        return {'error': f'Error from AI model: {e}'}

def create_game(room_name, theme, client):
    if r is None:
        print("Cannot create game: Redis client not initialized.")
        return False
    if r.exists(f"room:{room_name}"):
        print(f"Room '{room_name}' already exists.")
        return False

    scenario = generate_initial_scenario(client, theme)
    if "Error generating scenario" in scenario:
        print(f"Failed to generate initial scenario: {scenario}")
        return False

    game_data = {
        "theme": theme,
        "scenario": scenario,
        "crisis_score": 50,
        "players": json.dumps({}),
        "history": json.dumps([])
    }
    r.hset(f"room:{room_name}", mapping=game_data)
    print(f"Room '{room_name}' created with theme '{theme}'.")
    return True

def join_game(room_name, player_name):
    if r is None:
        print("Cannot join game: Redis client not initialized.")
        return False
    if not r.exists(f"room:{room_name}"):
        print(f"Room '{room_name}' does not exist.")
        return False

    room_data = r.hgetall(f"room:{room_name}")
    players = json.loads(room_data.get("players", "{}"))

    if player_name in players:
        print(f"Player '{player_name}' already in room '{room_name}'.")
        return True

    players[player_name] = {"score": 0}
    r.hset(f"room:{room_name}", "players", json.dumps(players))
    print(f"Player '{player_name}' joined room '{room_name}'.")
    return True

def get_game_state(room_name):
    if r is None:
        print("Cannot get game state: Redis client not initialized.")
        return None
    data = r.hgetall(f"room:{room_name}")
    if not data:
        return None

    if 'players' in data:
        data['players'] = json.loads(data['players'])
    if 'history' in data:
        data['history'] = json.loads(data['history'])
    if 'crisis_score' in data:
        data['crisis_score'] = int(data['crisis_score'])

    return data

def update_game_state(room_name, game_data):
    if r is None:
        print("Cannot update game state: Redis client not initialized.")
        return False

    if 'players' in game_data:
        game_data['players'] = json.dumps(game_data['players'])
    if 'history' in game_data:
        game_data['history'] = json.dumps(game_data['history'])

    r.hset(f"room:{room_name}", mapping=game_data)
    return True

def play_game(room_name):
    if r is None:
        print("Cannot start game: Redis client not initialized.")
        return

    game = get_game_state(room_name)
    if not game:
        print("Room not found.")
        return

    client = setup_mistral_client()
    if not client:
        print("AI client failed to initialize. Cannot play game.")
        return

    while True:
        print(f"\nCurrent Crisis Score: {game['crisis_score']}/100")
        print(f"Current Scenario:\n{game['scenario']}\n")

        player_decisions = {}
        print("Enter player decisions (or type 'end' to finish):")

        players_in_room = game.get('players', {})
        if not players_in_room:
            print("No players in the room. Add players using join_game first.")
            break

        for player in players_in_room:
            decision = input(f"{player}'s decision: ")
            if decision.lower() == "end":
                print("Ending game...")
                return
            player_decisions[player] = decision

        if not player_decisions:
            print("No decisions entered. Continuing...")
            continue

        story_update = progress_story(client, game['scenario'], game['crisis_score'], player_decisions)

        if story_update and 'error' not in story_update:
            print("\n--- AI Dungeon Master Update ---")
            print(story_update.get("story_continuation", "N/A"))

            score_change = story_update.get('crisis_score_change', 0)
            game['crisis_score'] += score_change
            print(f"📉 Crisis Score Change: {score_change}")
            print(f"🧾 Rationale: {story_update.get('rationale', 'N/A')}")
            print(f"💯 New Crisis Score: {game['crisis_score']}/100")

            game['scenario'] = story_update.get("new_scenario", "The story concludes here.")
            print("\n--- NEW SITUATION ---")
            print(game['scenario'])
            print("---------------------")

            game['history'].append({
                "decisions": player_decisions,
                "update": story_update,
                "score_after_turn": game['crisis_score']
            })

            for player, decision in player_decisions.items():
                if player in game['players']:
                    game['players'][player]['score'] += 1

            update_game_state(room_name, game)

        elif story_update and 'error' in story_update:
            print(f"⚠️ AI Error: {story_update['error']}")
        else:
            print("⚠️ Could not process story update.")

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    try:
        mistral_client_instance = setup_mistral_client()
    except ValueError as ve:
        print(f"Cannot start game: {ve}")
        exit(1)

    if r is not None and mistral_client_instance is not None:
        room = input("Enter room name to create or join: ")
        action = input(f"Do you want to create room '{room}' or join it? (create/join): ").lower()

        if action == "create":
            theme = input("Enter game theme: ")
            if create_game(room, theme, mistral_client_instance):
                join_game(room, "Host")
                play_game(room)
            else:
                print("Failed to create game.")

        elif action == "join":
            player_name = input("Enter your player name: ")
            if join_game(room, player_name):
                play_game(room)
            else:
                print("Failed to join game.")

        else:
            print("Invalid action. Please enter 'create' or 'join'.")
    else:
        print("Cannot start game due to initialization errors (Redis or Mistral client).")
