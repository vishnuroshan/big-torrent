import { mockTorrents, mockTransferInfo } from './mockData'

async function fetchJson(url) {
  const response = await fetch(url)
  if (response.status === 403) {
    const error = new Error('Not authenticated')
    error.status = 403
    throw error
  }
  if (!response.ok) throw new Error(`Failed to fetch ${url}`)
  return response.json()
}

export function fetchTransferInfo() {
  if (import.meta.env.DEV) return Promise.resolve(mockTransferInfo)
  return fetchJson('/api/v2/transfer/info')
}

export function fetchTorrents() {
  if (import.meta.env.DEV) return Promise.resolve(mockTorrents)
  return fetchJson('/api/v2/torrents/info')
}

export async function login(username, password) {
  const response = await fetch('/api/v2/auth/login', {
    method: 'POST',
    body: new URLSearchParams({ username, password }),
  })
  const text = await response.text()
  if (text !== 'Ok.') throw new Error('Invalid username or password')
}
