import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getToken, removeToken } from './api/api'
import Login from './pages/Login'
import Clientes from './pages/Clientes'
import FichaCliente from './pages/FichaCliente'
import Backoffice from './pages/Backoffice'
import './App.css'
import ClientesExcluidos from './pages/ClientesExcluidos'

export default function App() {
  const [autenticado, setAutenticado] = useState(!!getToken())

  function handleLogout() {
    removeToken()
    setAutenticado(false)
  }

  if (!autenticado) {
    return <Login onLogin={() => setAutenticado(true)} />
  }

  return (
    <BrowserRouter>
      <div className="layout">
        <nav className="sidebar">
          <h1 className="logo">Ativo Fitness</h1>
          <NavLink to="/" end>Clientes</NavLink>
          <NavLink to="/backoffice">Backoffice</NavLink>
          <NavLink to="/excluidos">Excluídos</NavLink>
          <button
            onClick={handleLogout}
            style={{ marginTop: 'auto', background: 'transparent', color: '#aaa', border: '1px solid #444', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}>
            Sair
          </button>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Clientes />} />
            <Route path="/excluidos" element={<ClientesExcluidos />} />
            <Route path="/clientes/:id" element={<FichaCliente />} />
            <Route path="/backoffice" element={<Backoffice />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
  
}