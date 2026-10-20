import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientes, criarCliente, excluirCliente } from '../api/api'

const PLANOS = [
  { value: 'UMA_VEZ_SEMANA',    label: '1x semana — 21€' },
  { value: 'DUAS_VEZES_SEMANA', label: '2x semana — 23€' },
  { value: 'TRES_VEZES_SEMANA', label: '3x semana — 25€' },
  { value: 'QUATRO_VEZES_SEMANA', label: '4x semana — 27€' },
  { value: 'CINCO_VEZES_SEMANA', label: '5x semana — 29€' },
  { value: 'SEIS_VEZES_SEMANA',  label: '6x semana — 30€' },
  { value: 'ESPECIAL',           label: 'Especial' },
]

const PLANO_LABEL = Object.fromEntries(PLANOS.map(p => [p.value, p.label]))

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({
    nome: '', nif: '', dataNascimento: '', telefone: '',
    email: '', morada: '', localidade: '', codigoPostal: '',
    plano: 'UMA_VEZ_SEMANA', notas: ''
  })
  const [erro, setErro] = useState(null)
  const [filtro, setFiltro] = useState('')
  const navigate = useNavigate()

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  )

  useEffect(() => { carregar() }, [])

  function carregar() {
    getClientes().then(setClientes)
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function validar(form) {
    if (!form.nome.trim()) return 'O nome é obrigatório.'
    if (!form.dataNascimento) return 'A data de nascimento é obrigatória.'
    if (new Date(form.dataNascimento) >= new Date()) return 'Data de nascimento inválida.'
    if (form.telefone && !/^[0-9]{9,10}$/.test(form.telefone))
      return 'Telefone deve ter 9 a 10 dígitos numéricos.'
    return null
  }

  async function handleCriar(e) {
    e.preventDefault()
    
    const erroValidacao = validar(form)
    if (erroValidacao) { setErro(erroValidacao); return }
    setErro(null)
  
    const payloadParaEnviar = { ...form }
    Object.keys(payloadParaEnviar).forEach(key => {
      if (payloadParaEnviar[key] === '') {
        payloadParaEnviar[key] = null;
      }
    });
  
    try {
      const resposta = await criarCliente(payloadParaEnviar)
      
      // Se a tua API devolver um JSON de erro sem disparar o catch
      if (resposta && (resposta.status >= 400 || resposta.error)) {
        setErro(resposta.message || resposta.error || 'Erro ao criar cliente no backend.')
        return
      }
      
      // Sucesso!
      setForm({ 
        nome: '', nif: '', dataNascimento: '', telefone: '', 
        email: '', morada: '', localidade: '', codigoPostal: '', 
        plano: 'UMA_VEZ_SEMANA', notas: '' 
      })
      setMostrarForm(false)
      carregar()
      
    } catch (err) {
      console.error("Erro detalhado do backend:", err)
      
      // Se usares Axios, o erro costuma estar dentro de err.response.data
      if (err.response && err.response.data) {
        // Tenta apanhar a mensagem de erro específica do Spring Boot
        const msgBackend = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
        setErro(`Recusado pelo servidor: ${msgBackend}`)
      } else {
        setErro('Erro do servidor. Pressiona F12 e vê a consola para mais detalhes.')
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24 }}>Clientes</h1>
        <button className="btn-primary" onClick={() => setMostrarForm(v => !v)}>
          {mostrarForm ? 'Cancelar' : '+ Novo cliente'}
        </button>
      </div>

      {mostrarForm && (
        <div className="card">
          <h2>Novo cliente</h2>
          {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}
          <form onSubmit={handleCriar}>
            <label>Nome</label>
            <input name="nome" value={form.nome} onChange={handleChange} required />
            <label>Data de nascimento</label>
            <input
              name="dataNascimento"
              type="date"
              value={form.dataNascimento}
              onChange={handleChange}
              required
            />
            <label>NIF</label>
            <input
              name="nif"
              inputMode="numeric"
              maxLength={9}
              value={form.nif}
              onChange={e => setForm(f => ({ ...f, nif: e.target.value.replace(/\D/g, '') }))}
            />

            <label>Telefone (opcional)</label>
            <input
              name="telefone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.telefone}
              onChange={e => setForm(f => ({ ...f, telefone: e.target.value.replace(/\D/g, '') }))}
            />

            <label>Localidade</label>
            <input name="localidade" value={form.localidade} onChange={handleChange} />

            <label>Código postal</label>
            <input
              name="codigoPostal"
              placeholder="0000-000"
              maxLength={8}
              value={form.codigoPostal}
              onChange={handleChange}
            />
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
            <label>Morada</label>
            <input name="morada" value={form.morada} onChange={handleChange} />
            <label>Plano</label>
            <select name="plano" value={form.plano} onChange={handleChange}>
              {PLANOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <label>Notas</label>
            <textarea name="notas" value={form.notas} onChange={handleChange} rows={3} />
            <button className="btn-primary" type="submit">Criar cliente</button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Pesquisar por nome..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Nascimento</th>
              <th>Idade</th>
              <th>Telefone</th>
              <th>Plano</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map(c => (
              <tr key={c.id} onClick={() => navigate(`/clientes/${c.id}`)} style={{ cursor: 'pointer' }}>
                <td>#{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.dataNascimento || '—'}</td>
                <td>{c.idade != null ? `${c.idade} anos` : '—'}</td>
                <td>{c.telefone || '—'}</td>
                <td>{PLANO_LABEL[c.plano] ?? c.plano}</td>
                <td>
                  <span className={c.ativo ? 'badge-ativo' : 'badge-inativo'}>
                    {c.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                <button className="btn-danger" onClick={(e) => handleExcluir(e, c.id)}>
                    Excluir
                </button>
                </td>
              </tr>
            ))}
            {clientesFiltrados.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#999' }}>
                {filtro ? `Nenhum cliente encontrado para "${filtro}"` : 'Sem clientes ainda'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}