
import React from 'react';
import { Zap, Smartphone, Wand2, ShieldCheck, ArrowRight, LogIn, UserPlus, Mail } from 'lucide-react';
import BusinessCard from './BusinessCard';
import { BusinessCardData } from '../types';
import { TapifyLogo } from '../App';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onSocialStart: (platform: 'google' | 'icloud') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin, onSocialStart }) => {
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TapifyLogo className="w-9 h-9" iconSize={18} />
          <span className="font-black text-xl tracking-tighter uppercase">TAP<span className="text-indigo-600">IFY</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
            <LogIn size={14} /> Login
          </button>
          <button onClick={onStart} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
            Sign Up
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
            Create high-end digital business cards with Gemini AI. Share via NFC, QR, or smart link in seconds.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={onStart} 
              className="group bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-4"
            >
              <Mail size={20} /> Register with Email <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-4 opacity-40">
              <div className="h-px w-8 bg-slate-300"></div>
              <span className="text-[9px] font-black uppercase tracking-widest">Or Social Sync</span>
              <div className="h-px w-8 bg-slate-300"></div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => onSocialStart('google')}
                className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button 
                onClick={() => onSocialStart('icloud')}
                className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.33 17 3.5 12.3 5.45 9c1.07-1.8 2.76-2.86 4.5-2.86 1.43 0 2.22.7 3.23.7.92 0 1.95-.77 3.53-.7 1.62.07 2.87.6 3.65 1.76-3.23 1.9-2.7 5.9.52 7.22-.63 1.6-1.47 3.2-3.83 5.16zM12.03 6c-.2 2.16-1.9 3.84-3.83 3.75-.24-2.13 1.83-4.14 4.04-4.16.2.2.33.27.42.41z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

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
           <a href="#" className="hover:text-indigo-600">Privacy</a>
           <a href="#" className="hover:text-indigo-600">Terms</a>
           <a href="#" className="hover:text-indigo-600">Support</a>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
