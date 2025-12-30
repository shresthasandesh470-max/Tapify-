
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
    // Fix: use boolean false instead of null
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

  const handleOrderCard = () => {
    storage.addLog({
      userId: data.userId,
      userEmail: data.email,
      action: 'ORDER_NFC',
      details: `Physical card order initiated for ${data.name}`
    });
    const shareUrl = window.location.origin + '?card=' + data.id;
    const message = `Hi, I just designed a digital business card on TAPIFY and I'd like to order a physical NFC version!\n\nName: ${data.name}\nTitle: ${data.title}\nCard Link: ${shareUrl}`;
    const waUrl = `https://wa.me/96879398307?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Language Selection */}
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
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-4">
          Switching language will optimize fonts for native script. Use AI to professionally translate your profile.
        </p>
        <button 
          onClick={translateWithAI}
          disabled={isTranslating}
          className="w-full h-12 bg-white border border-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50"
        >
          {isTranslating ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
          {isTranslating ? 'Translating...' : `Translate Profile to ${data.language === 'ne' ? 'नेपाली' : 'English'}`}
        </button>
      </section>

      {/* 1. Design & Layout */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">1. Layout & Dimensions</h3>
           <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => onChange({ ...data, orientation: 'landscape' })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${data.orientation === 'landscape' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Monitor size={12} /> Landscape
              </button>
              <button 
                onClick={() => onChange({ ...data, orientation: 'portrait' })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${data.orientation === 'portrait' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Smartphone size={12} /> Portrait
              </button>
           </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ ...data, template: t.id })}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-[2rem] text-[9px] font-black uppercase transition-all border-2 ${
                data.template === t.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-[0.98]'
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={data.template === t.id ? "text-indigo-400" : "opacity-30"}>{t.icon}</div>
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">
            <Type size={14} /> Typography Selection
          </label>
          <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-2 px-2">
            {fonts.map((f) => (
              <button
                key={f.name}
                onClick={() => onChange({ ...data, fontFamily: f.family })}
                style={{ fontFamily: f.family }}
                className={`px-6 py-4 rounded-2xl text-xs font-bold transition-all border-2 whitespace-nowrap shrink-0 ${
                  data.fontFamily === f.family || (!data.fontFamily && f.name === 'Inter')
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">{f.category}</div>
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Brand Visuals & Backdrop */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">2. Brand Aesthetics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {visualThemes.map((vt) => (
            <button
              key={vt.id}
              onClick={() => onChange({ ...data, theme: vt.id })}
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${
                data.theme === vt.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl'
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
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
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Brand Accent Color</label>
                <div className="flex items-center gap-3">
                   <input type="color" name="themeColor" value={data.themeColor} onChange={handleChange} className="w-10 h-10 rounded-xl border-0 cursor-pointer p-0 bg-transparent" />
                   <span className="text-sm font-mono font-bold text-slate-600">{data.themeColor.toUpperCase()}</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Maximize size={20} /></div>
             <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Backdrop Blur Intensity</label>
                <div className="flex items-center gap-3">
                   <input 
                      type="range" 
                      name="backgroundBlur" 
                      min="0" 
                      max="20" 
                      step="1"
                      value={data.backgroundBlur || 0} 
                      onChange={(e) => onChange({ ...data, backgroundBlur: parseInt(e.target.value) })} 
                      className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                   />
                   <span className="text-sm font-mono font-bold text-slate-600">{(data.backgroundBlur || 0)}px</span>
                </div>
             </div>
          </div>
        </div>

        {/* Backdrop Image Source Section */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
           <div className="flex items-center gap-3">
              <ImageIcon className="text-indigo-600" size={20} />
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Identity Backdrop Source</h4>
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
                 {data.backgroundUrl && (
                    <button 
                       onClick={() => onChange({ ...data, backgroundUrl: '' })}
                       className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                       <Trash2 size={14} />
                    </button>
                 )}
              </div>
              
              <div className="relative group">
                 <Button variant="secondary" className="h-12 px-6 gap-2 w-full sm:w-auto">
                    <Download size={14} /> Upload Pattern
                 </Button>
                 <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'backgroundUrl')} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                 />
              </div>
           </div>
           
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Recommended: 1200x800px or seamless patterns. Use blur above to maintain text readability.
           </p>
        </div>
      </section>

      {/* 3. Identity Core */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">3. Identity Core</h3>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30 hover:bg-slate-50 hover:border-indigo-200 transition-all cursor-pointer relative group">
            <div className="relative mb-6">
              {data.profileImage ? (
                <div className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
                  <img src={data.profileImage} className="w-full h-full object-cover" alt="Profile" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Camera className="text-white w-10 h-10" />
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-[2.5rem] bg-white flex items-center justify-center text-slate-200 shadow-xl border-4 border-slate-50">
                  <Camera size={48} />
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-900 tracking-widest uppercase mb-2">Synchronize Visual</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hi-Res Portrait Preferred</p>
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profileImage')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><AtSign size={18} /></div>
                <input name="name" value={data.name} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm" placeholder="Full Professional Name" />
              </div>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Briefcase size={18} /></div>
                <input name="title" value={data.title} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm" placeholder="Professional Title / Role" />
              </div>
            </div>
            <div className="space-y-5">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Monitor size={18} /></div>
                <input name="company" value={data.company} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm" placeholder="Organization / Brand" />
              </div>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><MapPin size={18} /></div>
                <input name="address" value={data.address} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm" placeholder="Location Base" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Identity Bio</label>
             <textarea 
                name="bio" 
                value={data.bio} 
                onChange={handleChange} 
                rows={3} 
                className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm resize-none" 
                placeholder="A brief professional statement..."
             />
          </div>
        </div>
        
        {data.profileImage && (
          <AIImageModifier 
            currentImage={data.profileImage} 
            onUpdate={(img) => {
              onChange({ ...data, profileImage: img });
              storage.addLog({
                userId: data.userId,
                userEmail: data.email,
                action: 'AI_IMAGE_EDIT',
                details: 'AI Image modification applied'
              });
            }} 
          />
        )}
      </section>

      {/* 4. Digital Bridges */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">4. Digital Bridges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Mail size={18} /></div>
            <input name="email" type="email" value={data.email} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold" placeholder="Professional Email" />
          </div>
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Smartphone size={18} /></div>
            <input name="phone" type="tel" value={data.phone} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold" placeholder="Secure Mobile" />
          </div>
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Globe size={18} /></div>
            <input name="website" type="text" value={data.website || ''} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold" placeholder="Web / Portfolio" />
          </div>
          <div className="relative">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><MessageCircle size={18} className="text-green-500" /></div>
             <input name="whatsappNumber" type="text" value={data.whatsappNumber || ''} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold" placeholder="WhatsApp (e.g. +971...)" />
          </div>
          <div className="relative">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Facebook size={18} className="text-blue-600" /></div>
             <input name="facebook" type="text" value={data.facebook || ''} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold" placeholder="Facebook Profile Link" />
          </div>
          <div className="relative">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Instagram size={18} className="text-pink-500" /></div>
             <input name="instagram" type="text" value={data.instagram || ''} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold" placeholder="Instagram Profile Link" />
          </div>
          <div className="relative">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Share2 size={18} /></div>
             <input name="linkedin" type="text" value={data.linkedin || ''} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold" placeholder="LinkedIn Handle" />
          </div>
          <div className="relative">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Zap size={18} /></div>
             <input name="twitter" type="text" value={data.twitter || ''} onChange={handleChange} className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold" placeholder="Twitter / X Handle" />
          </div>
        </div>
      </section>

      {/* 5. Commerce & Ordering */}
      <section className="bg-slate-900 p-8 sm:p-12 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-100 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400"><ShoppingCart size={24} /></div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Commerce Hub</h3>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-1">Ordering Integration</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-indigo-600 rounded-[2.5rem] shadow-xl shadow-indigo-900/40">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><ShoppingCart size={24} /></div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">One-Tap Ordering</h4>
                  <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Enable Store Link or WhatsApp Commerce</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isOrderEnabled" checked={data.isOrderEnabled || false} onChange={handleChange} className="sr-only peer" />
                <div className="w-14 h-8 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white/30"></div>
              </label>
            </div>

            {data.isOrderEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 animate-in zoom-in-95 duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <MessageCircle size={14} className="text-green-400" /> Order WhatsApp
                  </label>
                  <input name="whatsappNumber" value={data.whatsappNumber || ''} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white" placeholder="+977 98..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <ExternalLink size={14} className="text-indigo-400" /> Store Link
                  </label>
                  <input name="orderRedirectUrl" value={data.orderRedirectUrl || ''} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white" placeholder="https://store.com/order" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Physical NFC Order Section */}
      <section className="bg-gradient-to-br from-yellow-500 to-amber-600 p-8 sm:p-12 rounded-[3.5rem] text-white shadow-2xl shadow-amber-200 border border-amber-400 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] pointer-events-none group-hover:bg-white/30 transition-all duration-700"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><CreditCard size={24} /></div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Physical NFC Card</h3>
              </div>
              <p className="text-sm font-bold text-white/90 leading-relaxed max-w-md">
                Order your high-quality physical NFC card. We'll pre-load your digital profile, enabling instant sharing with just one tap on any smartphone.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button 
                onClick={handleOrderCard}
                className="bg-white text-amber-600 px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-3"
              >
                <MessageCircle size={18} /> Order Now via WhatsApp
              </button>
              <p className="text-[9px] font-black uppercase text-center text-white/60 tracking-[0.2em]">Ships Globally | Fast Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Save Button Footer */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
        <button 
          onClick={handleManualSave}
          className={`h-14 px-10 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-3 ${isSaved ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'}`}
        >
          {isSaved ? <CheckCircle2 size={18} /> : <RefreshCw size={18} className={isSaved ? '' : 'group-hover:rotate-180 transition-transform duration-500'} />}
          {isSaved ? 'Changes Committed' : 'Save & Sync Design'}
        </button>
      </div>
    </div>
  );
};

// Local minimal button to avoid Circular dependency
const Button = ({ children, onClick, variant = "default", className = "", disabled = false, type = "button" }: any) => {
  const variants: any = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Editor;
