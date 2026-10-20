import { useState } from 'react'
import { login } from '../api/api'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [erro, setErro] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    try {
      await login(form.username, form.password)
      onLogin()
    } catch {
      setErro('Username ou password incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111111' }}>
      <div className="card" style={{ width: 360 }}>
        <h1 className="logo" style={{ fontSize: 22, marginBottom: 24, textAlign: 'center' }}>AtivoFitness</h1>
        {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          <button className="btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}