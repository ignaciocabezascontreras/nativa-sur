import React from 'react';
import { LOGO_SRC } from '../../utils/tiendaData';

export default function Navbar({ t, totalItems, toggleCarrito, toggleMenu }) {
  return (
    <div className="sticky top-0 z-300 bg-ns-deep border-b border-white/5">
      <nav className="h-16 flex items-center justify-between px-[5%]">
        <a href="#" className="flex items-center gap-2.5">
          <img src={LOGO_SRC} alt="Nativa Sur" className="h-10 w-10 rounded-full object-cover shadow-md" />
          <span className="text-[1.1rem] font-extrabold text-ns-cream tracking-tight">
            Nativa <span className="text-ns-honey">Sur</span>
          </span>
        </a>

        <ul className="hidden md:flex gap-8 list-none">
          {[
            ['#productos', t.navProductos],
            ['#nosotros',  t.navNosotros],
            ['#contacto',  t.navContacto],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="text-ns-cream/60 hover:text-ns-cream text-sm font-medium transition-colors">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={toggleCarrito}
          className="flex items-center gap-2 bg-ns-warm text-white border-none px-4 py-2 rounded-full cursor-pointer text-sm font-semibold transition-all hover:bg-ns-sand hover:-translate-y-px"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {t.carrito}
          {totalItems > 0 && (
            <span className="bg-ns-dark text-ns-honey rounded-full w-5 h-5 flex items-center justify-center text-[.7rem] font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </nav>
    </div>
  );
}
