import { useState, useCallback } from 'react'
import { getPedidos, getMisPedidos, cambiarEstadoPedido } from '../utils/pedidosData.jsx'

export default function usePedidos() {
  const [pedidos,  setPedidos]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const cargarTodos = useCallback(async (estado = null) => {
    setLoading(true); setError(null)
    try {
      const data = await getPedidos(estado)
      setPedidos(data)
      return data
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al cargar pedidos')
    } finally { setLoading(false) }
  }, [])

  const cargarMios = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await getMisPedidos()
      setPedidos(data)
      return data
    } catch (e) {
      setError(e.response?.data?.detail || 'Error')
    } finally { setLoading(false) }
  }, [])

  const cambiarEstado = useCallback(async (id, estado) => {
    const res = await cambiarEstadoPedido(id, estado)
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
    return res
  }, [])

  return { pedidos, loading, error, cargarTodos, cargarMios, cambiarEstado }
}
