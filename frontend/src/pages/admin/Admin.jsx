import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPackage, FiShoppingBag, FiLogOut, FiPlus, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi'
import useAuth      from '../../hooks/useAuth.jsx'
import useProductos from '../../hooks/useProductos.jsx'
import usePedidos   from '../../hooks/usePedidos.jsx'

const ESTADOS = ['pendiente','pagado','preparando','enviado','entregado','cancelado']
const ESTADO_COLOR = {
  pendiente:  'bg-yellow-100 text-yellow-800',
  pagado:     'bg-blue-100 text-blue-800',
  preparando: 'bg-purple-100 text-purple-800',
  enviado:    'bg-indigo-100 text-indigo-800',
  entregado:  'bg-green-100 text-green-800',
  cancelado:  'bg-red-100 text-red-800',
}

const Admin = () => {
  const { session, isAdmin, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('pedidos')

  const { productos, loading: lprod, cargarAdmin, crear, actualizar, eliminar } = useProductos()
  const { pedidos,   loading: lped,  cargarTodos, cambiarEstado }               = usePedidos()

  const [formProd, setFormProd] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return }
    cargarAdmin()
    cargarTodos()
  }, [isAdmin])

  const handleGuardarProducto = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const body = {
        nombre:      formProd.nombre,
        descripcion: formProd.descripcion,
        precio:      Number(formProd.precio),
        stock:       Number(formProd.stock),
        categoria:   formProd.categoria,
        emoji:       formProd.emoji,
      }
      if (formProd.id) await actualizar(formProd.id, body)
      else             await crear(body)
      setFormProd(null)
    } finally { setGuardando(false) }
  }

  const productoVacio = { nombre:'', descripcion:'', precio:'', stock:'', categoria:'nueces', emoji:'🥜' }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">

      {/* TOPBAR */}
      <header className="bg-light-accent dark:bg-dark-surface text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="font-serif text-xl">Nativa <span className="text-light-accent-secondary dark:text-dark-accent-secondary">Sur</span> — Admin</h1>
          <p className="text-white/70 text-xs">Bienvenido, {session.nombre}</p>
        </div>
        <div className="flex gap-3 items-center">
          <a href="/" className="text-white/80 hover:text-white text-sm">← Ver tienda</a>
          <button onClick={() => { cerrarSesion(); navigate('/login') }}
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg text-sm transition-colors">
            <FiLogOut /> Salir
          </button>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border px-6 flex gap-2">
        {[['pedidos', FiShoppingBag, 'Pedidos'], ['productos', FiPackage, 'Productos']].map(([id, Icon, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors
              ${tab === id
                ? 'border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent'
                : 'border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-accent dark:hover:text-dark-accent'}`}>
            <Icon /> {label}
          </button>
        ))}
      </div>

      <main className="p-6">

        {/* ── PEDIDOS ── */}
        {tab === 'pedidos' && (
          <div>
            <h2 className="font-serif text-2xl text-light-accent dark:text-dark-text-primary mb-6">Gestión de Pedidos</h2>
            {lped && <p className="text-light-text-secondary">Cargando...</p>}
            <div className="space-y-4">
              {pedidos.map(p => (
                <div key={p.id} className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-light-accent dark:text-dark-text-primary">#{p.id} — {p.nombre}</p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{p.email} · {p.telefono}</p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{p.direccion}, {p.ciudad}, {p.region}</p>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">{p.creado_en}</p>
                      <div className="mt-2 space-y-1">
                        {(p.items || []).map((i, idx) => (
                          <span key={idx} className="inline-block bg-light-background dark:bg-dark-background text-light-text-secondary dark:text-dark-text-secondary text-xs px-2 py-1 rounded-full mr-1">
                            {i.cantidad}x {i.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-lg text-light-accent dark:text-dark-text-primary">
                        ${p.total.toLocaleString('es-CL')}
                      </p>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${ESTADO_COLOR[p.estado] || 'bg-gray-100'}`}>
                        {p.estado}
                      </span>
                      <select value={p.estado} onChange={e => cambiarEstado(p.id, e.target.value)}
                        className="text-xs border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary rounded-lg px-2 py-1">
                        {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {!lped && pedidos.length === 0 && (
                <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-10">No hay pedidos aún</p>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTOS ── */}
        {tab === 'productos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-light-accent dark:text-dark-text-primary">Gestión de Productos</h2>
              <button onClick={() => setFormProd({ ...productoVacio })}
                className="flex items-center gap-2 bg-light-accent dark:bg-dark-accent text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                <FiPlus /> Nuevo producto
              </button>
            </div>

            {/* Formulario */}
            {formProd && (
              <div className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border p-6 mb-6 shadow-md">
                <h3 className="font-serif text-lg text-light-accent dark:text-dark-text-primary mb-4">
                  {formProd.id ? 'Editar producto' : 'Nuevo producto'}
                </h3>
                <form onSubmit={handleGuardarProducto} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['nombre','Nombre','text',true],
                    ['precio','Precio (CLP)','number',true],
                    ['stock','Stock','number',false],
                    ['emoji','Emoji','text',false],
                  ].map(([field, label, type, required]) => (
                    <div key={field}>
                      <label className="block text-xs font-bold text-light-accent dark:text-dark-text-primary mb-1">{label}</label>
                      <input type={type} required={required} value={formProd[field] || ''}
                        onChange={e => setFormProd(p => ({...p, [field]: e.target.value}))}
                        className="w-full border-2 border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-light-accent dark:focus:border-dark-accent" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold text-light-accent dark:text-dark-text-primary mb-1">Categoría</label>
                    <select value={formProd.categoria} onChange={e => setFormProd(p => ({...p, categoria: e.target.value}))}
                      className="w-full border-2 border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-light-accent dark:focus:border-dark-accent">
                      {['nueces','semillas','mix','frutas'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-light-accent dark:text-dark-text-primary mb-1">Descripción</label>
                    <textarea value={formProd.descripcion || ''} onChange={e => setFormProd(p => ({...p, descripcion: e.target.value}))}
                      rows={2}
                      className="w-full border-2 border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-light-accent dark:focus:border-dark-accent resize-none" />
                  </div>
                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <button type="button" onClick={() => setFormProd(null)}
                      className="px-4 py-2 border-2 border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary rounded-xl text-sm hover:border-light-accent dark:hover:border-dark-accent transition-colors">
                      Cancelar
                    </button>
                    <button type="submit" disabled={guardando}
                      className="flex items-center gap-2 bg-light-accent dark:bg-dark-accent text-white px-6 py-2 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                      <FiCheck /> {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tabla */}
            <div className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-light-surface-secondary dark:bg-dark-surface-secondary">
                  <tr>
                    {['#','Producto','Categoría','Precio','Stock','Estado','Acciones'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id} className="border-t border-light-border dark:border-dark-border hover:bg-light-background dark:hover:bg-dark-background transition-colors">
                      <td className="px-4 py-3 text-light-text-secondary dark:text-dark-text-secondary">{p.id}</td>
                      <td className="px-4 py-3">
                        <span className="mr-2">{p.emoji}</span>
                        <span className="font-semibold text-light-accent dark:text-dark-text-primary">{p.nombre}</span>
                      </td>
                      <td className="px-4 py-3 text-light-text-secondary dark:text-dark-text-secondary capitalize">{p.categoria}</td>
                      <td className="px-4 py-3 font-bold text-light-accent dark:text-dark-text-primary">${p.precio.toLocaleString('es-CL')}</td>
                      <td className="px-4 py-3 text-light-text-secondary dark:text-dark-text-secondary">{p.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setFormProd({...p})}
                            className="text-light-accent dark:text-dark-accent hover:opacity-70 transition-opacity"><FiEdit2 /></button>
                          <button onClick={() => eliminar(p.id)}
                            className="text-light-error dark:text-dark-error hover:opacity-70 transition-opacity"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!lprod && productos.length === 0 && (
                <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-8">No hay productos</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Admin

export const pageMetadata = {
  path:        '/admin',
  label:       'Administrador',
  category:    'admin',
  minRoleLevel: 3,
  order:       99,
  locations:   [],
  icon:        'FiSettings',
  isSearchable: false,
}
