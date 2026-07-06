import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.jsx'

const Login = () => {
  const { iniciarSesion, loading, error, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await iniciarSesion(form.email, form.password)
      navigate(res.rol === 'admin' ? '/admin' : '/')
    } catch {}
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background flex items-center justify-center px-4">
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl p-8 w-full max-w-md border border-light-border dark:border-dark-border">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-light-accent dark:text-dark-text-primary">Nativa <span className="text-light-accent-secondary">Sur</span></h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Iniciar sesión</p>
        </div>

        {error && <p className="bg-red-50 text-light-error border border-red-200 rounded-lg p-3 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-light-accent dark:text-dark-text-primary mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
              className="w-full border-2 border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary rounded-xl px-4 py-3 outline-none focus:border-light-accent dark:focus:border-dark-accent transition-colors"
              placeholder="correo@ejemplo.com" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-light-accent dark:text-dark-text-primary mb-1">Contraseña</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))}
              className="w-full border-2 border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary rounded-xl px-4 py-3 outline-none focus:border-light-accent dark:focus:border-dark-accent transition-colors"
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-light-accent dark:bg-dark-accent hover:bg-light-accent/80 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-light-accent dark:text-dark-accent font-bold hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

export default Login

export const pageMetadata = {
  path:      '/login',
  label:     'Login',
  category:  'auth',
  order:     10,
  locations: [],
  icon:      'FiLogIn',
}
