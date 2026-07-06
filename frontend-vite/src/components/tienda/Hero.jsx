import React from 'react';
import { LOGO_SRC } from '../../utils/tiendaData';

export default function Hero({ t }) {
  return (
    <section className="relative min-h-[96vh] bg-ns-deep flex items-center overflow-hidden">
      {/* Atmósfera */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(46,94,26,.55),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_20%,rgba(90,125,69,.18),transparent)]" />

      <div className="relative z-10 px-[8%] py-24 max-w-3xl">
        {/* Logo circular */}
        <div className="w-40 h-40 rounded-full border-2 border-ns-honey/30 mb-8 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,.4)]">
          <img src={LOGO_SRC} alt="Nativa Sur" className="w-full h-full object-cover" />
        </div>

        <div className="inline-flex items-center gap-2 border border-ns-sage/40 bg-ns-sage/10 px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-ns-light" />
          <span className="text-ns-light text-xs font-semibold tracking-widest uppercase">{t.heroBadge}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-ns-cream leading-none mb-2">{t.heroTitulo1}</h1>
        <h1 className="text-5xl md:text-7xl font-black text-ns-honey leading-none mb-4">{t.heroTitulo2}</h1>
        <p className="text-ns-cream/50 text-sm tracking-[.25em] uppercase mb-6">{t.heroSub}</p>
        <p className="text-ns-cream/70 text-lg leading-relaxed mb-10 max-w-lg">{t.heroDesc}</p>

        <div className="flex gap-4 flex-wrap">
          <a href="#productos" className="px-8 py-3.5 rounded-full bg-ns-mid text-ns-cream font-bold text-sm hover:bg-ns-sage transition-colors">
            {t.heroCta1}
          </a>
          <a href="#contacto" className="px-8 py-3.5 rounded-full border border-ns-cream/20 text-ns-cream/80 font-bold text-sm hover:border-ns-cream/50 transition-colors">
            {t.heroCta2}
          </a>
        </div>
      </div>
    </section>
  );
}
