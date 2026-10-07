/** One main-loop request as the cache saw it; kept in $.state so a reload keeps the last request. */
export type SavedSample = {
  turnId: string
  index: number
  model: string
  startedAt: number
  read: number
  write: number
  fresh: number
  output: number
}

declare module 'claude-code' {
  interface PluginState {
    'cache-line': { samples: SavedSample[] }
  }
}
