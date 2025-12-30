
import React, { useState } from 'react';
import { Camera, Sun, Moon, Sparkles, Layers, Zap, Palette, FileText, Award, Smartphone, Monitor, Briefcase, Code, Maximize, Scissors, Wallet, ShoppingCart, Globe, Share2, AtSign, MapPin, Hash, Mail, MessageCircle, ExternalLink, Type, Languages, RefreshCw, CreditCard, CheckCircle2, Facebook, Instagram, Image as ImageIcon, Trash2, Download } from 'lucide-react';
import { BusinessCardData, CardTemplate, CardTheme, CardOrientation, CardLanguage } from '../types';
import AIImageModifier from './AIImageModifier';
import { GoogleGenAI } from '@google/genai';
import { storage } from '../services/auth';

interface EditorProps {
  data: BusinessCardData;
  onChange: (newData: BusinessCardData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    onChange({ ...data, [name]: val });
    setIsSaved(false);
  };

  const handleManualSave = () => {
    setIsSaved(true);
    storage.addLog({
      userId: data.userId,
      userEmail: data.email,
      action: 'SAVE',
      details: `Card design updated for ${data.name}`
    });
    setTimeout(() => setIsSaved(false), 3000);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'backgroundUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, [field]: reader.result as string });
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const translateWithAI = async () => {
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const targetLang = data.language === 'ne' ? 'Nepali (Devanagari script)' : 'English';
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following professional profile fields into ${targetLang}. Keep the meaning professional and formal. Output ONLY a valid JSON object with the fields: name, title, company, address, bio.
        
        Fields to translate:
        Name: ${data.name}
        Title: ${data.title}
        Company: ${data.company}
        Address: ${data.address}
        Bio: ${data.bio}`,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const translated = JSON.parse(response.text);
      onChange({
        ...data,
        ...translated
      });

      storage.addLog({
        userId: data.userId,
        userEmail: data.email,
        action: 'AI_TRANSLATE',
        details: `Profile translated to ${data.language === 'ne' ? 'Nepali' : 'English'}`
      });

    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const templates: { id: CardTemplate; label: string; icon: React.ReactNode }[] = [
    { id: 'modern', label: 'Modern', icon: <Monitor size={12} /> },
    { id: 'classic', label: 'Classic', icon: <FileText size={12} /> },
    { id: 'creative', label: 'Creative', icon: <Palette size={12} /> },
    { id: 'minimal', label: 'Minimal', icon: <Scissors size={12} /> },
    { id: 'executive', label: 'Executive', icon: <Briefcase size={12} /> },
    { id: 'tech', label: 'Tech', icon: <Code size={12} /> },
    { id: 'bold', label: 'Bold', icon: <Maximize size={12} /> },
    { id: 'sleek', label: 'Sleek', icon: <Zap size={12} /> },
  ];

  const fonts = [
    { name: 'Inter', family: "'Inter', sans-serif", category: 'Modern' },
    { name: 'Playfair', family: "'Playfair Display', serif", category: 'Classic' },
    { name: 'Outfit', family: "'Outfit', sans-serif", category: 'Clean' },
    { name: 'Mono', family: "'JetBrains Mono', monospace", category: 'Tech' },
    { name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'Standard' },
    { name: 'Unbounded', family: "'Unbounded', sans-serif", category: 'Bold' },
    { name: 'Syne', family: "'Syne', sans-serif", category: 'Artistic' },
    { name: 'Space', family: "'Space Grotesk', sans-serif", category: 'Edgy' },
    { name: 'Fraunces', family: "'Fraunces', serif", category: 'Elegant' },
    { name: 'Hind', family: "'Hind', sans-serif", category: 'Nepali' },
    { name: 'Mukta', family: "'Mukta', sans-serif", category: 'Nepali' },
  ];

  const visualThemes: { id: CardTheme; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun size={14} /> },
    { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
    { id: 'glass', label: 'Glass', icon: <Layers size={14} /> },
    { id: 'mesh', label: 'Mesh', icon: <Sparkles size={14} /> },
    { id: 'neon', label: 'Neon', icon: <Zap size={14} /> },
    { id: 'aurora', label: 'Aurora', icon: <Palette size={14} /> },
    { id: 'retro', label: 'Retro', icon: <FileText size={14} /> },
    { id: 'gold', label: 'Premium', icon: <Award size={14} /> },
  ];

  return (
    <div className="space-y-12 pb-20">
      <section className="bg-indigo-600/5 p-6 rounded-[2rem] border border-indigo-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Languages className="text-indigo-600" size={20} />
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Language Identity</h3>
          </div>
          <div className="flex bg-white/50 p-1 rounded-xl border border-indigo-50">
            <button 
              onClick={() => onChange({ ...data, language: 'en', fontFamily: "'Inter', sans-serif" })}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${data.language !== 'ne' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600'}`}
            >
              English
            </button>
            <button 
              onClick={() => onChange({ ...data, language: 'ne', fontFamily: "'Hind', sans-serif" })}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${data.language === 'ne' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600'}`}
            >
              नेपाली
            </button>
          </div>
        </div>
        <button 
          onClick={translateWithAI}
          disabled={isTranslating}
          className="w-full h-12 bg-white border border-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50"
        >
          {isTranslating ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
          {isTranslating ? 'Translating...' : `Translate Profile to ${data.language === 'ne' ? 'नेपाली' : 'English'}`}
        </button>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">1. Layout & Templates</h3>
           <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button 
                onClick={() => onChange({ ...data, orientation: 'landscape' })}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${data.orientation === 'landscape' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400'}`}
              >
                Landscape
              </button>
              <button 
                onClick={() => onChange({ ...data, orientation: 'portrait' })}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${data.orientation === 'portrait' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400'}`}
              >
                Portrait
              </button>
           </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ ...data, template: t.id })}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-[2rem] text-[9px] font-black uppercase transition-all border-2 ${
                data.template === t.id ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">2. Brand Aesthetics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {visualThemes.map((vt) => (
            <button
              key={vt.id}
              onClick={() => onChange({ ...data, theme: vt.id })}
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${
                data.theme === vt.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
              }`}
            >
              {vt.icon}
              {vt.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Palette size={20} /></div>
             <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Brand Accent</label>
                <div className="flex items-center gap-3">
                   <input type="color" name="themeColor" value={data.themeColor} onChange={handleChange} className="w-10 h-10 rounded-xl border-0 cursor-pointer p-0 bg-transparent" />
                   <span className="text-sm font-mono font-bold text-slate-600">{data.themeColor.toUpperCase()}</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Maximize size={20} /></div>
             <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Backdrop Blur</label>
                <div className="flex items-center gap-3">
                   <input 
                      type="range" 
                      min="0" max="20" step="1"
                      value={data.backgroundBlur || 0} 
                      onChange={(e) => onChange({ ...data, backgroundBlur: parseInt(e.target.value) })} 
                      className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                   />
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
           <div className="flex items-center gap-3">
              <ImageIcon className="text-indigo-600" size={20} />
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">External Backdrop Source</h4>
           </div>
           <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                 <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Globe size={16} /></div>
                 <input 
                    name="backgroundUrl" 
                    value={data.backgroundUrl || ''} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-50 outline-none" 
                    placeholder="External Image URL (HTTPS)" 
                 />
              </div>
              <div className="relative group">
                 <button className="h-12 px-6 gap-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center">
                    <Download size={14} /> Upload Pattern
                 </button>
                 <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'backgroundUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
           </div>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">3. Identity Core</h3>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30 relative group">
            {data.profileImage ? (
              <img src={data.profileImage} className="w-32 h-32 rounded-[2.5rem] object-cover border-8 border-white shadow-2xl mb-4" />
            ) : (
              <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-4"><Camera size={40} /></div>
            )}
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Portrait</p>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profileImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={data.name} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm" placeholder="Full Name" />
            <input name="title" value={data.title} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm" placeholder="Title" />
            <input name="company" value={data.company} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm" placeholder="Company" />
            <input name="address" value={data.address} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm" placeholder="Location" />
          </div>
          <textarea 
            name="bio" value={data.bio} onChange={handleChange} rows={3} 
            className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm resize-none" 
            placeholder="Identity Bio..."
          />
        </div>
        {data.profileImage && <AIImageModifier currentImage={data.profileImage} onUpdate={(img) => onChange({ ...data, profileImage: img })} />}
      </section>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={handleManualSave}
          className={`h-14 px-10 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center gap-3 ${isSaved ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
          {isSaved ? <CheckCircle2 size={18} /> : <RefreshCw size={18} />}
          {isSaved ? 'Identity Synced' : 'Commit Changes'}
        </button>
      </div>
    </div>
  );
};

export default Editor;
