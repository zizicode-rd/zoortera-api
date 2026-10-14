import { useState } from 'react'
import './App.css'

function App() {
  const [token, setToken] = useState<string>(localStorage.getItem('adminToken') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState<any>(null)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      setToken(data.token)
      localStorage.setItem('adminToken', data.token)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchStats = async () => {
    const res = await fetch(`${apiUrl}/api/v1/admin/dashboard/stats`, {
      headers: { 'X-Admin-Token': token }
    })
    const data = await res.json()
    setStats(data)
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zoortera-900 text-zoortera-50">
        <form onSubmit={login} className="bg-zoortera-800 p-8 rounded-xl border border-zoortera-700 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Zoortera Admin</h1>
          {error && <p className="text-zoortera-danger mb-4 text-sm">{error}</p>}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-zoortera-900 border border-zoortera-700 focus:border-zoortera-accent outline-none"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-zoortera-900 border border-zoortera-700 focus:border-zoortera-accent outline-none"
            />
            <button type="submit" className="w-full py-2 bg-zoortera-accent rounded-lg font-semibold hover:bg-blue-700 transition">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zoortera-900 text-zoortera-50 p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard Zoortera</h1>
        <div className="space-x-2">
          <button onClick={fetchStats} className="px-4 py-2 bg-zoortera-700 rounded-lg hover:bg-zoortera-600 transition">
            Cargar estadísticas
          </button>
          <button onClick={() => { setToken(''); localStorage.removeItem('adminToken') }} className="px-4 py-2 bg-zoortera-danger rounded-lg hover:bg-red-700 transition">
            Salir
          </button>
        </div>
      </header>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zoortera-800 p-4 rounded-xl border border-zoortera-700">
            <p className="text-zoortera-300 text-sm">Usuarios</p>
            <p className="text-2xl font-bold">{stats.total_users}</p>
          </div>
          <div className="bg-zoortera-800 p-4 rounded-xl border border-zoortera-700">
            <p className="text-zoortera-300 text-sm">Boletos emitidos</p>
            <p className="text-2xl font-bold">{stats.total_tickets_issued}</p>
          </div>
          <div className="bg-zoortera-800 p-4 rounded-xl border border-zoortera-700">
            <p className="text-zoortera-300 text-sm">Boletos gastados</p>
            <p className="text-2xl font-bold">{stats.total_tickets_spent}</p>
          </div>
          <div className="bg-zoortera-800 p-4 rounded-xl border border-zoortera-700">
            <p className="text-zoortera-300 text-sm">Sorteos abiertos</p>
            <p className="text-2xl font-bold">{stats.open_draws}</p>
          </div>
        </div>
      )}

      <section className="bg-zoortera-800 p-6 rounded-xl border border-zoortera-700">
        <h2 className="text-lg font-semibold mb-4">Módulos disponibles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Usuarios', 'Wallet', 'Sorteos', 'Referidos', 'Cupones', 'Productos', 'Logs', 'Settings'].map((m) => (
            <div key={m} className="p-4 bg-zoortera-700 rounded-lg text-center hover:bg-zoortera-600 transition cursor-pointer">
              {m}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
