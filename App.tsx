
import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, User as UserIcon, Settings, Share2, ShieldCheck, Database, Layout as LayoutIcon, Wand2, Edit3, Eye, LogIn, UserPlus, Mail, Shield, CheckCircle2, ArrowRight, RefreshCw, Smartphone, AlertCircle, X, ShieldAlert, FileText, Lock, Download, UserPlus2, KeyRound, Radio } from 'lucide-react';
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

const TermsModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
    <div className="w-full max-w-2xl bg-white rounded-t-[3rem] sm:rounded-[3rem] max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TapifyLogo className="w-12 h-12" iconSize={24} />
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Legal Terms</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version 3.1 • Updated Jan 2025</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
        <section>
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <FileText size={18} />
            <h3 className="font-black uppercase tracking-widest text-xs">Platform Guidelines</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">By creating a Tapify Identity, you agree to our professional standards. We provide a space for digital expression, but malicious usage or impersonation is strictly prohibited.</p>
        </section>
        <section>
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <Lock size={18} />
            <h3 className="font-black uppercase tracking-widest text-xs">Privacy Assurance</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">We protect your identity data. We do not sell user profiles to third-party data brokers. Your contact details are yours to share or withhold.</p>
        </section>
      </div>
      <div className="p-8 bg-slate-50">
        <Button onClick={onClose} className="w-full h-14">Acknowledge</Button>
      </div>
    </div>
  </div>
);

const SocialLoginOverlay = ({ platform, onSelect, onCancel, agreed, setAgreed, onViewTerms }: any) => {
  const accounts = platform === 'google' 
    ? ['j.smith@gmail.com', 'work.jordan@gmail.com'] 
    : ['smith_jordan@icloud.com'];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="flex flex-col items-center mb-6">
            {platform === 'google' ? (
              <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            ) : (
              <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.33 17 3.5 12.3 5.45 9c1.07-1.8 2.76-2.86 4.5-2.86 1.43 0 2.22.7 3.23.7.92 0 1.95-.77 3.53-.7 1.62.07 2.87.6 3.65 1.76-3.23 1.9-2.7 5.9.52 7.22-.63 1.6-1.47 3.2-3.83 5.16zM12.03 6c-.2 2.16-1.9 3.84-3.83 3.75-.24-2.13 1.83-4.14 4.04-4.16.2.2.33.27.42.41z"/>
              </svg>
            )}
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Sync Identity</h4>
            <p className="text-xs text-slate-500 font-medium">Auto-fill your professional profile</p>
          </div>

          <div className="space-y-3 mb-6">
            {accounts.map(email => (
              <button 
                key={email}
                disabled={!agreed}
                onClick={() => onSelect(email)}
                className="w-full p-4 flex items-center gap-4 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:grayscale border border-slate-100 rounded-2xl transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase">{email[0]}</div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">{email}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Tap to sync</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
            <label className="flex items-start gap-3 text-left cursor-pointer group">
              <input 
                type="checkbox" 
                checked={agreed} 
                onChange={(e) => { triggerHaptic('light'); setAgreed(e.target.checked); }} 
                className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-[10px] font-bold text-slate-500 leading-normal uppercase tracking-tight">
                Agree to <button onClick={(e) => { e.stopPropagation(); onViewTerms(); }} className="text-indigo-600 hover:underline">Terms</button> & <button onClick={(e) => { e.stopPropagation(); onViewTerms(); }} className="text-indigo-600 hover:underline">Privacy</button>.
              </span>
            </label>
          </div>

          <button onClick={onCancel} className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-red-500 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const PublicProfile = ({ data }: { data: BusinessCardData }) => {
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 text-center mb-12">
          <TapifyLogo className="w-12 h-12" iconSize={24} />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Verified Identity</p>
        </div>
        <div className="w-full drop-shadow-[0_40px_100px_rgba(79,70,229,0.12)] mb-12">
          <BusinessCard data={data} scale={1} />
        </div>
        <button onClick={downloadVCard} className="w-full max-w-xs h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-3 hover:bg-black transition-all">
          <UserPlus2 size={18} /> Save to Contacts
        </button>
        <a href={window.location.origin} className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors pt-8">
          Get your <span className="text-indigo-600">Tapify</span> card
        </a>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [view, setView] = useState<ViewState>(currentUser ? 'editor' : 'landing');
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview' | 'ai'>('editor');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [editingCard, setEditingCard] = useState<BusinessCardData | null>(null);
  const [activeSocialLogin, setActiveSocialLogin] = useState<'google' | 'icloud' | null>(null);
  const [publicCard, setPublicCard] = useState<BusinessCardData | null>(null);
  const [authContext, setAuthContext] = useState<'signup' | 'reset' | 'social'>('signup');

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [showSimulatedEmail, setShowSimulatedEmail] = useState(false);

  const { isConnected, connect, disconnect, transcription, error: aiError } = useLiveChat(
    "You are a professional business card consultant for Tapify. Help the user refine their title, bio, and company description."
  );

  useEffect(() => {
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

  const triggerVerification = (targetEmail: string, context: 'signup' | 'reset' | 'social') => {
    setEmail(targetEmail);
    setAuthContext(context);
    triggerHaptic('medium');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setShowSimulatedEmail(true);
    setView('enter_otp');
    setTimeout(() => setShowSimulatedEmail(false), 15000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      storage.setCurrentUser(user);
      setCurrentUser(user);
      setView('editor');
    } else {
      triggerHaptic('error');
      setError('Incorrect email or password.');
    }
  };

  const handleSocialSelect = (selectedEmail: string) => {
    if (!agreedToTerms) return;
    setActiveSocialLogin(null);
    const users = storage.getUsers();
    const user = users.find(u => u.email === selectedEmail);
    if (user) {
      storage.setCurrentUser(user);
      setCurrentUser(user);
      setView('editor');
    } else {
      triggerVerification(selectedEmail, 'social');
    }
  };

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      triggerHaptic('error');
      setError('Please agree to terms to proceed.');
      return;
    }
    setError('');
    const users = storage.getUsers();
    if (users.find(u => u.email === email)) {
      setView('login');
      setError('Account already exists. Please login.');
      return;
    }
    triggerVerification(email, 'signup');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === generatedCode) {
      triggerHaptic('success');
      if (authContext === 'signup') setView('register');
      else if (authContext === 'social') {
        const users = storage.getUsers();
        let user = users.find(u => u.email === email);
        if (!user) {
          user = { id: 'u_' + Math.random().toString(36).substr(2, 7), email: email, isAdmin: false, isVerified: true };
          storage.saveUsers([...users, user]);
        }
        storage.setCurrentUser(user);
        setCurrentUser(user);
        setView('editor');
      } else if (authContext === 'reset') setView('reset_password');
    } else {
      triggerHaptic('error');
      setError('Invalid code.');
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');
    const users = storage.getUsers();
    const newUser: User = { id: 'u_' + Math.random().toString(36).substr(2, 7), email, password, isAdmin: false, isVerified: true };
    storage.saveUsers([...users, newUser]);
    storage.setCurrentUser(newUser);
    setCurrentUser(newUser);
    setView('editor');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
      users[userIndex].password = password;
      storage.saveUsers(users);
      setView('login');
      setError('Password reset complete. Please login.');
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

  if (publicCard) return <PublicProfile data={publicCard} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden safe-bottom">
      {activeSocialLogin && (
        <SocialLoginOverlay 
          platform={activeSocialLogin} onSelect={handleSocialSelect} onCancel={() => setActiveSocialLogin(null)} 
          agreed={agreedToTerms} setAgreed={setAgreedToTerms} onViewTerms={() => setIsTermsOpen(true)}
        />
      )}
      {isTermsOpen && <TermsModal onClose={() => setIsTermsOpen(false)} />}
      {showSimulatedEmail && (
        <div className="fixed top-8 left-6 right-6 z-[250] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0"><Mail size={24} /></div>
            <div>
              <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">TAPIFY SECURITY</p>
              <p className="text-sm font-bold text-slate-900">Code for <span className="font-black">{email}</span>: <span className="text-indigo-600 text-xl font-black ml-1">{generatedCode}</span></p>
            </div>
          </div>
        </div>
      )}

      {view === 'landing' ? (
        <LandingPage onStart={() => setView('verify_email')} onLogin={() => setView('login')} onSocialStart={(p) => setActiveSocialLogin(p)} />
      ) : ['login', 'verify_email', 'enter_otp', 'register', 'forgot_password', 'reset_password'].includes(view) ? (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-violet-600/20 blur-[120px] rounded-full"></div>

          <Card className="w-full max-w-md bg-slate-800 border-slate-700/50 text-white relative z-10 shadow-2xl">
            <CardHeader className="text-center relative">
              <button onClick={() => { setAgreedToTerms(false); setView('landing'); }} className="absolute top-8 left-8 text-slate-500 hover:text-white transition-colors">
                <ArrowRight className="rotate-180" size={24} />
              </button>
              <div className="flex flex-col items-center gap-4">
                <TapifyLogo className="w-16 h-16" iconSize={24} />
                <CardTitle className="text-2xl uppercase tracking-tighter">
                  {view === 'login' ? 'Hub Access' : view === 'forgot_password' ? 'Identity Recovery' : view === 'reset_password' ? 'Set Secure Pass' : 'Identity Creation'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              {view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required placeholder="you@tapify.co" className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><Label>Password</Label><button type="button" onClick={() => setView('forgot_password')} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Forgot?</button></div>
                    <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required placeholder="••••••••" className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  {error && <p className="text-center text-[10px] font-black uppercase py-3 rounded-2xl bg-red-400/10 text-red-400">{error}</p>}
                  <Button type="submit" className="w-full h-16">Enter Identity Lab</Button>
                  <button onClick={() => setView('verify_email')} className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-indigo-400">Join Tapify</button>
                </form>
              )}

              {view === 'verify_email' && (
                <form onSubmit={handleStartVerification} className="space-y-6">
                  <div className="space-y-2"><Label>Professional Email</Label><Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required placeholder="Enter your email ID" className="bg-slate-700/50 border-slate-600 text-white" /></div>
                  <div className="bg-slate-700/30 p-4 rounded-2xl border border-slate-600">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-500 bg-slate-700 text-indigo-600" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">I agree to the <button onClick={() => setIsTermsOpen(true)} className="text-indigo-400">Terms & Privacy</button>.</span>
                    </label>
                  </div>
                  {error && <p className="text-red-400 text-[10px] font-black uppercase text-center bg-red-400/10 py-3 rounded-2xl">{error}</p>}
                  <Button type="submit" className="w-full h-16" disabled={!agreedToTerms}>Register Identity</Button>
                </form>
              )}

              {view === 'enter_otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-6 text-center">
                  <Label>Verification Code Sent to {email}</Label>
                  <Input type="text" maxLength={6} value={verificationCode} onChange={(e: any) => setVerificationCode(e.target.value.replace(/\D/g, ''))} className="bg-slate-700/50 border-slate-600 text-white text-center text-4xl tracking-widest h-20" />
                  <Button type="submit" className="w-full h-16 mt-4">Confirm Identity</Button>
                  <button type="button" onClick={() => triggerVerification(email, authContext)} className="w-full mt-4 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><RefreshCw size={12} /> Resend</button>
                </form>
              )}

              {view === 'register' && (
                <form onSubmit={handleCompleteRegistration} className="space-y-6">
                  <Label>Finalize Lab Password</Label>
                  <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required placeholder="Create a password" className="bg-slate-700/50 border-slate-600 text-white" />
                  <Button type="submit" className="w-full h-16">Launch Experience</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('editor')}>
              <TapifyLogo className="w-10 h-10" iconSize={20} />
              <span className="font-black text-2xl tracking-tighter uppercase">TAP<span className="text-indigo-600">IFY</span></span>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
               <Button onClick={() => setIsShareModalOpen(true)} className="bg-slate-900 hover:bg-black font-bold h-11 px-6 text-xs shadow-xl uppercase tracking-widest">Share</Button>
            </div>
          </header>
          <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-75px-env(safe-area-inset-bottom))] overflow-hidden relative">
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
