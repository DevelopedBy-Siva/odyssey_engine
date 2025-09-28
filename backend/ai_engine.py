import os
import json
import time
import requests
from config import Config
from prompts import get_prompt, SUSTAINABILITY_THEMES

class AIEngine:
    def __init__(self):
        self.config = Config()
        self.provider = self.config.AI_PROVIDER.lower()
        self.api_key = self._get_api_key()
        self.model = self._get_model()
        self.base_url = self._get_base_url()
        self.timeout = self.config.AI_TIMEOUT
        self.max_retries = self.config.AI_MAX_RETRIES

    def _get_api_key(self):
        """Get API key based on provider"""
        if self.provider == 'mistral':
            api_key = self.config.MISTRAL_API_KEY
            key_file = 'MISTRAL_API_KEY.txt'
        elif self.provider == 'gemini':
            api_key = self.config.GEMINI_API_KEY
            key_file = 'GEMINI_API_KEY.txt'
        elif self.provider == 'openai':
            api_key = self.config.OPENAI_API_KEY
            key_file = 'OPENAI_API_KEY.txt'
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")
        
        if not api_key:
            # Try to read from file if not in environment
            try:
                with open(key_file, 'r') as f:
                    api_key = f.read().strip()
            except FileNotFoundError:
                raise ValueError(f"{self.provider.upper()}_API_KEY not found in environment variables or {key_file} file")
        
        if not api_key:
            raise ValueError(f"{self.provider.upper()}_API_KEY is empty")
        
        return api_key

    def _get_model(self):
        """Get model based on provider"""
        if self.provider == 'mistral':
            return self.config.MISTRAL_MODEL
        elif self.provider == 'gemini':
            return self.config.GEMINI_MODEL
        elif self.provider == 'openai':
            return self.config.OPENAI_MODEL
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")

    def _get_base_url(self):
        """Get base URL based on provider"""
        if self.provider == 'mistral':
            return self.config.MISTRAL_BASE_URL
        elif self.provider == 'gemini':
            return f"{self.config.GEMINI_BASE_URL}/{self.model}:generateContent"
        elif self.provider == 'openai':
            return self.config.OPENAI_BASE_URL
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")

    def _make_ai_request(self, prompt, response_format=None):
        """Make AI request with retry logic using direct API calls"""
        if not self.api_key:
            return {"error": "AI API key not initialized"}
        
        # Get provider-specific headers and payload
        headers, payload = self._get_request_config(prompt, response_format)
        
        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    self.base_url,
                    headers=headers,
                    json=payload,
                    timeout=self.timeout
                )
                
                if response.status_code == 200:
                    return self._parse_response(response.json())
                else:
                    error_msg = f"API request failed with status {response.status_code}: {response.text}"
                    if attempt == self.max_retries - 1:
                        return {"error": f"AI request failed after {self.max_retries} attempts: {error_msg}"}
                
            except requests.exceptions.RequestException as e:
                if attempt == self.max_retries - 1:
                    return {"error": f"AI request failed after {self.max_retries} attempts: {e}"}
                time.sleep(2 ** attempt)  # Exponential backoff
        
        return {"error": "AI request failed"}

    def _get_request_config(self, prompt, response_format=None):
        """Get headers and payload based on AI provider"""
        if self.provider == 'mistral':
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}]
            }
            if response_format:
                payload["response_format"] = response_format
                
        elif self.provider == 'gemini':
            headers = {
                "Content-Type": "application/json"
            }
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 2048
                }
            }
            if response_format:
                payload["generationConfig"]["responseMimeType"] = "application/json"
                
        elif self.provider == 'openai':
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}]
            }
            if response_format:
                payload["response_format"] = response_format
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")
        
        return headers, payload

    def _parse_response(self, data):
        """Parse response based on AI provider"""
        if self.provider == 'mistral':
            return data["choices"][0]["message"]["content"].strip()
        elif self.provider == 'gemini':
            return data["candidates"][0]["content"]["parts"][0]["text"].strip()
        elif self.provider == 'openai':
            return data["choices"][0]["message"]["content"].strip()
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")

    def generate_initial_scenario_and_roles(self, theme, player_count):
        """Generate initial crisis scenario and assign roles to players"""
        prompt = get_prompt("initial_scenario", theme=theme, player_count=player_count)
        
        response = self._make_ai_request(prompt, {"type": "json_object"})
        
        if isinstance(response, dict) and "error" in response:
            return response
        
        try:
            return json.loads(response)
        except json.JSONDecodeError as e:
            return {"error": f"Failed to parse AI response as JSON: {e}"}

    def score_individual_response(self, theme, player_response, role, round_number):
        """Score an individual player's response"""
        prompt = get_prompt("individual_scoring", 
                          theme=theme, 
                          role=role, 
                          round_number=round_number, 
                          player_response=player_response)

        response = self._make_ai_request(prompt, {"type": "json_object"})
        
        if isinstance(response, dict) and "error" in response:
            return response
        
        try:
            return json.loads(response)
        except json.JSONDecodeError as e:
            return {"error": f"Failed to parse AI response as JSON: {e}"}

    def update_crisis_score(self, theme, current_crisis_score, all_player_responses, round_number):
        """Update the crisis score based on all player responses"""
        formatted_responses = self._format_all_responses(all_player_responses)
        
        prompt = get_prompt("crisis_score_update",
                          theme=theme,
                          current_crisis_score=current_crisis_score,
                          round_number=round_number,
                          formatted_responses=formatted_responses)

        response = self._make_ai_request(prompt, {"type": "json_object"})
        
        if isinstance(response, dict) and "error" in response:
            return response
        
        try:
            return json.loads(response)
        except json.JSONDecodeError as e:
            return {"error": f"Failed to parse AI response as JSON: {e}"}

    def generate_story_continuation(self, theme, current_scenario, crisis_score, all_responses, round_number):
        """Generate the next part of the story"""
        formatted_responses = self._format_all_responses(all_responses)
        
        prompt = get_prompt("story_continuation",
                          theme=theme,
                          current_scenario=current_scenario,
                          crisis_score=crisis_score,
                          round_number=round_number,
                          formatted_responses=formatted_responses)

        response = self._make_ai_request(prompt, {"type": "json_object"})
        
        if isinstance(response, dict) and "error" in response:
            return response
        
        try:
            return json.loads(response)
        except json.JSONDecodeError as e:
            return {"error": f"Failed to parse AI response as JSON: {e}"}

    def calculate_final_game_scores(self, theme, all_rounds_data, final_crisis_score):
        """Calculate final scores for the entire game"""
        formatted_rounds = self._format_all_rounds_data(all_rounds_data)
        
        prompt = get_prompt("final_scoring",
                          theme=theme,
                          final_crisis_score=final_crisis_score,
                          total_rounds=len(all_rounds_data),
                          formatted_rounds=formatted_rounds)

        response = self._make_ai_request(prompt, {"type": "json_object"})
        
        if isinstance(response, dict) and "error" in response:
            return response
        
        try:
            return json.loads(response)
        except json.JSONDecodeError as e:
            return {"error": f"Failed to parse AI response as JSON: {e}"}

    def _format_all_responses(self, all_player_responses):
        """Format player responses for AI prompts"""
        formatted = ""
        for player, response in all_player_responses.items():
            formatted += f"- {player}: {response}\n"
        return formatted

    def _format_all_rounds_data(self, all_rounds_data):
        """Format all rounds data for AI prompts"""
        formatted = ""
        for i, round_data in enumerate(all_rounds_data, 1):
            formatted += f"Round {i}:\n"
            formatted += f"  Crisis Score: {round_data.get('crisis_score', 'N/A')}\n"
            formatted += f"  Player Responses: {round_data.get('responses', {})}\n"
            formatted += f"  Score Changes: {round_data.get('score_changes', 'N/A')}\n\n"
        return formatted

    def determine_end_reason(self, final_crisis_score, total_rounds):
        """Determine why the game ended"""
        if final_crisis_score >= 80:
            return "Crisis successfully resolved"
        elif final_crisis_score <= 20:
            return "Crisis escalated beyond control"
        elif total_rounds >= 3:
            return "Maximum rounds reached"
        else:
            return "Game ended manually"

    def is_client_available(self):
        """Check if AI client is available"""
        return self.api_key is not None

    def get_model_info(self):
        """Get current AI model information"""
        return {
            "provider": self.provider,
            "model": self.model,
            "base_url": self.base_url,
            "timeout": self.timeout,
            "max_retries": self.max_retries,
            "client_available": self.is_client_available()
        }
