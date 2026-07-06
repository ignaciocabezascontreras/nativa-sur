import React from 'react';
import useTienda from '../../hooks/useTienda';
import Navbar from '../../components/tienda/Navbar';
import Hero from '../../components/tienda/Hero';
import Productos from '../../components/tienda/Productos';
import CarritoPanel from '../../components/tienda/CarritoPanel';
import StickyCart from '../../components/tienda/StickyCart';
import BottomToolbar from '../../components/tienda/BottomToolbar';
import Footer from '../../components/tienda/Footer';
import { WA_NUMBER } from '../../utils/tiendaData';

export const pageMetadata = { path: '/tienda', order: 1 };

export default function TiendaPage() {
  const store = useTienda();
  const { t, lang, dark, toggleTheme, setLang,
          filtro, setFiltro, productosFiltrados,
          carrito, agregar, quitar, eliminar,
          totalItems, totalPrecio, itemsCarrito,
          carritoOpen, toggleCarrito,
          menuOpen, toggleMenu,
          pedirWhatsApp, pagarFlow, pagoLoading } = store;

  return (
    <div className="font-sans min-h-screen pb-16" style={{ background: 'var(--ns-page, #f9f5ef)', color: 'var(--ns-text, #1a120a)' }}>
      <Navbar t={t} totalItems={totalItems} toggleCarrito={toggleCarrito} toggleMenu={toggleMenu} />

      <main>
        <Hero t={t} />
        <Productos
          t={t} lang={lang}
          filtro={filtro} setFiltro={setFiltro}
          productosFiltrados={productosFiltrados}
          carrito={carrito} agregar={agregar} quitar={quitar}
        />
      </main>

      <Footer t={t} />

      <CarritoPanel
        t={t} carritoOpen={carritoOpen} toggleCarrito={toggleCarrito}
        itemsCarrito={itemsCarrito} totalPrecio={totalPrecio}
        quitar={quitar} eliminar={eliminar} pedirWhatsApp={pedirWhatsApp}
        pagarFlow={pagarFlow} pagoLoading={pagoLoading}
      />

      <StickyCart t={t} totalItems={totalItems} totalPrecio={totalPrecio} toggleCarrito={toggleCarrito} />

      <BottomToolbar
        t={t} lang={lang} setLang={setLang}
        dark={dark} toggleTheme={toggleTheme}
        toggleMenu={toggleMenu}
      />

      {/* WhatsApp flotante */}
      <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
         className="fixed bottom-[calc(64px+1cm)] right-6 z-[500] w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2ecc71] to-[#128C7E] flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,.45)] hover:scale-110 hover:-translate-y-1 transition-all animate-pulse-soft">
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="white">
          <path d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.635 4.594 1.742 6.516L2.667 29.333l6.99-1.72A13.27 13.27 0 0016 29.333C23.37 29.333 29.333 23.364 29.333 16S23.37 2.667 16 2.667zm0 2.4c5.99 0 10.93 4.94 10.93 10.933s-4.94 10.933-10.93 10.933a10.9 10.9 0 01-5.573-1.527l-.397-.238-4.148 1.02 1.052-3.994-.261-.414A10.89 10.89 0 015.07 16c0-5.993 4.94-10.933 10.933-10.933z"/>
        </svg>
      </a>
    </div>
  );
}
