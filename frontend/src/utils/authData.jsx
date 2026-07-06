import api from './api.jsx'

export async function login(email, password) {
  const res = await api({ method: 'POST', endpoint: '/auth/login', data: { email, password } })
  localStorage.setItem('ns_token', res.token)
  localStorage.setItem('ns_rol',   res.rol)
  localStorage.setItem('ns_nombre',res.nombre)
  return res
}

export async function registro(nombre, email, password) {
  const res = await api({ method: 'POST', endpoint: '/auth/registro', data: { nombre, email, password } })
  localStorage.setItem('ns_token', res.token)
  localStorage.setItem('ns_rol',   res.rol)
  localStorage.setItem('ns_nombre',res.nombre)
  return res
}

export function logout() {
  localStorage.removeItem('ns_token')
  localStorage.removeItem('ns_rol')
  localStorage.removeItem('ns_nombre')
}

export function getSession() {
  return {
    token:  localStorage.getItem('ns_token'),
    rol:    localStorage.getItem('ns_rol'),
    nombre: localStorage.getItem('ns_nombre'),
  }
}
