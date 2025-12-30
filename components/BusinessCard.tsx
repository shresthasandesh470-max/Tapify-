
import React, { useState, useMemo } from 'react';
import { Linkedin, Twitter, Mail, Phone, MapPin, Scan, ExternalLink, ShoppingBag, CreditCard, Copy, CheckCircle2, Globe, MessageCircle, RefreshCw, Facebook, Instagram } from 'lucide-react';
import { BusinessCardData } from '../types';

interface TemplateProps {
  data: BusinessCardData;
  themeStyles: {
    container: string;
    textPrimary: string;
    textSecondary: string;
    accentBg: string;
    border?: string;
    glass?: boolean;
  };
}

// --- Action Components ---

const SocialLinks = ({ data, color }: { data: BusinessCardData; color: string }) => {
  const links = [
    { icon: <Linkedin size={14} />, url: data.linkedin ? `https://linkedin.com/in/${data.linkedin}` : null },
    { icon: <Twitter size={14} />, url: data.twitter ? `https://twitter.com/${data.twitter}` : null },
    { icon: <Facebook size={14} />, url: data.facebook || null },
    { icon: <Instagram size={14} />, url: data.instagram || null },
    { icon: <MessageCircle size={14} />, url: data.whatsappNumber ? `https://wa.me/${data.whatsappNumber.replace(/\+/g, '')}` : null },
  ].filter(l => l.url);

  if (links.length === 0) return null;

  return (
    <div className="flex gap-3 items-center mt-3">
      {links.map((link, idx) => (
        <a key={idx} href={link.url!} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity" style={{ color }}>
          {link.icon}
        </a>
      ))}
    </div>
  );
};

const BusinessActions = ({ data, themeStyles }: { data: BusinessCardData; themeStyles: any }) => {
  const whatsappUrl = `https://wa.me/${data.whatsappNumber?.replace(/\+/g, '')}?text=${encodeURIComponent(`Hi ${data.name}, I am interested in your services.`)}`;

  if (!data.isOrderEnabled) return null;

  return (
    <div className="flex gap-2 mt-auto pt-4">
      {data.isOrderEnabled && (
        <a 
          href={data.orderRedirectUrl || whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-slate-900 text-white hover:bg-black shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <ShoppingBag size={14} /> Buy Now
        </a>
      )}
    </div>
  );
};

// Backdrop Layer Component
const CardBackdrop = ({ data }: { data: BusinessCardData }) => {
  if (!data.backgroundUrl) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
       <div 
          className="w-full h-full bg-center bg-cover transition-all duration-700"
          style={{ 
            backgroundImage: `url("${data.backgroundUrl}")`,
            filter: `blur(${data.backgroundBlur || 0}px)`,
            transform: 'scale(1.1)' // Small scale prevents blur edges leaking
          }}
       ></div>
       <div className="absolute inset-0 bg-black/5 mix-blend-multiply"></div>
       <div className="absolute inset-0" style={{ backgroundColor: `${data.themeColor}15` }}></div>
    </div>
  );
};

// --- Modern Card Implementation ---

const ModernCard: React.FC<TemplateProps> = ({ data, themeStyles }) => {
  const isPortrait = data.orientation === 'portrait';
  return (
    <div className={`relative w-full h-full flex ${isPortrait ? 'flex-col' : 'flex-row'} ${themeStyles.container}`}>
      <CardBackdrop data={data} />
      <div className={`${isPortrait ? 'h-[40%] w-full' : 'w-[35%] h-full'} relative overflow-hidden flex items-center justify-center z-10`}>
        <div className="absolute inset-0 opacity-10 blur-2xl scale-150" style={{ backgroundColor: data.themeColor }}></div>
        <img src={data.profileImage} className="relative z-10 w-24 h-24 rounded-3xl object-cover border-[6px] border-white shadow-2xl rotate-2" style={{ borderColor: themeStyles.glass ? 'rgba(255,255,255,0.2)' : 'white' }} />
      </div>
      <div className={`flex-1 p-8 flex flex-col justify-between z-10 ${isPortrait ? 'text-center items-center' : 'text-left'}`}>
        <div className="space-y-1">
          <h2 className={`text-2xl font-black leading-tight tracking-tighter uppercase ${themeStyles.textPrimary}`}>{data.name}</h2>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 rounded-full" style={{ backgroundColor: data.themeColor }}></div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: data.themeColor }}>{data.title}</p>
          </div>
          <SocialLinks data={data} color={themeStyles.textPrimary} />
        </div>
        <div className="space-y-2 mt-4">
          <div className={`flex items-center gap-3 text-[10px] font-bold ${themeStyles.textSecondary}`}>
            <div className="w-6 h-6 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 flex items-center justify-center"><Mail size={12} style={{ color: data.themeColor }} /></div>
            <span className="truncate">{data.email}</span>
          </div>
          <div className={`flex items-center gap-3 text-[10px] font-bold ${themeStyles.textSecondary}`}>
             <div className="w-6 h-6 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 flex items-center justify-center"><Phone size={12} style={{ color: data.themeColor }} /></div>
             {data.phone}
          </div>
        </div>
        <BusinessActions data={data} themeStyles={themeStyles} />
      </div>
    </div>
  );
};

// --- Executive/Tech/Other Templates Updated with Z-indexing ---

const ExecutiveCard: React.FC<TemplateProps> = ({ data, themeStyles }) => (
  <div className={`relative w-full h-full flex flex-col items-center justify-center p-10 text-center ${themeStyles.container}`}>
    <CardBackdrop data={data} />
    <div className="relative z-10">
      <div className="absolute top-[-40px] left-0 right-0 h-1.5" style={{ backgroundColor: data.themeColor }}></div>
      <div className="relative mb-6">
        <div className="absolute -inset-2 blur-xl opacity-30 rounded-full" style={{ backgroundColor: data.themeColor }}></div>
        <img src={data.profileImage} className="relative z-10 w-20 h-20 rounded-full object-cover border-2 p-1 bg-white" style={{ borderColor: data.themeColor }} />
      </div>
      <h2 className={`text-3xl font-serif tracking-tighter ${themeStyles.textPrimary}`}>{data.name}</h2>
      <p className={`text-[11px] font-black uppercase tracking-[0.4em] mb-4 opacity-50 ${themeStyles.textSecondary}`}>{data.title}</p>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-4">
          {data.email && <Mail size={14} style={{ color: data.themeColor }} />}
          {data.phone && <Phone size={14} style={{ color: data.themeColor }} />}
          {data.website && <Globe size={14} style={{ color: data.themeColor }} />}
        </div>
        <SocialLinks data={data} color={data.themeColor} />
      </div>
      <div className="w-full max-w-[220px] mt-6">
        <BusinessActions data={data} themeStyles={themeStyles} />
      </div>
    </div>
  </div>
);

const TechCard: React.FC<TemplateProps> = ({ data, themeStyles }) => (
  <div className={`relative w-full h-full p-8 font-mono flex flex-col justify-between overflow-hidden ${themeStyles.container}`}>
    <CardBackdrop data={data} />
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${data.themeColor}, transparent)` }}></div>
    <div className="relative z-10 flex justify-between items-start">
      <div className="text-left">
        <div className="text-[10px] font-black opacity-30 mb-2">// IDENTITY_LAB</div>
        <h2 className={`text-xl font-black tracking-tight ${themeStyles.textPrimary}`}>
          <span className="opacity-40">profile.</span>{data.name?.toLowerCase().replace(/\s/g, '_')}
        </h2>
        <div className="mt-3 space-y-1">
          <p className="text-[10px]"><span style={{ color: data.themeColor }}>role:</span> '{data.title}'</p>
          <p className="text-[10px]"><span style={{ color: data.themeColor }}>base:</span> '{data.address || 'Remote'}'</p>
        </div>
        <SocialLinks data={data} color={themeStyles.textPrimary} />
      </div>
      <img src={data.profileImage} className="w-16 h-16 rounded-2xl border-2 p-0.5 object-cover" style={{ borderColor: data.themeColor }} />
    </div>
    <div className="relative z-10 mt-auto space-y-4">
      <BusinessActions data={data} themeStyles={themeStyles} />
      <div className={`flex items-center justify-between text-[8px] font-black uppercase tracking-widest pt-3 border-t border-slate-200/10 ${themeStyles.textSecondary}`}>
         <div className="flex gap-4">
           <span>{data.email}</span>
           <span>{data.phone}</span>
         </div>
         <div className="flex gap-2">
            <Linkedin size={10} />
            <Twitter size={10} />
            {data.facebook && <Facebook size={10} />}
            {data.instagram && <Instagram size={10} />}
         </div>
      </div>
    </div>
  </div>
);

const BoldCard: React.FC<TemplateProps> = ({ data, themeStyles }) => {
  const isPortrait = data.orientation === 'portrait';
  return (
    <div className={`relative w-full h-full flex ${isPortrait ? 'flex-col' : 'flex-row'} overflow-hidden ${themeStyles.container}`}>
      <CardBackdrop data={data} />
      <div className={`p-10 flex-1 flex flex-col justify-center z-10 ${isPortrait ? 'text-center items-center' : 'text-left'}`}>
        <h2 className={`text-5xl font-black leading-[0.8] tracking-tighter mb-4 ${themeStyles.textPrimary} uppercase`}>
          {data.name?.split(' ')[0] || 'FIRST'}<br/>
          <span style={{ color: data.themeColor }}>{data.name?.split(' ')[1] || 'LAST'}</span>
        </h2>
        <p className={`text-xs font-black tracking-[0.3em] uppercase opacity-40 mb-6 ${themeStyles.textSecondary}`}>{data.title}</p>
        <div className="w-full max-w-[200px]">
           <BusinessActions data={data} themeStyles={themeStyles} />
        </div>
        <SocialLinks data={data} color={themeStyles.textPrimary} />
      </div>
      <div className={`${isPortrait ? 'h-1/3 w-full' : 'w-[30%] h-full'} relative z-10`}>
        <img src={data.profileImage} className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700" />
        <div className="absolute inset-0 mix-blend-multiply opacity-40" style={{ backgroundColor: data.themeColor }}></div>
      </div>
    </div>
  );
};

const SleekCard: React.FC<TemplateProps> = ({ data, themeStyles }) => (
  <div className={`relative w-full h-full p-8 flex flex-col ${themeStyles.container}`}>
    <CardBackdrop data={data} />
    <div className="relative z-10 flex items-center justify-between mb-8">
       <img src={data.profileImage} className="w-16 h-16 rounded-[2rem] object-cover shadow-2xl ring-4 ring-white" />
       <div className="text-right">
          <h2 className={`text-xl font-black tracking-tighter uppercase mb-1 ${themeStyles.textPrimary}`}>{data.name}</h2>
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: data.themeColor }}>{data.company}</p>
       </div>
    </div>
    <div className="relative z-10 flex-1 space-y-4">
       <div className="p-4 rounded-[2rem] bg-white/40 backdrop-blur-sm space-y-2 border border-white/20">
          <p className={`text-[9px] font-bold ${themeStyles.textSecondary} flex items-center gap-3`}><Mail size={12} className="opacity-30" /> {data.email}</p>
          <p className={`text-[9px] font-bold ${themeStyles.textSecondary} flex items-center gap-3`}><Phone size={12} className="opacity-30" /> {data.phone}</p>
          {data.website && <p className={`text-[9px] font-bold ${themeStyles.textSecondary} flex items-center gap-3`}><Globe size={12} className="opacity-30" /> {data.website}</p>}
       </div>
       <SocialLinks data={data} color={data.themeColor} />
    </div>
    <div className="relative z-10">
      <BusinessActions data={data} themeStyles={themeStyles} />
    </div>
  </div>
);

const CreativeCard: React.FC<TemplateProps> = ({ data, themeStyles }) => (
  <div className={`relative w-full h-full p-10 flex flex-col justify-between overflow-hidden ${themeStyles.container}`}>
    <CardBackdrop data={data} />
    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: data.themeColor }}></div>
    <div className="relative z-10 flex items-start gap-6">
       <div className="relative">
          <div className="absolute -inset-2 bg-black/5 rounded-[2.5rem] rotate-6"></div>
          <img src={data.profileImage} className="relative z-10 w-20 h-20 rounded-[2.5rem] object-cover shadow-xl" />
       </div>
       <div className="pt-2">
          <h2 className={`text-4xl font-black leading-[0.8] tracking-tighter uppercase ${themeStyles.textPrimary}`}>{data.name}</h2>
          <p className="text-[11px] font-bold tracking-widest uppercase mt-3 opacity-60" style={{ color: data.themeColor }}>{data.title}</p>
       </div>
    </div>
    <div className="relative z-10 space-y-6">
       <div className="grid grid-cols-2 gap-4 text-[9px] font-black uppercase tracking-widest opacity-40">
          <div className="flex items-center gap-2"><Phone size={10} /> {data.phone}</div>
          <div className="flex items-center gap-2"><Mail size={10} /> {data.email}</div>
       </div>
       <div className="flex justify-between items-center">
         <SocialLinks data={data} color={themeStyles.textPrimary} />
         <BusinessActions data={data} themeStyles={themeStyles} />
       </div>
    </div>
  </div>
);

const MinimalCard: React.FC<TemplateProps> = ({ data, themeStyles }) => (
  <div className={`relative w-full h-full flex flex-col items-center justify-center p-10 text-center ${themeStyles.container}`}>
    <CardBackdrop data={data} />
    <div className="relative z-10">
      <div className="w-20 h-20 rounded-3xl overflow-hidden mb-6 shadow-xl rotate-4 transition-transform hover:rotate-0 duration-500 mx-auto">
        <img src={data.profileImage} alt={data.name} className="w-full h-full object-cover" />
      </div>
      <h2 className={`text-xl font-black tracking-tight uppercase ${themeStyles.textPrimary}`}>{data.name}</h2>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-6 opacity-40 ${themeStyles.textSecondary}`}>{data.title}</p>
      <div className="w-full max-w-[180px] mx-auto">
         <BusinessActions data={data} themeStyles={themeStyles} />
      </div>
      <div className="mt-6 flex gap-6 opacity-20 justify-center">
         <Linkedin size={14} />
         <Twitter size={14} />
         <Facebook size={14} />
         <Instagram size={14} />
         <MessageCircle size={14} />
      </div>
    </div>
  </div>
);

const ClassicCard: React.FC<TemplateProps> = ({ data, themeStyles }) => (
  <div className={`relative w-full h-full p-10 flex flex-col justify-center text-left ${themeStyles.container}`}>
     <CardBackdrop data={data} />
     <div className="relative z-10">
       <div className="border-l-[6px] pl-6 mb-8" style={{ borderColor: data.themeColor }}>
          <h2 className={`text-3xl font-serif font-bold leading-tight ${themeStyles.textPrimary}`}>{data.name}</h2>
          <p className={`text-base font-serif italic opacity-60 ${themeStyles.textSecondary}`}>{data.title}</p>
          <SocialLinks data={data} color={themeStyles.textPrimary} />
       </div>
       <div className={`space-y-4 text-[10px] font-bold uppercase tracking-widest ${themeStyles.textSecondary}`}>
          <p className="opacity-40">{data.company}</p>
          <div className="space-y-2">
            <span className="flex items-center gap-3"><Phone size={12} style={{ color: data.themeColor }} /> {data.phone}</span>
            <span className="flex items-center gap-3"><Mail size={12} style={{ color: data.themeColor }} /> {data.email}</span>
          </div>
          <div className="max-w-[200px] pt-4">
            <BusinessActions data={data} themeStyles={themeStyles} />
          </div>
       </div>
     </div>
  </div>
);

// --- Card Back Component ---
const CardBack: React.FC<{ data: BusinessCardData; themeStyles: any }> = ({ data, themeStyles }) => {
  const shareUrl = window.location.origin + '?card=' + data.id;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=20&data=${encodeURIComponent(shareUrl)}`;
  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center p-10 text-center ${themeStyles.container}`}>
      <CardBackdrop data={data} />
      <div className="relative z-10">
        <div className="relative group/qr">
          <div className="absolute -inset-4 bg-black/5 rounded-[2.5rem] blur-xl group-hover/qr:blur-2xl transition-all"></div>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl relative z-10 border border-slate-100 transition-transform hover:scale-[1.05] duration-500">
            <img src={qrUrl} alt="QR Code" className="w-32 h-32" />
          </div>
        </div>
        <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-8 mb-2 ${themeStyles.textPrimary}`}>Digital Passport</p>
        <p className={`text-[8px] font-bold uppercase tracking-widest opacity-40 ${themeStyles.textSecondary}`}>Scan to Synchronize Profile</p>
        <div className="flex gap-4 mt-8 opacity-20 justify-center">
          <Scan size={18} />
          <Globe size={18} />
          <ExternalLink size={18} />
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

interface BusinessCardProps {
  data: BusinessCardData;
  scale?: number;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ data, scale = 1 }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isPortrait = data.orientation === 'portrait';

  const themeStyles = useMemo(() => {
    switch (data.theme) {
      case 'dark': return { container: 'bg-[#121212]', textPrimary: 'text-white', textSecondary: 'text-slate-400', accentBg: 'bg-slate-800' };
      case 'glass': return { container: 'bg-white/40 backdrop-blur-2xl border-white/20', textPrimary: 'text-slate-900', textSecondary: 'text-slate-600', accentBg: 'bg-white/10', glass: true };
      case 'mesh': return { container: 'bg-white', textPrimary: 'text-slate-900', textSecondary: 'text-slate-500', accentBg: 'bg-black/5' };
      case 'neon': return { container: 'bg-black', textPrimary: 'text-white', textSecondary: 'text-slate-300', accentBg: 'bg-slate-900', border: `border-[1.5px] border-indigo-500/30 shadow-[0_0_40px_${data.themeColor}15]` };
      case 'aurora': return { container: 'bg-gradient-to-br from-indigo-50 via-purple-500 to-pink-500', textPrimary: 'text-white', textSecondary: 'text-white/80', accentBg: 'bg-white/10' };
      case 'retro': return { container: 'bg-[#f8f5f0] border-[#e8e2d8]', textPrimary: 'text-[#2a2a2a]', textSecondary: 'text-[#7a7a7a]', accentBg: 'bg-[#f0ece4]' };
      case 'gold': return { container: 'bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a]', textPrimary: 'text-[#f5f5f5]', textSecondary: 'text-[#c5a059]', accentBg: 'bg-[#222]', border: 'border-[#c5a059]/30 shadow-2xl shadow-yellow-900/10' };
      default: return { container: 'bg-white border-slate-100', textPrimary: 'text-slate-900', textSecondary: 'text-slate-500', accentBg: 'bg-slate-900' };
    }
  }, [data.theme, data.themeColor]);

  const dynamicBackground = useMemo(() => {
    if (data.theme === 'mesh') return { background: `radial-gradient(at 0% 0%, ${data.themeColor}15 0, transparent 60%), radial-gradient(at 100% 100%, ${data.themeColor}15 0, transparent 60%), #ffffff` };
    if (data.theme === 'retro') return { backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` };
    return {};
  }, [data.theme, data.themeColor]);

  const renderTemplate = () => {
    const props = { data, themeStyles };
    const children = (() => {
      switch (data.template) {
        case 'modern': return <ModernCard {...props} />;
        case 'executive': return <ExecutiveCard {...props} />;
        case 'tech': return <TechCard {...props} />;
        case 'bold': return <BoldCard {...props} />;
        case 'sleek': return <SleekCard {...props} />;
        case 'creative': return <CreativeCard {...props} />;
        case 'classic': return <ClassicCard {...props} />;
        case 'minimal': return <MinimalCard {...props} />;
        default: return <ModernCard {...props} />;
      }
    })();

    const fontStyles: React.CSSProperties = {
      ...dynamicBackground,
      fontFamily: data.fontFamily || "'Inter', sans-serif",
      lineHeight: data.language === 'ne' ? '1.5' : 'normal',
      letterSpacing: data.language === 'ne' ? '0.01em' : 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    };

    return (
      <div 
        style={fontStyles} 
        className={`w-full h-full overflow-hidden ${themeStyles.container} ${themeStyles.border || ''}`}
      >
        {children}
      </div>
    );
  };

  const cardWidth = isPortrait ? 250 : 420;
  const cardHeight = isPortrait ? 420 : 250;

  return (
    <div className="flex flex-col items-center group/main">
      <div 
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center', perspective: '1200px' }} 
        className="relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer hover:translate-y-[-10px]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`relative transition-transform duration-1000 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ width: `${cardWidth}px`, height: `${cardHeight}px`, transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden shadow-[0_50px_100px_rgba(0,0,0,0.12)] rounded-[2.5rem] overflow-hidden border border-slate-200/30 group-hover/main:shadow-indigo-500/20 transition-all duration-700">
            {renderTemplate()}
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden shadow-[0_50px_100px_rgba(0,0,0,0.12)] rounded-[2.5rem] overflow-hidden rotate-y-180 group-hover/main:shadow-indigo-500/20 transition-all duration-700" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div style={dynamicBackground} className={`w-full h-full ${themeStyles.container}`}>
              <CardBack data={data} themeStyles={themeStyles} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-6">
        <button 
          onClick={() => setIsFlipped(!isFlipped)} 
          className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-indigo-600 transition-colors"
        >
          <div className={`w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`}>
             <RefreshCw size={12} />
          </div>
          {isFlipped ? 'Front Profile' : 'Back Sync'}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .transform-style-3d { transform-style: preserve-3d; }
      `}} />
    </div>
  );
};

export default BusinessCard;
