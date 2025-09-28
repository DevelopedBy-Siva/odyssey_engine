import axios from 'axios';
import data from '../assets/data.json';

const API_BASE_URL = `http://${data.url}`;

export interface UserStats {
  username: string;
  total_score: number;
  total_games: number;
  average_score: number;
  games_won: number;
  last_played: string | null;
  achievements: string[];
  lastActive: string | null;
}

export interface Room {
  room_id: string;
  room_size: number;
  max_players: number;
  room_name: string;
  theme: string;
  host: string;
}

export interface SystemStats {
  total_users: number;
  total_rooms: number;
  active_games: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  username: string;
  total_score: number;
  average_score: number;
  games_won: number;
}

class ApiService {
  private baseURL: string;
  private isServerOnline: boolean = false;
  private lastHealthCheck: number = 0;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Check if server is online
  private async checkServerHealth(): Promise<boolean> {
    const now = Date.now();
    // Cache health check for 30 seconds
    if (now - this.lastHealthCheck < 30000 && this.isServerOnline) {
      return this.isServerOnline;
    }

    try {
      const response = await axios.get(`${this.baseURL}/api/health`, {
        timeout: 5000,
      });
      this.isServerOnline = response.status === 200;
      this.lastHealthCheck = now;
      return this.isServerOnline;
    } catch {
      this.isServerOnline = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  // Authentication APIs
  async login(username: string) {
    try {
      // Check server health first
      const isServerOnline = await this.checkServerHealth();
      
      if (!isServerOnline) {
        // Fallback to offline mode
        return {
          success: true,
          message: "Login successful (offline mode)",
          is_exist: false,
          username: username.trim().toLowerCase(),
          offline: true
        };
      }

      const response = await axios.post(`${this.baseURL}/login`, { 
        username: username.trim().toLowerCase() 
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error: any) {
      
      // If server is down, provide fallback
      if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR' || 
          error.response?.status >= 500) {
        return {
          success: true,
          message: "Login successful (offline mode)",
          is_exist: false,
          username: username.trim().toLowerCase(),
          offline: true
        };
      }
      
      throw new Error('Login failed');
    }
  }

  async logout(username: string) {
    try {
      // Check server health first
      const isServerOnline = await this.checkServerHealth();
      
      if (!isServerOnline) {
        return {
          success: true,
          message: "Logout successful (offline mode)",
          offline: true
        };
      }

      const response = await axios.post(`${this.baseURL}/logout`, { 
        username: username 
      }, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error: any) {
      
      // If server is down or returns 404, handle gracefully
      if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR' || 
          error.response?.status === 404 || error.response?.status >= 500) {
        return {
          success: true,
          message: "Logout successful (offline mode)",
          offline: true
        };
      }
      
      // For other errors, still return success to allow logout
      return { 
        success: true,
        message: "Logout completed"
      };
    }
  }

  // User related APIs
  async getUserProfile(username: string) {
    try {
      const response = await axios.get(`${this.baseURL}/api/user/${username}`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch user profile');
    }
  }

  async getUserStats(username: string): Promise<UserStats | null> {
    try {
      const response = await axios.get(`${this.baseURL}/api/user/${username}`, {
        timeout: 10000, // 10 second timeout
      });
      if (response.data.success) {
        return response.data.user_stats;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Room related APIs
  async getAvailableRooms(): Promise<Room[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/rooms`);
      if (response.data.success) {
        return response.data.rooms;
      }
      return [];
    } catch {
      return [];
    }
  }

  async getRoomInfo(roomId: string) {
    try {
      const response = await axios.get(`${this.baseURL}/api/rooms/${roomId}`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch user profile');
    }
  }

  // Rankings and leaderboard
  async getRankings(): Promise<UserStats[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/rankings`);
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch {
      return [];
    }
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/leaderboard?limit=${limit}`);
      if (response.data.success) {
        return response.data.leaderboard;
      }
      return [];
    } catch {
      return [];
    }
  }

  // System stats
  async getSystemStats(): Promise<SystemStats | null> {
    try {
      const response = await axios.get(`${this.baseURL}/api/stats`, {
        timeout: 10000, // 10 second timeout
      });
      if (response.data.success) {
        return response.data.stats;
      }
      return null;
    } catch {
      return null;
    }
  }

  async getActiveGames() {
    try {
      const response = await axios.get(`${this.baseURL}/api/active-games`);
      if (response.data.success) {
        return response.data.active_games;
      }
      return [];
    } catch {
      return [];
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/api/health`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch user profile');
    }
  }
}

export default new ApiService();
