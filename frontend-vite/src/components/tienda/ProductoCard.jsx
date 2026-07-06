import React from 'react';
import { pkgSVG } from '../../utils/tiendaSvg';

export default function ProductoCard({ producto, qty, onAgregar, onQuitar, t }) {
  const { nombre, precio, desc, categoria, foto } = producto;

  return (
    <div className="bg-ns-card border border-ns-border rounded-[28px] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* Imagen */}
      <div className="h-[300px] relative overflow-hidden bg-ns-paper flex items-center justify-center">
        {foto
          ? <img src={foto} alt={nombre} className="w-full h-full object-contain p-1" loading="lazy" />
          : <div dangerouslySetInnerHTML={{ __html: pkgSVG(producto) }} className="w-full h-full" />
        }
        <span className="absolute top-3 left-3 bg-ns-dark text-ns-honey text-[.65rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
          {categoria}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-ns-text-dark text-base mb-1">{nombre}</h3>
        <p className="text-ns-text-light text-sm leading-relaxed mb-4">{desc}</p>

        <div className="flex items-center justify-between">
          <span className="text-ns-mid font-black text-xl">
            ${precio.toLocaleString('es-CL')}
            <span className="text-ns-text-light font-normal text-xs ml-1">{t.unidad}</span>
          </span>

          {qty > 0 ? (
            <div className="flex items-center gap-2">
              <button onClick={onQuitar} className="w-7 h-7 rounded-full bg-ns-linen border border-ns-border text-ns-text-dark font-bold flex items-center justify-center hover:bg-ns-mist transition-colors">−</button>
              <span className="font-bold text-ns-text-dark w-5 text-center">{qty}</span>
              <button onClick={onAgregar} className="w-7 h-7 rounded-full bg-ns-mid text-white font-bold flex items-center justify-center hover:bg-ns-dark transition-colors">+</button>
            </div>
          ) : (
            <button
              onClick={onAgregar}
              className="bg-ns-dark text-ns-cream text-sm font-semibold px-4 py-2 rounded-full hover:bg-ns-mid transition-colors"
            >
              {t.agregar}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
