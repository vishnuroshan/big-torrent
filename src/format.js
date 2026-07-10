const UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B'

  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1)
  const value = bytes / 1024 ** exponent

  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${UNITS[exponent]}`
}

export function formatSpeed(bytesPerSecond) {
  return `${formatBytes(bytesPerSecond)}/s`
}

export function formatEta(seconds) {
  if (seconds < 0 || seconds >= 8640000) return '∞'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`

  const secs = Math.floor(seconds % 60)
  if (minutes > 0) return `${minutes}m ${secs}s`

  return `${secs}s`
}
