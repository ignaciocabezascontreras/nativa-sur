import React from 'react';
import { WA_NUMBER } from '../../utils/tiendaData';

export default function CarritoPanel({ t, carritoOpen, toggleCarrito, itemsCarrito, totalPrecio, quitar, eliminar, pedirWhatsApp, pagarFlow, pagoLoading }) {
  return (
    <>
      {carritoOpen && <div className="fixed inset-0 bg-ns-deep/55 z-[300] backdrop-blur-sm" onClick={toggleCarrito} />}
      <div className={`fixed top-0 right-0 h-full w-[420px] max-w-[95vw] bg-ns-card z-[400] flex flex-col transition-all duration-350 ${carritoOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-ns-border">
          <h2 className="font-bold text-ns-text-dark text-lg">{t.carrito}</h2>
          <button onClick={toggleCarrito} className="text-2xl text-ns-text-light hover:text-ns-text-dark leading-none">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {itemsCarrito.length === 0
            ? <p className="text-ns-text-light text-center py-12">{t.carritoVacio}</p>
            : itemsCarrito.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-ns-paper rounded-2xl border border-ns-border">
                <img src={item.foto} alt={item.nombre} className="w-14 h-14 object-contain rounded-xl bg-white" onError={e => e.target.style.display='none'} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ns-text-dark text-sm truncate">{item.nombre}</p>
                  <p className="text-ns-text-light text-xs">${item.precio.toLocaleString('es-CL')} × {item.qty}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => quitar(item.id)} className="w-6 h-6 rounded-full bg-ns-linen border border-ns-border text-xs font-bold">−</button>
                  <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => eliminar(item.id)} className="text-red-400 hover:text-red-500 text-xs ml-1">✕</button>
                </div>
              </div>
            ))
          }
        </div>

        {/* Footer */}
        {itemsCarrito.length > 0 && (
          <div className="p-5 border-t border-ns-border space-y-3">
            <div className="flex justify-between font-black text-lg text-ns-text-dark">
              <span>{t.total}</span>
              <span>${totalPrecio.toLocaleString('es-CL')}</span>
            </div>
            <button
              onClick={pagarFlow}
              disabled={pagoLoading}
              className="w-full bg-[#e8202c] text-white font-bold py-3 rounded-full hover:bg-[#c01a24] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {pagoLoading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4H4V8h16v4zM4 18v-4h16v4H4z"/></svg>
              )}
              {pagoLoading ? 'Iniciando pago...' : 'Pagar con Flow'}
            </button>
            <button onClick={pedirWhatsApp} className="w-full bg-[#25d366] text-white font-bold py-3 rounded-full hover:bg-[#1ebe5c] transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="white"><path d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.635 4.594 1.742 6.516L2.667 29.333l6.99-1.72A13.27 13.27 0 0016 29.333C23.37 29.333 29.333 23.364 29.333 16S23.37 2.667 16 2.667z"/></svg>
              {t.pedirWa}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
