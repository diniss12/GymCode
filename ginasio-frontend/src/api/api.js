const BASE = '/api'

export const getToken = () => sessionStorage.getItem('token')
export const setToken = (t) => sessionStorage.setItem('token', t)
export const removeToken = () => sessionStorage.removeItem('token')

const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers
    }
  })

export const login = (username, password) =>
  fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(r => {
    if (!r.ok) throw new Error('Credenciais inválidas')
    return r.json()
  }).then(data => { setToken(data.token); return data })

// Clientes
export const getClientes = () =>
  authFetch(`${BASE}/clientes`).then(r => r.json())

export const getCliente = (id) =>
  authFetch(`${BASE}/clientes/${id}`).then(r => r.json())

export const criarCliente = (dados) =>
  authFetch(`${BASE}/clientes`, {
    method: 'POST',
    body: JSON.stringify(dados)
  }).then(r => r.json())

export const atualizarCliente = (id, dados) =>
  authFetch(`${BASE}/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  }).then(r => r.json())

export const excluirCliente = (id) =>
  authFetch(`${BASE}/clientes/${id}`, { method: 'DELETE' })

export const alterarPlano = (id, plano) =>
  authFetch(`${BASE}/clientes/${id}/plano`, {
    method: 'PATCH',
    body: JSON.stringify({ plano })
  }).then(r => r.json())

// Pagamentos
export const registarPagamento = (clienteId, dados) =>
  authFetch(`${BASE}/clientes/${clienteId}/pagamentos`, {
    method: 'POST',
    body: JSON.stringify(dados)
  }).then(r => r.json())

// Estatísticas
export const getEstatisticasGerais = () =>
  authFetch(`${BASE}/estatisticas/gerais`).then(r => r.json())

export const getReceitaMensal = (meses = 6) =>
  authFetch(`${BASE}/estatisticas/receita-mensal?meses=${meses}`).then(r => r.json())

export const getReceitaPorMetodo = (ano, mes) =>
  authFetch(`${BASE}/estatisticas/receita-por-metodo?ano=${ano}&mes=${mes}`).then(r => r.json())

export const getClientesEmAtraso = (diaLimite = 8) =>
  authFetch(`${BASE}/estatisticas/pagamentos-em-atraso?diaLimite=${diaLimite}`).then(r => r.json())

export const getReceitaPorPlano = (meses = 6) =>
  authFetch(`${BASE}/estatisticas/receita-por-plano?meses=${meses}`).then(r => r.json())

export const getRetencao = (meses = 6) =>
  authFetch(`${BASE}/estatisticas/retencao?meses=${meses}`).then(r => r.json())


export const getExcluidosManual = () =>
  authFetch(`${BASE}/clientes/excluidos/manual`).then(r => r.json())

export const getExcluidosInatividade = () =>
  authFetch(`${BASE}/clientes/excluidos/inatividade`).then(r => r.json())

export const reativarCliente = (id) =>
  authFetch(`${BASE}/clientes/${id}/reativar`, { method: 'PATCH' }).then(r => r.json())