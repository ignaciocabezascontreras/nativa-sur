import React from 'react';
import { CATEGORIAS } from '../../utils/tiendaData';
import ProductoCard from './ProductoCard';

export default function Productos({ t, lang, filtro, setFiltro, productosFiltrados, carrito, agregar, quitar }) {
  return (
    <section id="productos" className="py-24 px-[6%] bg-ns-page">
      <div className="text-center mb-12">
        <p className="text-ns-sage text-xs font-bold tracking-[.3em] uppercase mb-3">{t.catalogoLabel}</p>
        <h2 className="text-4xl md:text-5xl font-black text-ns-text-dark mb-3">{t.catalogoTitulo}</h2>
        <p className="text-ns-text-light">{t.catalogoSub}</p>
        <div className="w-10 h-0.5 bg-ns-sage mx-auto mt-4" />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATEGORIAS.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFiltro(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
              filtro === cat.id
                ? 'bg-ns-dark text-ns-cream border-ns-dark'
                : 'bg-transparent text-ns-text-dark border-ns-border hover:border-ns-sage'
            }`}
          >
            {cat.label[lang]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productosFiltrados.map(p => (
          <ProductoCard
            key={p.id}
            producto={p}
            qty={carrito[p.id] || 0}
            onAgregar={() => agregar(p.id)}
            onQuitar={() => quitar(p.id)}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}
