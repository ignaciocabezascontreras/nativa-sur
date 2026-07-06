import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiShoppingCart } from 'react-icons/fi'
import useProductos from '../../hooks/useProductos.jsx'
import useCarrito   from '../../hooks/useCarrito.jsx'
import Carrito      from '../../components/widgets/Carrito.jsx'

const CATEGORIAS = ['todos', 'nueces', 'semillas', 'mix', 'frutas']

const Tienda = () => {
  const { t }                                       = useTranslation()
  const { productos, loading, error, cargar }       = useProductos()
  const carritoHook                                 = useCarrito()
  const [carritoAbierto, setCarritoAbierto]         = useState(false)
  const [categoriaActiva, setCategoriaActiva]       = useState('todos')
  const [toast, setToast]                           = useState(null)

  useEffect(() => { cargar() }, [cargar])

  const filtrar = (cat) => {
    setCategoriaActiva(cat)
    cargar(cat === 'todos' ? null : cat)
  }

  const agregarProducto = (p) => {
    carritoHook.agregar(p)
    setToast(`✅ ${p.nombre} agregado`)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">

      {/* HERO */}
      <section className="bg-gradient-to-br from-light-accent to-light-accent/80 dark:from-dark-surface dark:to-dark-background min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-44 h-44 rounded-full border-4 border-light-accent-secondary bg-light-surface flex items-center justify-center mb-8 shadow-2xl">
          <span className="font-serif text-light-accent text-xl font-bold leading-tight">NATIVA<br/><span className="text-light-accent-secondary">SUR</span></span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-light-surface dark:text-dark-text-primary mb-3">
          Nativa <span className="text-light-accent-secondary">Sur</span>
        </h1>
        <p className="text-light-surface/80 text-sm tracking-[4px] uppercase mb-6">{t('slogan')}</p>
        <p className="text-light-surface/85 text-lg max-width-xl max-w-lg leading-relaxed mb-8">
          Frutos secos de primera calidad, seleccionados en origen. Energía natural, sabor auténtico.
        </p>
        <a href="#productos" className="bg-light-accent-secondary hover:bg-yellow-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all hover:-translate-y-1">
          Ver productos
        </a>
      </section>

      {/* BENEFICIOS */}
      <section className="bg-light-surface-secondary dark:bg-dark-surface-secondary py-12 px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[['🌿','100% Natural'],['🌍','Importados'],['🚀','Envío a Chile'],['💚','Saludable']].map(([icon, label]) => (
          <div key={label} className="p-4">
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="font-serif text-light-accent dark:text-dark-accent font-bold">{label}</h3>
          </div>
        ))}
      </section>

      {/* PRODUCTOS */}
      <section className="py-16 px-4 md:px-10" id="productos">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-light-accent dark:text-dark-text-primary mb-2">Nuestros Productos</h2>
          <div className="w-16 h-1 bg-light-accent-secondary mx-auto rounded-full" />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => filtrar(cat)}
              className={`px-5 py-2 rounded-full border-2 text-sm font-semibold transition-all capitalize
                ${categoriaActiva === cat
                  ? 'bg-light-accent dark:bg-dark-accent text-white border-transparent'
                  : 'border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent hover:bg-light-accent/10'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-10">Cargando...</p>}
        {error   && <p className="text-center text-light-error dark:text-dark-error py-10">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map(p => (
            <div key={p.id}
              className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden">
              <div className="h-44 bg-light-background dark:bg-dark-background flex items-center justify-center text-6xl">
                {p.imagen ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" /> : p.emoji}
              </div>
              <div className="p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-light-accent-secondary dark:text-dark-accent-secondary">
                  {p.categoria}
                </span>
                <h3 className="font-serif text-lg text-light-accent dark:text-dark-text-primary mt-1 mb-1">{p.nombre}</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed mb-4">{p.descripcion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-light-accent dark:text-dark-text-primary">
                    ${p.precio.toLocaleString('es-CL')}
                  </span>
                  <button onClick={() => agregarProducto(p)}
                    className="bg-light-accent dark:bg-dark-accent hover:bg-light-accent/80 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTÓN CARRITO FLOTANTE */}
      <button onClick={() => setCarritoAbierto(true)}
        className="fixed bottom-6 right-6 bg-light-accent dark:bg-dark-accent text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform z-50">
        <FiShoppingCart />
        {carritoHook.cuenta > 0 && (
          <span className="absolute -top-1 -right-1 bg-light-accent-secondary text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {carritoHook.cuenta}
          </span>
        )}
      </button>

      {/* CARRITO LATERAL */}
      <Carrito
        isOpen={carritoAbierto}
        onClose={() => setCarritoAbierto(false)}
        carritoHook={carritoHook}
      />

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-light-accent text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg z-50 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  )
}

export default Tienda

export const pageMetadata = {
  path:        '/',
  label:       'Tienda',
  category:    'tienda',
  order:       1,
  locations:   ['nav'],
  icon:        'FiShoppingBag',
  isSearchable: false,
}
