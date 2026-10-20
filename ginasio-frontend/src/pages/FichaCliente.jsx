import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCliente, atualizarCliente, alterarPlano, registarPagamento } from '../api/api'

const PLANOS = [
  { value: 'UMA_VEZ_SEMANA',      label: '1x semana — 21€' },
  { value: 'DUAS_VEZES_SEMANA',   label: '2x semana — 23€' },
  { value: 'TRES_VEZES_SEMANA',   label: '3x semana — 25€' },
  { value: 'QUATRO_VEZES_SEMANA', label: '4x semana — 27€' },
  { value: 'CINCO_VEZES_SEMANA',  label: '5x semana — 29€' },
  { value: 'SEIS_VEZES_SEMANA',   label: '6x semana — 30€' },
  { value: 'ESPECIAL',            label: 'Especial' },
]

export default function FichaCliente() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({})
  const [erroEdicao, setErroEdicao] = useState(null)
  const [novoPlano, setNovoPlano] = useState('')
  const [pagForm, setPagForm] = useState({ valor: '', descricao: '', metodoPagamento: 'DINHEIRO', dataPagamento: '', notas: '' })
  const [mostrarPagForm, setMostrarPagForm] = useState(false)

  function abrirFormPagamento() {
    const valorInicial = cliente.plano === 'ESPECIAL' ? '' : (cliente.precoMensal ?? '')
    setPagForm({ valor: valorInicial, descricao: '', metodoPagamento: 'DINHEIRO', dataPagamento: '', notas: '' })
    setMostrarPagForm(true)
  }

  useEffect(() => { carregar() }, [id])

  function carregar() {
    getCliente(id).then(c => {
      setCliente(c)
      setForm({
        nome: c.nome,
        dataNascimento: c.dataNascimento || '',
        telefone: c.telefone || '',
        email: c.email || '',
        morada: c.morada || '',
        nif: c.nif || '',
        localidade: c.localidade || '',
        codigoPostal: c.codigoPostal || '',
        notas: c.notas || '',
        ativo: c.ativo
      })
      setNovoPlano('')
    })
  }

  async function handleGuardar() {
    if (form.telefone && !/^[0-9]{9,10}$/.test(form.telefone)) {
      setErroEdicao('Telefone deve ter 9 a 10 dígitos numéricos.')
      return
    }
    if (form.nif && !/^[0-9]{9}$/.test(form.nif)) {
      setErroEdicao('NIF deve ter 9 dígitos numéricos.')
      return
    }
    if (!form.dataNascimento) {
      setErroEdicao('A data de nascimento é obrigatória.')
      return
    }
    const nascimento = new Date(form.dataNascimento)
    const hoje = new Date()
    if (nascimento >= hoje) {
      setErroEdicao('Data de nascimento inválida.')
      return
    }
    setErroEdicao(null)
    await atualizarCliente(id, { ...form, plano: cliente.plano })
    setEditando(false)
    carregar()
  }

  async function handleAlterarPlano() {
    await alterarPlano(id, novoPlano)
    carregar()
  }

  async function handlePagamento(e) {
    e.preventDefault()
    
    await registarPagamento(id, {
      valor: Number(pagForm.valor),
      descricao: pagForm.descricao,
      metodoPagamento: pagForm.metodoPagamento,
      dataPagamento: pagForm.dataPagamento || null,
      notas: pagForm.notas || null
    })
    
    setPagForm({ valor: '', descricao: '', metodoPagamento: 'DINHEIRO', dataPagamento: '', notas: '' })
    setMostrarPagForm(false)
    carregar()
  }

  if (!cliente) return <p>A carregar...</p>

  return (
    <div>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
        ← Voltar
      </button>

      {/* Dados do cliente */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2>{cliente.nome}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className={cliente.ativo ? 'badge-ativo' : 'badge-inativo'}>
              {cliente.ativo ? 'Ativo' : 'Inativo'}
            </span>
            <button className="btn-secondary" onClick={() => setEditando(v => !v)}>
              {editando ? 'Cancelar' : 'Editar'}
            </button>
          </div>
        </div>

        {editando ? (
          <div>
            <label>Nome</label>
            <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            
            <label>NIF</label>
            <input
              name="nif"
              inputMode="numeric"
              maxLength={9}
              value={form.nif}
              onChange={e => setForm(f => ({ ...f, nif: e.target.value.replace(/\D/g, '') }))}
            />

            <label>Data de nascimento</label>
            <input
              type="date"
              value={form.dataNascimento || ''}
              onChange={e => setForm(f => ({ ...f, dataNascimento: e.target.value }))}
            />
            
            <label>Telefone (opcional)</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.telefone}
              onChange={e => setForm(f => ({ ...f, telefone: e.target.value.replace(/\D/g, '') }))}
            />
            
            <label>Email</label>
            <input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            
            <label>Morada</label>
            <input value={form.morada || ''} onChange={e => setForm(f => ({ ...f, morada: e.target.value }))} />
            
            <label>Localidade</label>
            <input name="localidade" value={form.localidade || ''} onChange={e => setForm(f => ({ ...f, localidade: e.target.value }))} />
            
            <label>Código postal</label>
            <input
              name="codigoPostal"
              placeholder="0000-000"
              maxLength={8}
              value={form.codigoPostal || ''}
              onChange={e => setForm(f => ({ ...f, codigoPostal: e.target.value }))}
            />

            <label>Notas</label>
            <textarea rows={3} value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
            
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <input type="checkbox" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} style={{ width: 'auto', margin: 0 }} />
              Cliente ativo
            </label>
            
            {erroEdicao && <p style={{ color: '#e57373', marginBottom: 12 }}>{erroEdicao}</p>}
            
            <button className="btn-primary" onClick={handleGuardar}>Guardar</button>
          </div>
        ) : (
          <table>
            <tbody>
              <tr><td><strong>ID</strong></td><td>#{cliente.id}</td></tr>
              <tr><td><strong>NIF</strong></td><td>{cliente.nif || '—'}</td></tr>
              <tr><td><strong>Data de nascimento</strong></td><td>{cliente.dataNascimento || '—'}</td></tr>
              <tr><td><strong>Idade</strong></td><td>{cliente.idade != null ? `${cliente.idade} anos` : '—'}</td></tr>
              <tr><td><strong>Telefone</strong></td><td>{cliente.telefone || '—'}</td></tr>
              <tr><td><strong>Email</strong></td><td>{cliente.email || '—'}</td></tr>
              <tr><td><strong>Morada</strong></td><td>{cliente.morada || '—'}</td></tr>
              <tr><td><strong>Localidade</strong></td><td>{cliente.localidade || '—'}</td></tr>
              <tr><td><strong>Código postal</strong></td><td>{cliente.codigoPostal || '—'}</td></tr>
              <tr><td><strong>Inscrito em</strong></td><td>{cliente.dataInscricao}</td></tr>
              <tr><td><strong>Notas</strong></td><td style={{ whiteSpace: 'pre-wrap' }}>{cliente.notas || '—'}</td></tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Plano de subscrição */}
      <div className="card">
        <h2>Plano de subscrição</h2>
        <p style={{ marginBottom: 12 }}>
          Plano atual: <strong>{PLANOS.find(p => p.value === cliente.plano)?.label ?? cliente.plano}</strong>
          {cliente.plano !== 'ESPECIAL' && (
            <span> — <strong>{cliente.precoMensal}€/mês</strong></span>
          )}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={novoPlano}
            onChange={e => setNovoPlano(e.target.value)}
            style={{ marginBottom: 0 }}>
            {PLANOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <button
            className="btn-primary"
            onClick={handleAlterarPlano}
            disabled={novoPlano === cliente.plano}>
            Alterar plano
          </button>
        </div>
      </div>

      {/* Pagamentos */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2>Histórico de pagamentos</h2>
          <button className="btn-primary" onClick={() => mostrarPagForm ? setMostrarPagForm(false) : abrirFormPagamento()}>
            {mostrarPagForm ? 'Cancelar' : '+ Registar pagamento'}
          </button>
        </div>

        {mostrarPagForm && (
          <form onSubmit={handlePagamento} style={{ marginBottom: 20 }}>
            <label>Valor (€)</label>
            <input
              type="number"
              step="0.01"
              value={pagForm.valor}
              onChange={e => setPagForm(f => ({ ...f, valor: e.target.value }))}
              readOnly={cliente.plano !== 'ESPECIAL'}
              required
              style={cliente.plano !== 'ESPECIAL' ? {
                background: '#1a1a1a',
                color: '#888',
                cursor: 'not-allowed',
                border: '1px solid #2a2a2a'
              } : {}}
            />
            {cliente.plano !== 'ESPECIAL' && (
              <p style={{ fontSize: 12, color: '#888', marginTop: -8, marginBottom: 12 }}>
                Valor definido pelo plano — não editável
              </p>
            )}
            <label>Descrição</label>
            <input value={pagForm.descricao} onChange={e => setPagForm(f => ({ ...f, descricao: e.target.value }))} placeholder="ex: Mensalidade Julho 2026" />
            <label>Método</label>
            <select value={pagForm.metodoPagamento} onChange={e => setPagForm(f => ({ ...f, metodoPagamento: e.target.value }))}>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="MBWAY">MBway</option>
            </select>
            <label>Data do pagamento</label>
            <input type="date" value={pagForm.dataPagamento} onChange={e => setPagForm(f => ({ ...f, dataPagamento: e.target.value }))} />
            <label>Notas do pagamento</label>
            <textarea value={pagForm.notas} onChange={e => setPagForm(f => ({ ...f, notas: e.target.value }))} rows={2} placeholder="ex: Pagou em atraso" />
            <button className="btn-primary" type="submit">Registar</button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Notas</th>
              <th>Método</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {cliente.pagamentos.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>Sem pagamentos registados</td></tr>
            )}
            {[...cliente.pagamentos].reverse().map(p => (
              <tr key={p.id}>
                <td>{p.dataPagamento}</td>
                <td>{p.descricao || '—'}</td>
                <td>{p.notas || '—'}</td>
                <td>{p.metodoPagamento === 'MBWAY' ? 'MBway' : 'Dinheiro'}</td>
                <td><strong>{p.valor}€</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}