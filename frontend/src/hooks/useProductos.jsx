import { useState, useCallback } from 'react'
import { getProductos, getProductosAdmin, crearProducto, actualizarProducto, eliminarProducto } from '../utils/productosData.jsx'

export default function useProductos() {
  const [productos, setProductos]   = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const cargar = useCallback(async (categoria = null) => {
    setLoading(true); setError(null)
    try {
      const data = await getProductos(categoria)
      setProductos(data)
      return data
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [])

  const cargarAdmin = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await getProductosAdmin()
      setProductos(data)
      return data
    } catch (e) {
      setError(e.response?.data?.detail || 'Error')
    } finally { setLoading(false) }
  }, [])

  const crear = useCallback(async (body) => {
    const nuevo = await crearProducto(body)
    setProductos(prev => [...prev, nuevo])
    return nuevo
  }, [])

  const actualizar = useCallback(async (id, body) => {
    const updated = await actualizarProducto(id, body)
    setProductos(prev => prev.map(p => p.id === id ? updated : p))
    return updated
  }, [])

  const eliminar = useCallback(async (id) => {
    await eliminarProducto(id)
    setProductos(prev => prev.filter(p => p.id !== id))
  }, [])

  return { productos, loading, error, cargar, cargarAdmin, crear, actualizar, eliminar }
}
