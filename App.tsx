
import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, User as UserIcon, Settings, Share2, ShieldCheck, Database, Layout as LayoutIcon, Wand2, Edit3, Eye, LogIn, UserPlus, Mail, Shield, CheckCircle2, ArrowRight, RefreshCw, Smartphone, AlertCircle, X, ShieldAlert, FileText, Lock, Download, UserPlus2, KeyRound, Radio, ShieldPlus, Zap, Wallet, Trash2, ChevronRight } from 'lucide-react';
import BusinessCard from './components/BusinessCard';
import Editor from './components/Editor';
import AdminDashboard from './components/AdminDashboard';
import ShareModal from './components/ShareModal';
import LandingPage from './components/LandingPage';
import { storage } from './services/auth';
import { BusinessCardData, User, ViewState } from './types';
import { useLiveChat } from './hooks/useLiveChat';

// --- Local UI Components & Utilities ---
const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'error' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    switch(type) {
      case 'light': navigator.vibrate(10); break;
      case 'medium': navigator.vibrate(30); break;
      case 'success': navigator.vibrate([20, 30, 20]); break;
      case 'error': navigator.vibrate([50, 50, 50]); break;
    }
  }
};

export const TapifyLogo = ({ className = "w-10 h-10", iconSize = 20 }: { className?: string, iconSize?: number }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 rotate-3 group-hover:rotate-6 transition-transform"></div>
    <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ripple pointer-events-none"></div>
    <div className="relative z-10 flex flex-col items-center">
      <Radio className="text-white" size={iconSize} />
    </div>
  </div>
);

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden ${className}`}>{children}</div>
);
const CardHeader = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`p-8 border-b border-slate-100 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <h3 className={`text-2xl font-black tracking-tight text-slate-900 uppercase ${className}`}>{children}</h3>
);
const CardContent = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`p-8 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = "default", size = "default", className = "", type = "button", disabled = false }: any) => {
  const handleClick = (e: any) => {
    if (disabled) {
      triggerHaptic('error');
      return;
    }
    triggerHaptic();
    if (onClick) onClick(e);
  };
  const variants: any = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.97]",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-[0.97]",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50 active:scale-[0.97]",
    destructive: "bg-red-500 text-white hover:bg-red-600 active:scale-[0.97]",
    social: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm active:scale-[0.98] font-semibold tracking-normal",
  };
  const sizes: any = {
    default: "px-8 py-4",
    sm: "px-4 py-2 text-xs",
    icon: "p-3",
  };
  return (
    <button 
      type={type} 
      onClick={handleClick} 
      disabled={disabled}
      className={`rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-200 disabled:opacity-30 disabled:grayscale-[0.5] flex items-center justify-center ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ ...props }: any) => (
  <input {...props} className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 ${props.className || ""}`} />
);

const Label = ({ children, htmlFor, className = "" }: any) => (
  <label htmlFor={htmlFor} className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 ${className}`}>{children}</label>
);

const PublicProfile = ({ data, isOffline = false, onBack }: { data: BusinessCardData; isOffline?: boolean; onBack?: () => void }) => {
  const [isSavedInWallet, setIsSavedInWallet] = useState(false);

  useEffect(() => {
    const saved = storage.getSavedCards();
    if (saved.find(c => c.id === data.id)) setIsSavedInWallet(true);
  }, [data.id]);

  const downloadVCard = () => {
    triggerHaptic('success');
    const vCardString = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${data.name || 'Contact'}`,
      `N:${data.name?.split(' ').reverse().join(';') || 'Contact'}`,
      `TITLE:${data.title || ''}`,
      `ORG:${data.company || ''}`,
      `EMAIL;TYPE=INTERNET,WORK:${data.email || ''}`,
      `TEL;TYPE=CELL:${data.phone || ''}`,
      `URL:${data.website || ''}`,
      `ADR;TYPE=WORK:;;${data.address || ''};;;;`,
      `NOTE:${data.bio || ''}`,
      'END:VCARD'
    ].join('\n');
    const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.name || 'contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const saveToWallet = () => {
    triggerHaptic('success');
    storage.saveToWallet(data);
    setIsSavedInWallet(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      {onBack && (
        <button onClick={onBack} className="absolute top-8 left-8 p-3 bg-white shadow-xl rounded-full text-slate-900 hover:scale-110 transition-transform">
          <ArrowRight className="rotate-180" size={24} />
        </button>
      )}
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 text-center mb-12">
          <TapifyLogo className="w-12 h-12" iconSize={24} />
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Verified Identity</p>
            {isOffline && (
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">
                    <Zap size={10} fill="currentColor" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Instant Sync Active</span>
                </div>
            )}
          </div>
        </div>
        <div className="w-full drop-shadow-[0_40px_100px_rgba(79,70,229,0.12)] mb-12">
          <BusinessCard data={data} scale={1} />
        </div>
        
        <div className="w-full max-w-xs space-y-3">
          <button onClick={downloadVCard} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-3 hover:bg-black transition-all">
            <UserPlus2 size={18} /> Save to Contacts
          </button>
          <button 
            onClick={saveToWallet} 
            disabled={isSavedInWallet}
            className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${isSavedInWallet ? 'bg-indigo-50 text-indigo-600 cursor-default' : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 shadow-xl'}`}
          >
            {isSavedInWallet ? <CheckCircle2 size={18} /> : <Wallet size={18} />}
            {isSavedInWallet ? 'Saved in Wallet' : 'Add to Wallet'}
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
            <a href={window.location.origin} className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
            Authorized <span className="text-indigo-600">Tapify</span> Identity
            </a>
            {isOffline && <p className="text-[8px] font-bold text-slate-300 uppercase">Loaded from Physical Scan Data</p>}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [view, setView] = useState<ViewState>(currentUser ? (currentUser.isAdmin ? 'admin' : 'editor') : 'landing');
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview' | 'ai'>('editor');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<BusinessCardData | null>(null);
  const [publicCard, setPublicCard] = useState<BusinessCardData | null>(null);
  const [isOfflineView, setIsOfflineView] = useState(false);

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { isConnected, connect, disconnect, transcription, error: aiError } = useLiveChat(
    "You are a professional business card consultant for Tapify. Help the user refine their title, bio, and company description."
  );

  useEffect(() => {
    // 1. Check for offline data in hash first (Highest priority for "Offline Scan")
    const hash = window.location.hash;
    if (hash && hash.startsWith('#off=')) {
        try {
            const encoded = hash.split('#off=')[1];
            const decodedJson = JSON.parse(decodeURIComponent(escape(atob(encoded))));
            
            const hydratedCard: BusinessCardData = {
                id: 'offline_' + Math.random().toString(36).substr(2, 5),
                userId: 'offline',
                name: decodedJson.n,
                title: decodedJson.t,
                company: decodedJson.c,
                email: decodedJson.e,
                phone: decodedJson.p,
                website: decodedJson.w,
                linkedin: decodedJson.l,
                twitter: decodedJson.tw,
                facebook: decodedJson.f,
                instagram: decodedJson.i,
                whatsappNumber: decodedJson.wh,
                address: decodedJson.a || '',
                themeColor: decodedJson.tc || '#6366f1',
                template: decodedJson.te || 'modern',
                theme: decodedJson.th || 'light',
                orientation: decodedJson.o || 'landscape',
                bio: decodedJson.b,
                profileImage: decodedJson.pi || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop',
                createdAt: Date.now()
            };
            
            setPublicCard(hydratedCard);
            setIsOfflineView(true);
            setIsAppLoading(false);
            return;
        } catch (e) {
            console.error("Failed to decode offline data", e);
        }
    }

    // 2. Fallback to card ID lookup
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('card');
    if (cardId) {
      const allCards = storage.getCards();
      const card = allCards.find(c => c.id === cardId);
      if (card) setPublicCard(card);
    }
    
    const timer = setTimeout(() => setIsAppLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentUser && !editingCard) {
      const cards = storage.getCards();
      let myCard = cards.find(c => c.userId === currentUser.id);
      if (!myCard) {
        myCard = {
          id: 'card_' + Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          name: currentUser.email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          title: 'Identity Owner',
          company: 'Identity Labs',
          email: currentUser.email,
          phone: '',
          website: '',
          linkedin: '',
          twitter: '',
          address: '',
          profileImage: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop',
          themeColor: '#6366f1',
          template: 'modern',
          theme: 'light',
          orientation: 'landscape',
          bio: 'Building the future of professional networking.',
          createdAt: Date.now()
        };
        storage.saveCards([...cards, myCard]);
      }
      setEditingCard(myCard);
    }
  }, [currentUser, editingCard]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      triggerHaptic('success');
      storage.setCurrentUser(user);
      setCurrentUser(user);
      setView(user.isAdmin ? 'admin' : 'editor');
    } else {
      triggerHaptic('error');
      setError('Access Denied: Invalid credentials.');
    }
  };

  const handleLogout = () => {
    triggerHaptic('medium');
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setEditingCard(null);
    setView('landing');
    disconnect();
  };

  const updateCard = (updated: BusinessCardData) => {
    setEditingCard(updated);
    const cards = storage.getCards();
    const index = cards.findIndex(c => c.id === updated.id);
    if (index > -1) {
      cards[index] = updated;
      storage.saveCards(cards);
    }
  };

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
        <TapifyLogo className="w-24 h-24 mb-10" iconSize={36} />
        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] animate-pulse">Initializing Hub</p>
      </div>
    );
  }

  if (publicCard) return <PublicProfile data={publicCard} isOffline={isOfflineView} onBack={isOfflineView ? () => { setPublicCard(null); window.location.hash = ''; } : undefined} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden safe-bottom">
      {view === 'landing' ? (
        <LandingPage onLogin={() => setView('login')} />
      ) : view === 'login' ? (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-violet-600/20 blur-[120px] rounded-full"></div>

          <Card className="w-full max-w-md bg-slate-800 border-slate-700/50 text-white relative z-10 shadow-2xl">
            <CardHeader className="text-center relative">
              <button onClick={() => setView('landing')} className="absolute top-8 left-8 text-slate-500 hover:text-white transition-colors">
                <ArrowRight className="rotate-180" size={24} />
              </button>
              <div className="flex flex-col items-center gap-4">
                <TapifyLogo className="w-16 h-16" iconSize={24} />
                <CardTitle className="text-2xl uppercase tracking-tighter">Identity Access</CardTitle>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Authorized Personnel Only</p>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label>Email ID</Label>
                  <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required placeholder="e.g. member1@tapify.co" className="bg-slate-700/50 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label>Passcode</Label>
                  <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required placeholder="••••••••" className="bg-slate-700/50 border-slate-600 text-white" />
                </div>
                {error && <p className="text-center text-[10px] font-black uppercase py-3 rounded-2xl bg-red-400/10 text-red-400 flex items-center justify-center gap-2"><ShieldAlert size={12} /> {error}</p>}
                <Button type="submit" className="w-full h-16">Enter Identity Lab</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView(currentUser?.isAdmin ? 'admin' : 'editor')}>
              <TapifyLogo className="w-10 h-10" iconSize={20} />
              <span className="font-black text-2xl tracking-tighter uppercase">TAP<span className="text-indigo-600">IFY</span></span>
            </div>
            <div className="flex items-center gap-3">
               {currentUser?.isAdmin && (
                 <button 
                  onClick={() => setView(view === 'admin' ? 'editor' : 'admin')}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${view === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
                 >
                   {view === 'admin' ? <LayoutIcon size={14} /> : <ShieldPlus size={14} />}
                   {view === 'admin' ? 'Design Lab' : 'System Hub'}
                 </button>
               )}
               <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
               <Button onClick={() => setIsShareModalOpen(true)} className="bg-slate-900 hover:bg-black font-bold h-11 px-6 text-xs shadow-xl uppercase tracking-widest">Share</Button>
            </div>
          </header>
          
          <main className="flex-1 flex flex-col h-[calc(100vh-75px-env(safe-area-inset-bottom))] overflow-hidden relative">
            {view === 'admin' ? (
              <div className="flex-1 overflow-y-auto bg-slate-50">
                <AdminDashboard onEditCard={(card) => { setEditingCard(card); setView('editor'); }} onViewEditor={() => setView('editor')} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col md:flex-row h-full">
                <div className={`flex-1 overflow-y-auto p-6 md:p-12 bg-white ${activeMobileTab !== 'editor' && 'hidden md:block'}`}>
                  <div className="max-w-3xl mx-auto pb-32">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase mb-10">Identity Lab</h2>
                    {editingCard && <Editor data={editingCard} onChange={updateCard} />}
                  </div>
                </div>
                <div className={`w-full md:w-[480px] bg-slate-50 border-l border-slate-200 flex flex-col ${activeMobileTab === 'editor' && 'hidden md:flex'}`}>
                  <div className="p-8 border-b border-slate-200 bg-white/50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Identity Preview</p>
                    {editingCard && <BusinessCard data={editingCard} />}
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest flex items-center gap-2"><Wand2 size={12} /> AI Consultant</span>
                       <Button variant={isConnected ? "destructive" : "default"} size="sm" onClick={isConnected ? disconnect : connect} className="h-8 px-4 text-[9px]">{isConnected ? "Stop" : "Consult AI"}</Button>
                    </div>
                    {transcription.map((line, i) => (
                      <div key={i} className={`p-4 rounded-2xl text-[11px] font-bold ${line.startsWith('User:') ? 'bg-indigo-600 text-white ml-8' : 'bg-white border text-slate-700 mr-8'}`}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-200 flex items-center justify-around py-4 safe-bottom z-50">
              <button onClick={() => setActiveMobileTab('editor')} className={`flex flex-col items-center gap-1.5 ${activeMobileTab === 'editor' ? 'text-indigo-600' : 'text-slate-400'}`}><Edit3 size={24} /><span className="text-[9px] font-black uppercase tracking-widest">Lab</span></button>
              <button onClick={() => setActiveMobileTab('preview')} className={`flex flex-col items-center gap-1.5 ${activeMobileTab === 'preview' ? 'text-indigo-600' : 'text-slate-400'}`}><Eye size={24} /><span className="text-[9px] font-black uppercase tracking-widest">View</span></button>
              <button onClick={() => setActiveMobileTab('ai')} className={`flex flex-col items-center gap-1.5 ${activeMobileTab === 'ai' ? 'text-indigo-600' : 'text-slate-400'}`}><Wand2 size={24} /><span className="text-[9px] font-black uppercase tracking-widest">Consult</span></button>
            </nav>
          </main>
          {isShareModalOpen && editingCard && <ShareModal data={editingCard} onClose={() => setIsShareModalOpen(false)} />}
        </>
      )}
    </div>
  );
};

export default App;
