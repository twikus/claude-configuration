import type { EngineInterface, Register } from 'claude-code'

// Portly's local API (macOS app first, Linux daemon second). Querying it
// directly never launches Portly.app the way the `portly` CLI does.
const API_PORTS = [7738, 7737]
const POLL_MS = 4000
const MAX_SHOWN = 6

type PortlyServer = {
  name: string
  projectName: string
  port?: number
  state: string
  healthy?: boolean
  startedAt?: string | null
}

type PortlyStatus = {
  data?: {
    projects?: { servers?: PortlyServer[] }[]
    temporaryServers?: PortlyServer[]
  }
}

let apiPort = API_PORTS[0] as number
let isEnabled = true
let shown: string | undefined

const isActive = (server: PortlyServer) =>
  server.port !== undefined && (server.state === 'running' || server.state === 'starting')

const slug = (text: string) =>
  text.trim().toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '')

// `app:port` for each running server, most recently started first; `…` while
// not yet healthy. A project with several running servers names each one.
function format(status: PortlyStatus) {
  const active = [
    ...(status.data?.projects ?? []).flatMap(project => project.servers ?? []),
    ...(status.data?.temporaryServers ?? []),
  ]
    .filter(isActive)
    .sort((a, b) => Date.parse(b.startedAt ?? '') - Date.parse(a.startedAt ?? '') || 0)

  if (active.length === 0) return undefined

  const perProject = new Map<string, number>()
  for (const one of active) {
    perProject.set(one.projectName, (perProject.get(one.projectName) ?? 0) + 1)
  }
  const label = (one: PortlyServer) =>
    (perProject.get(one.projectName) ?? 0) > 1
      ? `${slug(one.projectName)}/${slug(one.name)}`
      : slug(one.projectName)

  const ports = active
    .slice(0, MAX_SHOWN)
    .map(one => `${label(one)}:${one.port}${one.healthy ? '' : '…'}`)
  const more = active.length > MAX_SHOWN ? ` +${active.length - MAX_SHOWN}` : ''

  return `${ports.join(' · ')}${more}`
}

async function fetchStatus($: EngineInterface) {
  for (const candidate of [apiPort, ...API_PORTS.filter(one => one !== apiPort)]) {
    try {
      const response = await $.http.fetch(`http://127.0.0.1:${candidate}/status`)
      if (!response.ok) continue
      apiPort = candidate
      return JSON.parse(response.text) as PortlyStatus
    } catch {
      // Portly not listening on this port.
    }
  }
  return undefined
}

async function refresh($: EngineInterface) {
  const status = isEnabled ? await fetchStatus($) : undefined
  const text = status ? format(status) : undefined
  if (text === shown) return
  shown = text
  $.ui.status(text)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    isEnabled = (await $.store.get('isEnabled')) !== false
    shown = undefined
    await $.command.register({
      name: 'portly-ports',
      description: 'Toggle Portly ports in the status line',
    })
    void refresh($)
    $.clock.every(POLL_MS, () => void refresh($))

    return next(e)
  })

  on('command.run', { command: 'portly-ports' }, async $ => {
    isEnabled = !isEnabled
    await $.store.set('isEnabled', isEnabled)
    await refresh($)

    return { text: `Portly ports in the status line: ${isEnabled ? 'on' : 'off'}.` }
  })
}
