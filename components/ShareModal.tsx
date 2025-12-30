
import React, { useState, useMemo } from 'react';
import { BusinessCardData } from '../types';
import { ExternalLink, Copy, CheckCircle2, AlertTriangle, UserPlus2, CreditCard, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  data: BusinessCardData;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ data, onClose }) => {
  const [nfcStatus, setNfcStatus] = useState<'idle' | 'writing' | 'success' | 'error' | 'not-supported' | 'iframe-restriction'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [shareType, setShareType] = useState<'url' | 'vcard' | 'order'>('url');
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.origin + '?card=' + data.id;

  const isTopLevel = window.self === window.top;

  const vCardString = useMemo(() => {
    return [
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
  }, [data]);

  const qrData = shareType === 'url' ? shareUrl : vCardString;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(qrData)}`;

  const writeToNFC = async () => {
    if (!isTopLevel) {
      setNfcStatus('iframe-restriction');
      return;
    }

    if (!('NDEFReader' in window)) {
      setNfcStatus('not-supported');
      return;
    }

    setNfcStatus('writing');
    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      await ndef.write(shareUrl);
      setNfcStatus('success');
    } catch (error: any) {
      console.error("NFC Write error:", error);
      if (error.name === 'NotAllowedError') {
        setErrorMsg("Permission denied for NFC.");
      } else if (error.message?.includes('browsing context')) {
        setNfcStatus('iframe-restriction');
      } else {
        setErrorMsg(error.message || "Writing failed");
      }
      setNfcStatus('error');
    }
  };

  const handleOrderCard = () => {
    const message = `Hi, I just designed a digital business card on TAPIFY and I'd like to order a physical NFC version!\n\nName: ${data.name}\nTitle: ${data.title}\nCard Link: ${shareUrl}`;
    const waUrl = `https://wa.me/96879398307?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const downloadVCard = () => {
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

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Share Identity</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            <button 
              onClick={() => setShareType('url')}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${shareType === 'url' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              Link
            </button>
            <button 
              onClick={() => setShareType('vcard')}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${shareType === 'vcard' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              vCard
            </button>
            <button 
              onClick={() => setShareType('order')}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${shareType === 'order' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500'}`}
            >
              Order
            </button>
          </div>

          {shareType === 'order' ? (
            <div className="bg-amber-50 p-8 rounded-[2rem] mb-8 flex flex-col items-center border border-amber-100 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 mb-6 shadow-sm"><CreditCard size={32} /></div>
              <h3 className="text-lg font-black text-amber-900 uppercase tracking-tight mb-2">Get Physical Card</h3>
              <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest leading-relaxed">
                Connect with us on WhatsApp to order your high-quality NFC-enabled business card.
              </p>
              <button 
                onClick={handleOrderCard}
                className="w-full mt-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-200 flex items-center justify-center gap-3"
              >
                <MessageCircle size={18} /> Chat to Order
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 p-8 rounded-[2rem] mb-8 flex flex-col items-center border border-slate-100">
               <div className="w-52 h-52 bg-white p-4 shadow-xl shadow-slate-200/50 rounded-3xl mb-4 relative group">
                  <img src={qrUrl} alt="QR Code" className="w-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-center px-4">Ready to Scan</p>
                  </div>
               </div>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center leading-tight">
                 {shareType === 'url' ? 'Directs to your live profile' : 'Directly save to contacts list'}
               </p>
            </div>
          )}

          <div className="space-y-3">
            {shareType !== 'order' && (
              <>
                {nfcStatus === 'iframe-restriction' ? (
                  <button
                    onClick={handleOpenNewTab}
                    className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all hover:bg-amber-600 shadow-lg shadow-amber-100"
                  >
                    <ExternalLink size={18} /> OPEN IN NEW TAB FOR NFC
                  </button>
                ) : (
                  <button
                    onClick={writeToNFC}
                    disabled={nfcStatus === 'writing' || nfcStatus === 'success'}
                    className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                      nfcStatus === 'success' ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                    }`}
                  >
                    <span className="text-lg">📡</span>
                    {nfcStatus === 'idle' && 'WRITE TO NFC TAG'}
                    {nfcStatus === 'writing' && 'HOLD NEAR TAG...'}
                    {nfcStatus === 'success' && 'NFC WRITTEN!'}
                    {nfcStatus === 'error' && 'RETRY NFC'}
                    {nfcStatus === 'not-supported' && 'NFC UNAVAILABLE'}
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                   <button
                      onClick={() => {
                         navigator.clipboard.writeText(shareUrl);
                         setCopied(true);
                         setTimeout(() => setCopied(false), 2000);
                      }}
                      className="py-4 rounded-2xl border border-slate-200 text-slate-600 text-[10px] font-black hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                     {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                     {copied ? 'Copied' : 'Copy Link'}
                   </button>
                   <button
                      onClick={downloadVCard}
                      className="py-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black hover:bg-indigo-100 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                     <UserPlus2 size={14} /> Save Contact
                   </button>
                </div>
              </>
            )}
          </div>
          
          {shareType !== 'order' && nfcStatus === 'iframe-restriction' && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
              <AlertTriangle className="text-amber-500 shrink-0" size={16} />
              <p className="text-[10px] text-amber-700 font-bold leading-tight uppercase">
                Web NFC is restricted in embedded environments. Please use the button above to open the app directly.
              </p>
            </div>
          )}

          {errorMsg && (
            <p className="text-red-500 text-[10px] mt-4 text-center font-bold uppercase">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
