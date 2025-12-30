
import React, { useState, useEffect } from 'react';
import { Zap, Smartphone, Wand2, ShieldCheck, ArrowRight, LogIn, Lock, Wallet, Trash2, ChevronRight, User } from 'lucide-react';
import BusinessCard from './BusinessCard';
import { BusinessCardData } from '../types';
import { storage } from '../services/auth';
import { TapifyLogo } from '../App';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [savedCards, setSavedCards] = useState<BusinessCardData[]>([]);
  const [selectedWalletCard, setSelectedWalletCard] = useState<BusinessCardData | null>(null);

  useEffect(() => {
    setSavedCards(storage.getSavedCards());
  }, []);

  const demoCard: BusinessCardData = {
    id: 'demo',
    userId: 'demo',
    name: 'Julian Vane',
    title: 'Architect of Identity',
    company: 'TAPIFY Labs',
    email: 'julian@tapify.co',
    phone: '+1 (555) 888-0000',
    website: 'tapify.co',
    linkedin: 'julianvane',
    twitter: 'j_vane',
    address: 'New York City, NY',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    themeColor: '#6366f1',
    template: 'executive',
    theme: 'gold',
    orientation: 'landscape',
    bio: 'Crafting the next generation of professional connectivity.',
    createdAt: Date.now()
  };

  const removeCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove from wallet?')) {
      storage.removeFromWallet(id);
      setSavedCards(storage.getSavedCards());
    }
  };

  if (selectedWalletCard) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto">
        <div className="p-8 max-w-xl mx-auto flex flex-col items-center justify-center min-h-screen">
          <button 
            onClick={() => setSelectedWalletCard(null)}
            className="self-start mb-12 p-3 bg-white shadow-xl rounded-full text-slate-900 hover:scale-110 transition-transform"
          >
            <ArrowRight className="rotate-180" size={24} />
          </button>
          <div className="w-full drop-shadow-[0_40px_100px_rgba(79,70,229,0.12)] mb-12">
            <BusinessCard data={selectedWalletCard} scale={1} />
          </div>
          <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] mb-4">Offline Wallet Sync</p>
          <div className="w-full flex gap-3">
             <a 
              href={`mailto:${selectedWalletCard.email}`}
              className="flex-1 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100"
             >
               Contact via Email
             </a>
             <button 
              onClick={() => setSelectedWalletCard(null)}
              className="flex-1 h-14 bg-white border border-slate-200 text-slate-900 rounded-2xl flex items-center justify-center font-black uppercase text-[10px] tracking-widest shadow-sm"
             >
               Close Wallet
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TapifyLogo className="w-9 h-9" iconSize={18} />
          <span className="font-black text-xl tracking-tighter uppercase">TAP<span className="text-indigo-600">IFY</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-2">
            <LogIn size={14} /> Login
          </button>
        </div>
      </nav>

      <header className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10"></div>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-10">
            <Zap size={12} fill="currentColor" /> Premium Digital Identity Platform
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-10 text-slate-900">
            Design Your<br/>
            <span className="text-indigo-600">Legacy.</span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 font-medium text-lg mb-12 leading-relaxed">
            Authorized digital business card ecosystem. High-end professional identities powered by Gemini AI.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={onLogin} 
              className="group bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-4"
            >
              <Lock size={20} /> Access Identity Hub <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Restricted to Provisioned Accounts Only</p>
          </div>
        </div>
      </header>

      {savedCards.length > 0 && (
        <section className="bg-indigo-600 py-20 px-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
               <div>
                 <div className="flex items-center gap-3 text-white/60 mb-2">
                   <Wallet size={18} />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">My Digital Wallet</h3>
                 </div>
                 <h2 className="text-4xl font-black text-white tracking-tight uppercase">Saved Identities</h2>
               </div>
               <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white font-black">
                 {savedCards.length}
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCards.map(card => (
                <div 
                  key={card.id} 
                  onClick={() => setSelectedWalletCard(card)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-6 hover:bg-white/20 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl shrink-0">
                      <img src={card.profileImage} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-black uppercase text-sm tracking-tight">{card.name}</p>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest truncate max-w-[120px]">{card.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => removeCard(card.id, e)}
                      className="p-3 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight className="text-white/40 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-32">
          <div className="flex-1">
             <div className="drop-shadow-[0_60px_100px_rgba(0,0,0,0.1)] perspective-[2000px]">
               <BusinessCard data={demoCard} />
             </div>
          </div>
          <div className="flex-1 space-y-10">
            <h2 className="text-5xl font-black tracking-tight uppercase leading-[0.9] text-slate-900">
              Your Network,<br/>
              <span className="text-indigo-600">Upgraded.</span>
            </h2>
            <div className="grid gap-8">
              {[
                { icon: <Smartphone />, title: "NFC Pulse", desc: "Instantly write your unique card URL to any NFC tag. No app required for recipients." },
                { icon: <Wand2 />, title: "AI Image Engine", desc: "Use Gemini to professionally enhance and edit your portrait directly in our lab." },
                { icon: <ShieldCheck />, title: "Privacy First", desc: "Full control over your data. No hidden tracking, just professional excellence." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-indigo-600 shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm uppercase tracking-widest text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-slate-100 text-center px-6">
         <div className="flex flex-col items-center gap-4 mb-10">
            <TapifyLogo className="w-12 h-12" iconSize={24} />
            <span className="font-black text-2xl tracking-tighter uppercase">TAP<span className="text-indigo-600">IFY</span></span>
         </div>
         <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.4em] mb-8">Elevating Identity Globally</p>
         <div className="flex justify-center gap-12 text-[10px] font-black uppercase text-slate-500 tracking-widest">
           <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
           <a href="#" className="hover:text-indigo-600">Terms of Use</a>
           <a href="#" className="hover:text-indigo-600">Admin Support</a>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
