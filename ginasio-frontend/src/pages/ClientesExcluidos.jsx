import { useEffect, useState } from 'react'
import { getExcluidosManual, getExcluidosInatividade, reativarCliente } from '../api/api'

export default function ClientesExcluidos() {
  const [manual, setManual] = useState([])
  const [inatividade, setInatividade] = useState([])
  const [tab, setTab] = useState('manual')
  const [filtro, setFiltro] = useState('')

  useEffect(() => { carregar() }, [])

  function carregar() {
    getExcluidosManual().then(setManual)
    getExcluidosInatividade().then(setInatividade)
  }

  async function handleReativar(id) {
    if (!confirm('Reativar este cliente?')) return
    await reativarCliente(id)
    carregar()
  }

  const lista = (tab === 'manual' ? manual : inatividade).filter(c =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Clientes excluídos</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          className={tab === 'manual' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('manual')}>
          Excluídos manualmente ({manual.length})
        </button>
        <button
          className={tab === 'inatividade' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('inatividade')}>
          Excluídos por inatividade ({inatividade.length})
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Pesquisar por nome..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      <div className="card">
        {lista.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>
            {filtro ? `Nenhum cliente encontrado para "${filtro}"` : 'Nenhum cliente nesta categoria.'}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Plano</th>
                <th>Data exclusão</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.map(c => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{c.nome}</td>
                  <td>{c.telefone || '—'}</td>
                  <td>{c.plano}</td>
                  <td style={{ color: '#c62828' }}>{c.dataExclusao}</td>
                  <td>
                    <button className="btn-primary" onClick={() => handleReativar(c.id)}>
                      Reativar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}