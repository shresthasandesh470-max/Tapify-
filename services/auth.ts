
import { User, BusinessCardData, ActivityLog } from '../types';

const USERS_KEY = 'nfc_users';
const CARDS_KEY = 'nfc_cards';
const CURRENT_USER_KEY = 'nfc_current_user';
const LOGS_KEY = 'tapify_activity_logs';

export const storage = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  
  getCards: (): BusinessCardData[] => JSON.parse(localStorage.getItem(CARDS_KEY) || '[]'),
  saveCards: (cards: BusinessCardData[]) => localStorage.setItem(CARDS_KEY, JSON.stringify(cards)),
  
  getLogs: (): ActivityLog[] => JSON.parse(localStorage.getItem(LOGS_KEY) || '[]'),
  saveLogs: (logs: ActivityLog[]) => localStorage.setItem(LOGS_KEY, JSON.stringify(logs)),
  
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const logs = storage.getLogs();
    const newLog: ActivityLog = {
      ...log,
      id: 'log_' + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    storage.saveLogs([newLog, ...logs].slice(0, 1000)); // Keep last 1000 logs
  },
  
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Initialize Admin
const init = () => {
  const users = storage.getUsers();
  if (!users.find(u => u.email === 'admin@nfc.com')) {
    users.push({
      id: 'admin-id',
      email: 'admin@nfc.com',
      password: 'admin',
      isAdmin: true
    });
    storage.saveUsers(users);
  }
};
init();
