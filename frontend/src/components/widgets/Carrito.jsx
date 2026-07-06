import React, { useState } from 'react'
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'

const REGIONES = ['Región Metropolitana',"O'Higgins",'Valparaíso','Biobío','La Araucanía','Maule',
  'Coquimbo','Atacama','Antofagasta','Tarapacá','Los Lagos','Los Ríos','Aysén','Magallanes',
  'Arica y Parinacota','Ñuble']

const Carrito = ({ isOpen, onClose, carritoHook }) => {
  const { items, total, cuenta, cambiarCantidad, eliminar, confirmarPedido } = carritoHook
  const [paso, setPaso] = useState('carrito') // 'carrito' | 'checkout'
  const [form, setForm] = useState({ nombre:'', apellido:'', email:'', telefono:'', direccion:'', ciudad:'', region:'', metodo_pago:'webpay' })
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito]       = useState(null)
  const [error, setError]       = useState(null)

  const whatsappLink = () => {
    if (items.length === 0) return 'https://wa.me/56900000000'
    const texto = 'Hola Nativa Sur! Quiero hacer el siguiente pedido:\n'
      + items.map(i => `- ${i.cantidad}x ${i.nombre}: $${(i.precio*i.cantidad).toLocaleString('es-CL')}`).join('\n')
      + `\n\n*Total: $${total.toLocaleString('es-CL')}*`
    return `https://wa.me/56900000000?text=${encodeURIComponent(texto)}`
  }

  const handlePago = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.region) { setError('Completa todos los campos'); return }
    setEnviando(true); setError(null)
    try {
      const res = await confirmarPedido({ ...form, nombre: `${form.nombre} ${form.apellido}` })
      setExito(res)
      setPaso('carrito')
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al procesar el pedido')
    } finally { setEnviando(false) }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-light-surface dark:bg-dark-surface z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="bg-light-accent dark:bg-dark-surface text-white px-5 py-4 flex items-center justify-between">
          <h3 className="font-serif text-xl">{paso === 'carrito' ? '🛒 Mi Pedido' : '🛍 Finalizar Pedido'}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl"><FiX /></button>
        </div>

        {/* Éxito */}
        {exito && (
          <div className="m-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 font-bold text-lg mb-1">✅ ¡Pedido #{exito.id} creado!</p>
            <p className="text-green-600 text-sm">Te contactaremos pronto para coordinar el pago y envío.</p>
            <button onClick={() => setExito(null)} className="mt-3 text-green-700 underline text-sm">Cerrar</button>
          </div>
        )}

        {/* PASO: CARRITO */}
        {paso === 'carrito' && !exito && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0
                ? <div className="text-center py-16 text-light-text-secondary dark:text-dark-text-secondary"><p className="text-4xl mb-3">🌰</p><p>Tu pedido está vacío</p></div>
                : items.map(i => (
                    <div key={i.id} className="flex items-center gap-3 py-3 border-b border-light-border dark:border-dark-border">
                      <span className="text-3xl w-10 text-center">{i.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-light-accent dark:text-dark-text-primary">{i.nombre}</p>
                        <p className="text-light-accent-secondary dark:text-dark-accent-secondary text-sm font-bold">
                          ${(i.precio * i.cantidad).toLocaleString('es-CL')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => cambiarCantidad(i.id, -1)} className="w-7 h-7 rounded-full bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border flex items-center justify-center hover:bg-light-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors"><FiMinus size={12}/></button>
                        <span className="w-6 text-center text-sm font-bold text-light-text-primary dark:text-dark-text-primary">{i.cantidad}</span>
                        <button onClick={() => cambiarCantidad(i.id, +1)} className="w-7 h-7 rounded-full bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border flex items-center justify-center hover:bg-light-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors"><FiPlus size={12}/></button>
                      </div>
                      <button onClick={() => eliminar(i.id)} className="text-light-error dark:text-dark-error hover:opacity-70 ml-1"><FiTrash2 size={14}/></button>
                    </div>
                  ))
              }
            </div>
            <div className="px-5 py-4 border-t border-light-border dark:border-dark-border space-y-3">
              <div className="flex justify-between font-bold text-lg text-light-accent dark:text-dark-text-primary">
                <span>Total</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
              <a href={whatsappLink()} target="_blank" rel="noreferrer"
                className="block w-full bg-[#25d366] hover:bg-[#1ebe5c] text-white text-center py-3 rounded-full font-bold transition-colors">
                📲 Pedir por WhatsApp
              </a>
              {items.length > 0 && (
                <button onClick={() => setPaso('checkout')}
                  className="block w-full bg-light-accent-secondary dark:bg-dark-accent-secondary hover:opacity-90 text-white text-center py-3 rounded-full font-bold transition-opacity">
                  💳 Pagar con tarjeta
                </button>
              )}
            </div>
          </>
        )}

        {/* PASO: CHECKOUT */}
        {paso === 'checkout' && !exito && (
          <form onSubmit={handlePago} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {error && <p className="bg-red-50 text-light-error text-sm border border-red-200 rounded-lg p-3">{error}</p>}

            <h4 className="font-serif text-light-accent dark:text-dark-text-primary font-bold">Datos de envío</h4>
            <div className="grid grid-cols-2 gap-3">
              {[['nombre','Nombre'],['apellido','Apellido']].map(([f,l]) => (
                <div key={f}>
                  <label className="text-xs font-bold text-light-accent dark:text-dark-text-primary block mb-1">{l}</label>
                  <input required value={form[f]} onChange={e => setForm(p=>({...p,[f]:e.target.value}))}
                    className="w-full border-2 border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-light-accent dark:focus:border-dark-accent" />
                </div>
              ))}
            </div>
            {[['email','Email','email'],['telefono','Teléfono','tel'],['direccion','Dirección','text'],['ciudad','Ciudad','text']].map(([f,l,t]) => (
              <div key={f}>
                <label className="text-xs font-bold text-light-accent dark:text-dark-text-primary block mb-1">{l}</label>
                <input type={t} required={['email','direccion','ciudad'].includes(f)} value={form[f]} onChange={e => setForm(p=>({...p,[f]:e.target.value}))}
                  className="w-full border-2 border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-light-accent dark:focus:border-dark-accent" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-light-accent dark:text-dark-text-primary block mb-1">Región</label>
              <select required value={form.region} onChange={e => setForm(p=>({...p,region:e.target.value}))}
                className="w-full border-2 border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-light-accent dark:focus:border-dark-accent">
                <option value="">Selecciona...</option>
                {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <h4 className="font-serif text-light-accent dark:text-dark-text-primary font-bold pt-2">Método de pago</h4>
            <div className="grid grid-cols-2 gap-3">
              {[['webpay','💳','Webpay Plus'],['transferencia','🏦','Transferencia']].map(([val,icon,label]) => (
                <button key={val} type="button" onClick={() => setForm(p=>({...p,metodo_pago:val}))}
                  className={`border-2 rounded-xl p-3 text-center text-sm transition-all
                    ${form.metodo_pago === val
                      ? 'border-light-accent dark:border-dark-accent bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent'
                      : 'border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary'}`}>
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="font-semibold">{label}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between font-bold text-light-accent dark:text-dark-text-primary border-t border-light-border dark:border-dark-border pt-3">
              <span>Total a pagar</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>

            <div className="flex gap-3 pb-2">
              <button type="button" onClick={() => setPaso('carrito')}
                className="flex-1 border-2 border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary rounded-xl py-3 text-sm font-semibold hover:border-light-accent dark:hover:border-dark-accent transition-colors">
                ← Volver
              </button>
              <button type="submit" disabled={enviando}
                className="flex-1 bg-light-accent dark:bg-dark-accent text-white rounded-xl py-3 text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity">
                {enviando ? 'Procesando...' : 'Confirmar pedido'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default Carrito
