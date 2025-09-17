from transformers import pipeline

# Load Llama 3 (replace with your Hugging Face token after approval)
generator = pipeline('text-generation', model='meta-llama/Meta-Llama-3-8B-Instruct', device=0 if you have GPU else -1)

def generate_hype(user_text, trends, user_profile):
    # Craft a detailed prompt for hype/rap generation
    prompt = f"""
    You are a motivational hype coach and expert rapper. Your task is to create a 30-second energetic rap or speech to motivate the user.
    User feels: {user_text}
    Local trends: {trends}
    User profile: {user_profile}
    
    Requirements: 
    - Keep it positive and uplifting.
    - Use a rhythmic, rap-style flow (e.g., rhyming lines).
    - Incorporate the user's name (e.g., Alex) and trends naturally.
    - Limit to 100-150 words for 30 seconds.
    - Output only the lyrics/speech.
    """
    
    # Generate with controlled length and creativity
    result = generator(prompt, max_length=150, num_return_sequences=1, temperature=0.7, top_k=50)
    lyrics = result[0]['generated_text'].split('Output only the lyrics/speech.')[-1].strip()
    return lyrics[:150]  # Cap at 150 words

# Test the function
if __name__ == "__main__":
    user_input = "Nervous about presentation"
    trends = "#HustleVibes in NYC"
    profile = "Student named Alex who loves hip-hop and has stage fright history"
    
    hype_lyrics = generate_hype(user_input, trends, profile)
    print("Your Hype Lyrics:\n", hype_lyrics)
