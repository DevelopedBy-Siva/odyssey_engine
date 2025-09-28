# Odyssey Engine - Setup Guide

## Project Overview

Odyssey Engine is a multiplayer chaos simulation game where AI creates failure scenarios and players must navigate through them. The app consists of a React Native frontend and a Python Flask backend.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Redis server
- Expo CLI (for mobile development)

## Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start Redis Server

Make sure Redis is running on your system:

- Windows: Download and run Redis
- macOS: `brew install redis && brew services start redis`
- Linux: `sudo apt-get install redis-server && sudo systemctl start redis`

### 3. Start Backend Server

```bash
# Windows
start-backend.bat

# macOS/Linux
chmod +x start-backend.sh
./start-backend.sh

# Or manually:
cd backend
python app.py
```

The backend will run on `http://192.168.0.168:5000` (as configured in `assets/data.json`)

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
# Start Expo development server
npm start

# Or for specific platforms
npm run android
npm run ios
npm run web
```

## Configuration

### Backend URL

Update the backend URL in `assets/data.json` if your backend is running on a different address:

```json
{
  "url": "your-backend-ip:5000"
}
```

### Network Configuration

- Make sure your device and backend are on the same network
- Update the IP address in `assets/data.json` to match your backend server's IP

## App Flow

1. **Landing Page** (`app/index.tsx`): Shows loading animation and always redirects to login
2. **Login Page** (`app/login.tsx`): User enters username to join the game (no cached login)
3. **Home Page** (`app/home/index.tsx`): Main dashboard with game options
4. **Game Features**:
   - **Build Room** (`app/home/set-theme.tsx`): Create a new game room
   - **Join Room** (`app/home/join-room.tsx`): Join existing rooms
   - **World Arena** (`app/home/world-arena.tsx`): View global rankings
   - **Profile** (`app/home/profile.tsx`): View user statistics and logout

## Troubleshooting

### Common Issues

1. **"Failed to connect to server"**

   - Check if backend is running
   - Verify IP address in `assets/data.json`
   - Ensure devices are on same network

2. **"Cannot join the room"**

   - Check if backend is running
   - Verify Redis is running
   - Check backend logs for errors

3. **Navigation issues**

   - Make sure all routes are properly defined in `app/_layout.tsx`
   - Check if user is properly authenticated

4. **Metro cache issues**
   - Run `clear-cache.bat` (Windows) or `clear-cache.sh` (macOS/Linux)
   - Or manually: `npx expo start -c`
   - If persistent, delete `node_modules` and run `npm install`

### Backend Issues

- Check if Redis is running: `redis-cli ping`
- Check backend logs for errors
- Verify all Python dependencies are installed

### Frontend Issues

- Clear Expo cache: `expo start -c` or run the clear-cache scripts
- Check if all dependencies are installed: `npm install`
- Verify network connectivity

## Development Tips

1. **Backend Development**: The backend uses Flask with SocketIO for real-time communication
2. **Frontend Development**: Uses Expo Router for navigation and Zustand for state management
3. **Real-time Features**: Socket.IO handles room management and game communication
4. **API Integration**: REST API for user stats and rankings
5. **No Cached Login**: Users must enter username every time (no automatic login)

## File Structure

```
├── app/                    # Expo Router pages
│   ├── index.tsx          # Landing page (always goes to login)
│   ├── login.tsx           # Login page
│   └── home/              # Home screens
├── backend/               # Python Flask backend
├── components/            # Reusable UI components
├── services/            # API services
├── store/               # State management
└── assets/              # Images, fonts, data
```

## Support

If you encounter issues:

1. Check the console logs for errors
2. Verify all services are running
3. Check network connectivity
4. Clear Metro cache if needed
5. Review the troubleshooting section above
