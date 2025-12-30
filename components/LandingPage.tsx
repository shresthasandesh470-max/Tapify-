
import React from 'react';
import { Radio, Zap, Smartphone, Wand2, ShieldCheck, ArrowRight, LogIn, UserPlus } from 'lucide-react';
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
    name: 'Alexander Rivers',
    title: 'Senior Creative Lead',
    company: 'TAPIFY Labs',
    email: 'alex@tapify.co',
    phone: '+1 (555) 000-1234',
    website: 'tapify.co',
    linkedin: 'alexrivers',
    twitter: 'alextapify',
    address: 'San Francisco, CA',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    themeColor: '#6366f1',
    template: 'sleek',
    theme: 'glass',
    orientation: 'landscape',
    bio: 'Pioneering digital experiences through minimal design and AI.',
    createdAt: Date.now()
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TapifyLogo className="w-9 h-9" iconSize={18} />
          <span className="font-black text-xl tracking-tighter uppercase">TAP<span className="text-indigo-600">IFY</span></span>
        </div>
        <button onClick={onLogin} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
          <LogIn size={14} /> Hub Login
        </button>
      </nav>

      <header className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 animate-bounce">
            <Zap size={12} fill="currentColor" /> NFC & AI Brand Flow Active
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-8 text-slate-900">
            Tappable<br/>
            <span className="text-indigo-600">Identities</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg mb-12">
            Create premium digital identities. Share your profile with a simple tap via NFC, QR, or secure link. Built with Gemini AI.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button 
                onClick={() => onSocialStart('google')}
                className="group flex items-center gap-3 bg-white border border-slate-200 px-8 py-4 rounded-2xl shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-bold text-slate-900">TAPIFY with Google</span>
              </button>

              <button 
                onClick={() => onSocialStart('icloud')}
                className="group flex items-center gap-3 bg-slate-900 px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl hover:translate-y-[-2px] transition-all"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.33 17 3.5 12.3 5.45 9c1.07-1.8 2.76-2.86 4.5-2.86 1.43 0 2.22.7 3.23.7.92 0 1.95-.77 3.53-.7 1.62.07 2.87.6 3.65 1.76-3.23 1.9-2.7 5.9.52 7.22-.63 1.6-1.47 3.2-3.83 5.16zM12.03 6c-.2 2.16-1.9 3.84-3.83 3.75-.24-2.13 1.83-4.14 4.04-4.16.2.2.33.27.42.41z"/>
                </svg>
                <span className="text-sm font-bold text-white">TAPIFY with Apple</span>
              </button>
            </div>

            <button onClick={onStart} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors">
              Continue with Professional Email
            </button>
          </div>
        </div>
      </header>

      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
             <div className="drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.02] duration-500">
               <BusinessCard data={demoCard} />
             </div>
          </div>
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-[0.9] text-slate-900">
              Professional DNA,<br/>
              <span className="text-indigo-600">Synchronized.</span>
            </h2>
            <div className="space-y-6">
              {[
                { icon: <Smartphone />, title: "One-Tap NFC", desc: "Write your profile to any NFC chip and share with a simple proximity gesture." },
                { icon: <Wand2 />, title: "Gemini AI Design", desc: "Consult our brand AI to refine your bio and optimize your professional imagery." },
                { icon: <ShieldCheck />, title: "Identity Vault", desc: "Military-grade encryption for your professional data and secure social bridges." }
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-indigo-600 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wider text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={onStart} 
              className="mt-8 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3"
            >
              Start Your Journey <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-slate-100 text-center px-6">
         <div className="flex items-center justify-center gap-3 mb-6">
            <TapifyLogo className="w-7 h-7" iconSize={14} />
            <span className="font-black text-lg tracking-tighter uppercase">TAP<span className="text-indigo-600">IFY</span></span>
         </div>
         <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mb-4">The Future of Identity Networking</p>
         <div className="flex justify-center gap-8 text-[10px] font-black uppercase text-slate-500 tracking-widest">
           <a href="#" className="hover:text-indigo-600">Privacy</a>
           <a href="#" className="hover:text-indigo-600">Terms</a>
           <a href="#" className="hover:text-indigo-600">Support</a>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
