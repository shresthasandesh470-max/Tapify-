
import { User, BusinessCardData, ActivityLog } from '../types';

const USERS_KEY = 'tapify_users_v1';
const CARDS_KEY = 'tapify_cards_v1';
const CURRENT_USER_KEY = 'tapify_session_v1';
const LOGS_KEY = 'tapify_activity_logs_v1';
const WALLET_KEY = 'tapify_wallet_v1';

export const storage = {
  getUsers: (): User[] => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  },
  saveUsers: (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  
  getCards: (): BusinessCardData[] => {
    try {
      return JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
    } catch {
      return [];
    }
  },
  saveCards: (cards: BusinessCardData[]) => localStorage.setItem(CARDS_KEY, JSON.stringify(cards)),
  
  getSavedCards: (): BusinessCardData[] => {
    try {
      return JSON.parse(localStorage.getItem(WALLET_KEY) || '[]');
    } catch {
      return [];
    }
  },
  saveToWallet: (card: BusinessCardData) => {
    const cards = storage.getSavedCards();
    if (!cards.find(c => c.id === card.id)) {
      storage.saveLogs([{
        id: 'wallet_' + Date.now(),
        userId: 'guest',
        userEmail: 'guest',
        action: 'NFC_WRITE',
        details: `Card ${card.name} saved to local wallet.`,
        timestamp: Date.now()
      } as ActivityLog, ...storage.getLogs()]);
      localStorage.setItem(WALLET_KEY, JSON.stringify([...cards, card]));
    }
  },
  removeFromWallet: (id: string) => {
    const cards = storage.getSavedCards().filter(c => c.id !== id);
    localStorage.setItem(WALLET_KEY, JSON.stringify(cards));
  },
  
  getLogs: (): ActivityLog[] => {
    try {
      return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    } catch {
      return [];
    }
  },
  saveLogs: (logs: ActivityLog[]) => localStorage.setItem(LOGS_KEY, JSON.stringify(logs)),
  
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const logs = storage.getLogs();
    const newLog: ActivityLog = {
      ...log,
      id: 'log_' + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    storage.saveLogs([newLog, ...logs].slice(0, 1000));
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

// Initialize default users (Admin + 2 Members)
const init = () => {
  const users = storage.getUsers();
  const defaultAccounts = [
    {
      id: 'admin-primary',
      email: 'admin@tapify.co',
      password: 'admin',
      isAdmin: true,
      isVerified: true
    },
    {
      id: 'member-1',
      email: 'member1@tapify.co',
      password: 'member1',
      isAdmin: false,
      isVerified: true
    },
    {
      id: 'member-2',
      email: 'member2@tapify.co',
      password: 'member2',
      isAdmin: false,
      isVerified: true
    }
  ];

  let updated = false;
  defaultAccounts.forEach(acc => {
    if (!users.find(u => u.email === acc.email)) {
      users.push(acc);
      updated = true;
    }
  });

  if (updated) {
    storage.saveUsers(users);
  }
};
init();
