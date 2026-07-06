import api from './api.jsx'

export async function crearPedido(body) {
  return api({ method: 'POST', endpoint: '/pedidos', data: body })
}

export async function getPedidos(estado = null) {
  const params = estado ? `?estado=${estado}` : ''
  return api({ method: 'GET', endpoint: `/pedidos${params}` })
}

export async function getMisPedidos() {
  return api({ method: 'GET', endpoint: '/pedidos/mios' })
}

export async function getPedido(id) {
  return api({ method: 'GET', endpoint: `/pedidos/${id}` })
}

export async function cambiarEstadoPedido(id, estado) {
  return api({ method: 'PATCH', endpoint: `/pedidos/${id}/estado`, data: { estado } })
}
