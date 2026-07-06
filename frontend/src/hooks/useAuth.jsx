import { useState, useCallback } from 'react'
import { login, registro, logout, getSession } from '../utils/authData.jsx'

export default function useAuth() {
  const [session, setSession] = useState(getSession)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const iniciarSesion = useCallback(async (email, password) => {
    setLoading(true); setError(null)
    try {
      const res = await login(email, password)
      setSession(getSession())
      return res
    } catch (e) {
      setError(e.response?.data?.detail || 'Credenciales incorrectas')
      throw e
    } finally { setLoading(false) }
  }, [])

  const registrarse = useCallback(async (nombre, email, password) => {
    setLoading(true); setError(null)
    try {
      const res = await registro(nombre, email, password)
      setSession(getSession())
      return res
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al registrarse')
      throw e
    } finally { setLoading(false) }
  }, [])

  const cerrarSesion = useCallback(() => {
    logout()
    setSession({ token: null, rol: null, nombre: null })
  }, [])

  return {
    session,
    loading,
    error,
    isAdmin:         session.rol === 'admin',
    isAuthenticated: !!session.token,
    iniciarSesion,
    registrarse,
    cerrarSesion,
  }
}
