import React, { useState } from 'react';

export default function BottomToolbar({ t, lang, setLang, dark, toggleTheme, toggleMenu }) {
  const [langOpen, setLangOpen] = useState(false);

  const langs = [
    { code:'ES', flag:'🇨🇱', name:'Español' },
    { code:'EN', flag:'🇺🇸', name:'English' },
    { code:'PT', flag:'🇧🇷', name:'Português' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[460] bg-ns-deep/96 backdrop-blur-2xl flex items-stretch pb-safe border-t border-white/5"
         style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

      {/* Menú */}
      <button onClick={toggleMenu} className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-white/50 hover:text-ns-honey transition-colors text-[.65rem] font-medium">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        {t.tbMenu}
      </button>

      <div className="w-px bg-white/7 self-stretch my-2" />

      {/* Despacho */}
      <button className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-white/50 hover:text-ns-honey transition-colors text-[.65rem] font-medium">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
        </svg>
        {t.tbDespacho}
      </button>

      <div className="w-px bg-white/7 self-stretch my-2" />

      {/* Idioma */}
      <div className="flex-1 relative">
        <button
          onClick={() => setLangOpen(o => !o)}
          className="w-full h-full flex flex-col items-center justify-center gap-1 py-3 text-white/50 hover:text-ns-honey transition-colors text-[.65rem] font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          <span className="bg-ns-honey text-ns-deep text-[.58rem] font-black px-1.5 py-px rounded-full">{lang}</span>
        </button>
        {langOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a2e12] border border-white/12 rounded-2xl overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,.55)] min-w-[170px]">
            {langs.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setLangOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors ${lang===l.code ? 'text-ns-honey' : 'text-white/70'}`}
              >
                <span>{l.flag}</span><span className="flex-1 text-left">{l.name}</span>
                {lang===l.code && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px bg-white/7 self-stretch my-2" />

      {/* Tema */}
      <button onClick={toggleTheme} className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 text-white/50 hover:text-ns-honey transition-colors text-[.65rem] font-medium">
        <div className={`w-10 h-5 rounded-full border transition-all duration-300 relative flex-shrink-0 ${dark ? 'bg-ns-mid border-ns-sage' : 'bg-white/15 border-white/20'}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${dark ? 'translate-x-[22px] bg-ns-honey' : 'translate-x-0.5 bg-white/85'}`}>
            {dark
              ? <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#0f1f0a" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              : <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#2e5e1a" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>
            }
          </div>
        </div>
        {t.tbTema}
      </button>

      <div className="w-px bg-white/7 self-stretch my-2" />

      {/* Cuenta */}
      <button className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-white/50 hover:text-ns-honey transition-colors text-[.65rem] font-medium">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        {t.tbCuenta}
      </button>
    </div>
  );
}
