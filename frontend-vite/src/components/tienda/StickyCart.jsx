import React from 'react';

export default function StickyCart({ t, totalItems, totalPrecio, toggleCarrito }) {
  if (totalItems === 0) return null;
  return (
    <div className="fixed bottom-[68px] left-0 right-0 z-[450] px-4 pb-2 animate-fade-in">
      <button
        onClick={toggleCarrito}
        className="w-full max-w-lg mx-auto flex items-center justify-between bg-ns-dark/95 backdrop-blur-md text-ns-cream px-5 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,.4)] border border-white/10"
      >
        <div className="flex items-center gap-3">
          <span className="bg-ns-honey text-ns-deep text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">{totalItems}</span>
          <span className="font-semibold text-sm">{t.carrito}</span>
        </div>
        <span className="font-black text-ns-honey">${totalPrecio.toLocaleString('es-CL')}</span>
      </button>
    </div>
  );
}
