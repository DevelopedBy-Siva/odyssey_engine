import os

class Config:
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', 'sushi')
    
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
    MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE', 5 * 1024 * 1024))  # 5MB default