
INITIAL_SCENARIO_PROMPT = """
Create a simple crisis scenario for {player_count} players.

Theme: {theme}

Generate a short, clear scenario and simple roles.

Respond with JSON:
{{
    "scenario": "A simple crisis situation that needs team decisions",
    "roles": {{
        "player1": {{"role_name": "Simple Role 1", "description": "What this role does"}},
        "player2": {{"role_name": "Simple Role 2", "description": "What this role does"}},
        "player3": {{"role_name": "Simple Role 3", "description": "What this role does"}},
        "player4": {{"role_name": "Simple Role 4", "description": "What this role does"}}
    }},
    "initial_crisis_score": 50,
    "next_decision_point": "What should the team do first?"
}}

Keep it simple and fun!
"""

INDIVIDUAL_SCORING_PROMPT = """
Score this player's response simply:

Player Role: {role}
Response: "{player_response}"

Give scores from 0-25 for each:
- Creativity: How original is it?
- Helping: How much does it help?
- Teamwork: How well does it work with others?
- Role Fit: How well does it fit the role?

Respond with JSON:
{{
    "creativity_score": 0-25,
    "helping_nature_score": 0-25,
    "team_strategy_score": 0-25,
    "role_appropriateness_score": 0-25,
    "total_individual_score": 0-100
}}
"""

CRISIS_SCORE_UPDATE_PROMPT = """
Update the crisis score based on team responses.

Current Score: {current_crisis_score}/100

Player Responses:
{formatted_responses}

Rate the team's overall performance:
- Good teamwork = +5 to +15 points
- Poor teamwork = -5 to -15 points
- Mixed results = -5 to +5 points

Respond with JSON:
{{
    "new_crisis_score": 0-100,
    "score_change": "+/- points",
    "team_collaboration": "How well did the team work together?",
    "reasoning": "Why the score changed"
}}
"""

STORY_CONTINUATION_PROMPT = """
Continue the story based on what happened.

Current Situation: {current_scenario}
Crisis Score: {crisis_score}/100

What the team did:
{formatted_responses}

Write what happens next:
- Show the results of their decisions
- Create a new problem to solve
- Keep it simple and engaging

Respond with JSON:
{{
    "story_continuation": "What happens next",
    "next_decision_point": "What should the team decide now?"
}}
"""

FINAL_SCORING_PROMPT = """
Give final scores for the game.

Final Crisis Score: {final_crisis_score}/100

Game Data:
{formatted_rounds}

Rate each player (0-100 total):
- Creativity: How original were their ideas?
- Helping: How much did they help solve the crisis?
- Teamwork: How well did they work with others?
- Role: How well did they play their role?

Respond with JSON:
{{
    "game_summary": "How did the team do overall?",
    "crisis_outcome": "Did they solve the crisis?",
    "team_highlights": "Best moments of teamwork"
}}
"""

SUSTAINABILITY_THEMES = {
    "climate_change": {
        "roles": ["Scientist", "Leader", "Activist", "Citizen"],
        "scenario_focus": "Climate crisis that needs team solutions"
    },
    "resource_scarcity": {
        "roles": ["Manager", "Leader", "Inventor", "Citizen"],
        "scenario_focus": "Resource shortage that needs team solutions"
    },
    "social_equity": {
        "roles": ["Helper", "Leader", "Organizer", "Citizen"],
        "scenario_focus": "Social problem that needs team solutions"
    },
    "environmental_pollution": {
        "roles": ["Engineer", "Health Worker", "Advocate", "Resident"],
        "scenario_focus": "Pollution problem that needs team solutions"
    }
}

PROMPT_TEMPLATES = {
    "initial_scenario": INITIAL_SCENARIO_PROMPT,
    "individual_scoring": INDIVIDUAL_SCORING_PROMPT,
    "crisis_score_update": CRISIS_SCORE_UPDATE_PROMPT,
    "story_continuation": STORY_CONTINUATION_PROMPT,
    "final_scoring": FINAL_SCORING_PROMPT
}

def get_prompt(prompt_type: str, **kwargs) -> str:
    if prompt_type not in PROMPT_TEMPLATES:
        raise ValueError(f"Unknown prompt type: {prompt_type}")
    
    template = PROMPT_TEMPLATES[prompt_type]
    try:
        return template.format(**kwargs)
    except KeyError as e:
        raise ValueError(f"Missing required variable for prompt: {e}")
