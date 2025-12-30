
import React, { useState } from 'react';
import { storage } from '../services/auth';
import { BusinessCardData, ActivityLog, User } from '../types';
import { ClipboardList, Users, Activity, Clock, Trash2, Edit2, Search, UserPlus, Mail, Shield, CheckCircle2, Wand2, X, ArrowLeft } from 'lucide-react';

interface AdminDashboardProps {
  onEditCard: (card: BusinessCardData) => void;
  onViewEditor: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onEditCard, onViewEditor }) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'users' | 'logs'>('cards');
  const [cards, setCards] = useState<BusinessCardData[]>(storage.getCards());
  const [logs, setLogs] = useState<ActivityLog[]>(storage.getLogs());
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserInfo, setNewUserInfo] = useState({ email: '', name: '' });

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      const updated = cards.filter(c => c.id !== id);
      storage.saveCards(updated);
      setCards(updated);
      storage.addLog({
        userId: 'admin',
        userEmail: 'admin@nfc.com',
        action: 'SAVE',
        details: `Admin deleted card ID: ${id}`
      });
      setLogs(storage.getLogs());
    }
  };

  const handleManualUserAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find(u => u.email === newUserInfo.email)) {
      alert("A user with this email already exists.");
      return;
    }

    const newUser: User = {
      id: 'u_manual_' + Math.random().toString(36).substr(2, 7),
      email: newUserInfo.email,
      isAdmin: false,
      isVerified: true // Pre-verified by admin
    };

    const updatedUsers = [...users, newUser];
    storage.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    
    storage.addLog({
      userId: 'admin',
      userEmail: 'admin@nfc.com',
      action: 'LOGIN',
      details: `Admin manually onboarded user: ${newUserInfo.email}`
    });

    setShowAddUserModal(false);
    setNewUserInfo({ email: '', name: '' });
  };

  const provisionCardForUser = (user: User) => {
    const existingCard = cards.find(c => c.userId === user.id);
    if (existingCard) {
      onEditCard(existingCard);
      return;
    }

    const newCard: BusinessCardData = {
      id: 'card_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      name: user.email.split('@')[0],
      title: 'New Member',
      company: '',
      email: user.email,
      phone: '',
      website: '',
      linkedin: '',
      twitter: '',
      address: '',
      profileImage: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop',
      themeColor: '#4f46e5',
      template: 'modern',
      theme: 'light',
      orientation: 'landscape',
      bio: 'Onboarded by Administrator',
      createdAt: Date.now()
    };

    const updatedCards = [...cards, newCard];
    storage.saveCards(updatedCards);
    setCards(updatedCards);
    onEditCard(newCard);
    
    storage.addLog({
      userId: 'admin',
      userEmail: 'admin@nfc.com',
      action: 'SAVE',
      details: `Admin provisioned initial card for ${user.email}`
    });
  };

  const getLogBadgeColor = (action: string) => {
    switch(action) {
      case 'SAVE': return 'bg-green-100 text-green-700';
      case 'AI_TRANSLATE': return 'bg-indigo-100 text-indigo-700';
      case 'AI_IMAGE_EDIT': return 'bg-purple-100 text-purple-700';
      case 'ORDER_NFC': return 'bg-amber-100 text-amber-700';
      case 'LOGIN': return 'bg-blue-100 text-blue-700';
      case 'NFC_WRITE': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <button 
            onClick={onViewEditor}
            className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={12} /> Return to Identity Lab
          </button>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">System Hub</h2>
          <p className="text-slate-500 font-medium">Platform-wide governance and identity management.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 min-w-[160px] flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assets</p>
            <p className="text-3xl font-black text-indigo-600 tracking-tighter">{cards.length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 min-w-[160px] flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Platform Users</p>
            <p className="text-3xl font-black text-indigo-600 tracking-tighter">{users.length}</p>
          </div>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all active:scale-95 group"
          >
            <UserPlus className="group-hover:rotate-12 transition-transform" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest">Identity lab</p>
              <p className="text-xs font-black uppercase">Add Manual User</p>
            </div>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-[2rem] w-full max-w-xl mb-8">
        <button 
          onClick={() => setActiveTab('cards')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cards' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <ClipboardList size={14} /> Cards
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Users size={14} /> User Directory
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Activity size={14} /> Audit Trail
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        {activeTab === 'cards' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Owner</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Preview</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cards.map((card) => {
                  const owner = users.find(u => u.id === card.userId);
                  return (
                    <tr key={card.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-slate-900">{owner?.email}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {card.id.slice(0, 12)}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-lg shrink-0">
                             <img src={card.profileImage} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{card.name}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.title || 'No Title Set'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-xl uppercase tracking-widest">
                            {card.template}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onEditCard(card)}
                            className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                            title="Edit Design"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCard(card.id)}
                            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                            title="Remove Card"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Level</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Card Presence</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => {
                  const userCard = cards.find(c => c.userId === user.id);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black">
                            {user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900">{user.email}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {user.isAdmin ? (
                          <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-[9px] font-black rounded-xl uppercase tracking-widest flex items-center gap-1 w-fit">
                            <Shield size={10} /> Administrator
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[9px] font-black rounded-xl uppercase tracking-widest w-fit">
                            Member
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {userCard ? (
                          <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest">
                            <CheckCircle2 size={12} /> Active
                          </div>
                        ) : (
                          <div className="text-slate-300 font-black text-[10px] uppercase tracking-widest">
                            No Card
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => provisionCardForUser(user)}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 ml-auto"
                        >
                          <Wand2 size={12} /> {userCard ? 'Edit Design' : 'Provision Card'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action Type</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length > 0 ? logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="text-sm font-black text-slate-900">{log.userEmail}</div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {log.userId}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${getLogBadgeColor(log.action)}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">{log.details}</p>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300"><Search size={32} /></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No activity detected yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><UserPlus size={20} /></div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Manual Onboarding</h3>
                 </div>
                 <button onClick={() => setShowAddUserModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleManualUserAdd} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Member Email</label>
                    <input 
                      type="email" 
                      required 
                      value={newUserInfo.email}
                      onChange={(e) => setNewUserInfo({...newUserInfo, email: e.target.value})}
                      placeholder="user@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                 </div>
                 <Button type="submit" className="w-full h-16">Create & Finalize</Button>
                 <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">User can set password via recovery later</p>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// Local minimal button to avoid Circular dependency
const Button = ({ children, onClick, type = "button", className = "", disabled = false }: any) => (
  <button 
    type={type} 
    onClick={onClick} 
    disabled={disabled}
    className={`rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-[0.97] px-8 py-4 ${className}`}
  >
    {children}
  </button>
);

export default AdminDashboard;
