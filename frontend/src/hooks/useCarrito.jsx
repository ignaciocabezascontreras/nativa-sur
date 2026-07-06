import { useState, useCallback } from 'react'
import { crearPedido } from '../utils/pedidosData.jsx'

export default function useCarrito() {
  const [carrito, setCarrito] = useState({})

  const agregar = useCallback((producto) => {
    setCarrito(prev => ({
      ...prev,
      [producto.id]: prev[producto.id]
        ? { ...prev[producto.id], cantidad: prev[producto.id].cantidad + 1 }
        : { ...producto, cantidad: 1 },
    }))
  }, [])

  const cambiarCantidad = useCallback((id, delta) => {
    setCarrito(prev => {
      const item = prev[id]
      if (!item) return prev
      const nueva = item.cantidad + delta
      if (nueva <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: { ...item, cantidad: nueva } }
    })
  }, [])

  const eliminar = useCallback((id) => {
    setCarrito(prev => { const { [id]: _, ...rest } = prev; return rest })
  }, [])

  const vaciar = useCallback(() => setCarrito({}), [])

  const items  = Object.values(carrito)
  const total  = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const cuenta = items.reduce((s, i) => s + i.cantidad, 0)

  const confirmarPedido = useCallback(async (datosEnvio) => {
    const body = {
      ...datosEnvio,
      items: items.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })),
    }
    const res = await crearPedido(body)
    vaciar()
    return res
  }, [items, vaciar])

  return { carrito, items, total, cuenta, agregar, cambiarCantidad, eliminar, vaciar, confirmarPedido }
}
