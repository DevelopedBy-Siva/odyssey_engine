import os

class Config:
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', 'sunhack')
    
    # Redis Configuration
    REDIS_HOST = os.environ.get('REDIS_HOST', 'redis-18552.c114.us-east-1-4.ec2.redns.redis-cloud.com')
    REDIS_PORT = int(os.environ.get('REDIS_PORT', 18552))
    REDIS_DB = int(os.environ.get('REDIS_DB', 0))
    REDIS_USERNAME = os.environ.get('REDIS_USERNAME', 'default')
    REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD', 'l55AXKcgrS4UeVU3dE6waEmc39tkvyl9')
    
    # SocketIO Configuration
    SOCKETIO_CORS_ALLOWED_ORIGINS = os.environ.get('SOCKETIO_CORS_ALLOWED_ORIGINS', "*")
    
    # Application Configuration
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5001))
    
    # File Upload Configuration
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads/avatars')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE', 5 * 1024 * 1024))
    
    # AI Configuration
    AI_PROVIDER = os.environ.get('AI_PROVIDER', 'mistral')
    
    # Mistral AI Configuration
    MISTRAL_API_KEY = os.environ.get('MISTRAL_API_KEY', '94hOrIBRomJvJUwXmbmp45wDFje09FPS')
    MISTRAL_MODEL = os.environ.get('MISTRAL_MODEL', 'mistral-large-latest')
    MISTRAL_BASE_URL = os.environ.get('MISTRAL_BASE_URL', 'https://api.mistral.ai/v1/chat/completions')
    
    # Gemini AI Configuration
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyAToV4DgDW4LW0wOR_qZD7ItP-PU4lpnkE')
    GEMINI_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-1.5-pro')
    GEMINI_BASE_URL = os.environ.get('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta/models')
    
    # OpenAI Configuration
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
    OPENAI_MODEL = os.environ.get('OPENAI_MODEL', 'gpt-4')
    OPENAI_BASE_URL = os.environ.get('OPENAI_BASE_URL', 'https://api.openai.com/v1/chat/completions')
    
    # Common AI Settings
    AI_TIMEOUT = int(os.environ.get('AI_TIMEOUT', 30)) 
    AI_MAX_RETRIES = int(os.environ.get('AI_MAX_RETRIES', 3))