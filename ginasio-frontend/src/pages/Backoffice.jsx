import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getEstatisticasGerais, getReceitaMensal, getReceitaPorMetodo, getClientesEmAtraso, getReceitaPorPlano, getRetencao } from '../api/api'

const PLANO_LABEL = {
  UMA_VEZ_SEMANA:      '1x/sem',
  DUAS_VEZES_SEMANA:   '2x/sem',
  TRES_VEZES_SEMANA:   '3x/sem',
  QUATRO_VEZES_SEMANA: '4x/sem',
  CINCO_VEZES_SEMANA:  '5x/sem',
  SEIS_VEZES_SEMANA:   '6x/sem',
  ESPECIAL:            'Especial',
}

export default function Backoffice() {
  const [gerais, setGerais] = useState(null)
  const [receitaMensal, setReceitaMensal] = useState([])
  const [receitaMetodo, setReceitaMetodo] = useState(null)
  const [atrasos, setAtrasos] = useState([])
  const [meses, setMeses] = useState(6)
  const [receitaPlano, setReceitaPlano] = useState([])
  const [mesesPlano, setMesesPlano] = useState(6)
  const [retencao, setRetencao] = useState([])
  const [mesesRetencao, setMesesRetencao] = useState(6)

  const agora = new Date()
  const [ano, setAno] = useState(agora.getFullYear())
  const [mes, setMes] = useState(agora.getMonth() + 1)

  useEffect(() => {
    getEstatisticasGerais().then(setGerais)
    getClientesEmAtraso().then(setAtrasos)
  }, [])

  useEffect(() => {
    getReceitaMensal(meses).then(setReceitaMensal)
  }, [meses])

  useEffect(() => {
    getReceitaPorMetodo(ano, mes).then(setReceitaMetodo)
  }, [ano, mes])

  useEffect(() => {
    getReceitaPorPlano(mesesPlano).then(setReceitaPlano)
  }, [mesesPlano])

  useEffect(() => {
    getRetencao(mesesRetencao).then(setRetencao)
  }, [mesesRetencao])

  if (!gerais) return <p>A carregar...</p>

  const distribuicaoData = Object.entries(gerais.distribuicaoPorPlano).map(([plano, total]) => ({
    name: PLANO_LABEL[plano] ?? plano,
    clientes: total
  }))

  const receitaData = receitaMensal.map(r => ({
    name: r.mes,
    total: Number(r.total)
  }))

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Backoffice</h1>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiCard label="Total de clientes" valor={gerais.totalClientes} />
        <KpiCard label="Clientes ativos" valor={gerais.clientesAtivos} cor="#2e7d32" />
        <KpiCard label="Receita esperada" valor={`${gerais.receitaEsperadaMes}€`} />
        <KpiCard label="Receita real (mês)" valor={`${gerais.receitaRealMes}€`} cor="#1565c0" />
      </div>

      {/* Receita mensal */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2>Receita mensal</h2>
          <select value={meses} onChange={e => setMeses(Number(e.target.value))} style={{ width: 'auto', marginBottom: 0 }}>
            <option value={3}>Últimos 3 meses</option>
            <option value={6}>Últimos 6 meses</option>
            <option value={12}>Últimos 12 meses</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={receitaData}>
            {/* Novas props inseridas abaixo */}
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} />
            <YAxis tick={{ fontSize: 12, fill: '#888' }} unit="€" />
            <Tooltip
              cursor={{ fill: 'rgba(245, 196, 0, 0.15)' }}
              contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
              labelStyle={{ color: '#e8e8e8' }}
              itemStyle={{ color: '#f5c400' }}
              formatter={v => `${v}€`}
            />
            <Bar dataKey="total" fill="#f5c400" radius={[4, 4, 0, 0]} name="Receita" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Receita por método + distribuição de planos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Receita por método de pagamento */}
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Receita por método</h2>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <select value={mes} onChange={e => setMes(Number(e.target.value))} style={{ marginBottom: 0 }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <select value={ano} onChange={e => setAno(Number(e.target.value))} style={{ marginBottom: 0 }}>
              {[2024, 2025, 2026].map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          {receitaMetodo && (
            <table>
              <tbody>
                <tr>
                  <td>Dinheiro</td>
                  <td><strong>{receitaMetodo.totalDinheiro}€</strong></td>
                </tr>
                <tr>
                  <td>MBway</td>
                  <td><strong>{receitaMetodo.totalMbway}€</strong></td>
                </tr>
                <tr style={{ borderTop: '2px solid #eee' }}>
                  <td><strong>Total</strong></td>
                  <td><strong>{receitaMetodo.totalGeral}€</strong></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Distribuição de planos */}
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Clientes por plano</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distribuicaoData}>
              {/* Novas props inseridas abaixo (sem a unidade '€' e formatador adaptado para contagem) */}
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(245, 196, 0, 0.15)' }}
                contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
                labelStyle={{ color: '#e8e8e8' }}
                itemStyle={{ color: '#f5c400' }}
                formatter={v => [`${v} clientes`, 'Clientes']}
              />
              <Bar dataKey="clientes" fill="#f5c400" radius={[4, 4, 0, 0]} name="Clientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Receita por plano */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2>Receita por plano</h2>
            <select
              value={mesesPlano}
              onChange={e => setMesesPlano(Number(e.target.value))}
              style={{ width: 'auto', marginBottom: 0 }}>
              <option value={3}>Últimos 3 meses</option>
              <option value={6}>Últimos 6 meses</option>
              <option value={12}>Últimos 12 meses</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={receitaPlano.map(r => ({
              name: PLANO_LABEL[r.plano] ?? r.plano,
              total: Number(r.total)
            }))}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} unit="€" />
              <Tooltip
                cursor={{ fill: 'rgba(245, 196, 0, 0.15)' }}
                contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
                labelStyle={{ color: '#e8e8e8' }}
                itemStyle={{ color: '#f5c400' }}
                formatter={v => `${v}€`}
              />
              <Bar dataKey="total" fill="#f5c400" radius={[4, 4, 0, 0]} name="Receita" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Taxa de retenção */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2>Taxa de retenção</h2>
            <select
              value={mesesRetencao}
              onChange={e => setMesesRetencao(Number(e.target.value))}
              style={{ width: 'auto', marginBottom: 0 }}>
              <option value={3}>Últimos 3 meses</option>
              <option value={6}>Últimos 6 meses</option>
              <option value={12}>Últimos 12 meses</option>
            </select>
          </div>

          {retencao.length === 0 ? (
            <p style={{ color: '#888' }}>Dados insuficientes — precisas de pagamentos em pelo menos 2 meses consecutivos.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={retencao.map(r => ({
                  name: r.mes,
                  taxa: Number(r.taxaRetencao)
                }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#888' }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(245, 196, 0, 0.15)' }}
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
                    labelStyle={{ color: '#e8e8e8' }}
                    itemStyle={{ color: '#f5c400' }}
                    formatter={v => `${v}%`}
                  />
                  <Bar dataKey="taxa" fill="#f5c400" radius={[4, 4, 0, 0]} name="Retenção" />
                </BarChart>
              </ResponsiveContainer>

              <table style={{ marginTop: 16 }}>
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Ativos mês anterior</th>
                    <th>Pagaram este mês</th>
                    <th>Taxa de retenção</th>
                  </tr>
                </thead>
                <tbody>
                  {retencao.map(r => (
                    <tr key={r.mes}>
                      <td>{r.mes}</td>
                      <td>{r.clientesAtivosAnterior}</td>
                      <td>{r.clientesQuePagaram}</td>
                      <td style={{ color: r.taxaRetencao >= 80 ? '#4caf50' : r.taxaRetencao >= 60 ? '#f5c400' : '#e57373', fontWeight: 600 }}>
                        {r.taxaRetencao}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Clientes em atraso */}
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>
          Clientes em atraso
          {atrasos.length > 0 && (
            <span style={{ marginLeft: 8, background: '#fce8e6', color: '#c62828', padding: '2px 10px', borderRadius: 12, fontSize: 13 }}>
              {atrasos.length}
            </span>
          )}
        </h2>
        {atrasos.length === 0 ? (
          <p style={{ color: '#999' }}>Nenhum cliente em atraso este mês.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Último pagamento</th>
              </tr>
            </thead>
            <tbody>
              {atrasos.map(c => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{c.nome}</td>
                  <td>{c.telefone || '—'}</td>
                  <td style={{ color: '#c62828' }}>{c.ultimoPagamento ?? 'Nunca pagou'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function KpiCard({ label, valor, cor = '#e8e8e8' }) {
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: cor }}>{valor}</p>
    </div>
  )
}