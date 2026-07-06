import React from 'react';
import { LOGO_SRC } from '../../utils/tiendaData';

export default function Footer({ t }) {
  return (
    <footer className="bg-[#080e05] border-t border-white/5 text-white/28 text-center py-8 px-[6%] text-sm">
      <img src={LOGO_SRC} alt="Nativa Sur" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 opacity-90 shadow-[0_4px_12px_rgba(0,0,0,.5)]" />
      <p>© 2025 <span className="text-ns-sand">Nativa Sur</span> — {t.footerTxt}</p>
    </footer>
  );
}
