import api from './api.jsx'

export async function getProductos(categoria = null) {
  const params = categoria ? `?categoria=${categoria}` : ''
  return api({ method: 'GET', endpoint: `/productos${params}` })
}

export async function getProducto(id) {
  return api({ method: 'GET', endpoint: `/productos/${id}` })
}

export async function getProductosAdmin() {
  return api({ method: 'GET', endpoint: '/productos/admin/todos' })
}

export async function crearProducto(body) {
  return api({ method: 'POST', endpoint: '/productos', data: body })
}

export async function actualizarProducto(id, body) {
  return api({ method: 'PUT', endpoint: `/productos/${id}`, data: body })
}

export async function eliminarProducto(id) {
  return api({ method: 'DELETE', endpoint: `/productos/${id}` })
}
