import { useState } from 'react'
import { fetchTorrents, fetchTransferInfo, login } from './api'
import { formatBytes, formatEta, formatSpeed } from './format'
import { usePolling } from './usePolling'
import { useFullscreen } from './useFullscreen'

const POLL_INTERVAL_MS = 2000

const STAT_FIELDS = [
  { key: 'progress', label: 'Progress', value: (torrent) => `${Math.round(torrent.progress * 100)}%` },
  { key: 'downloaded', label: 'Downloaded', value: (torrent) => formatBytes(torrent.downloaded) },
  { key: 'remaining', label: 'Remaining', value: (torrent) => formatBytes(torrent.amount_left) },
  { key: 'eta', label: 'ETA', value: (torrent) => formatEta(torrent.eta) },
]

function App() {
  const { data: transfer, error: transferError } = usePolling(fetchTransferInfo, POLL_INTERVAL_MS)
  const { data: torrents } = usePolling(fetchTorrents, POLL_INTERVAL_MS)
  const [focusedHash, setFocusedHash] = useState(null)
  const [selectedStat, setSelectedStat] = useState(null)
  const activeTorrents = (torrents ?? []).filter((torrent) => torrent.progress < 1)

  if (transferError?.status === 403) return <LoginScreen />

  const selectedStatTorrent = selectedStat && activeTorrents.find((torrent) => torrent.hash === selectedStat.hash)

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <FullscreenButton />
      <Header
        transferSpeed={transfer?.dl_info_speed}
        selectedStat={selectedStatTorrent ? { torrent: selectedStatTorrent, key: selectedStat.key } : null}
        onClearStat={() => setSelectedStat(null)}
      />
      <TorrentList
        torrents={activeTorrents}
        focusedHash={focusedHash}
        onFocus={setFocusedHash}
        onSelectStat={(hash, key) => setSelectedStat({ hash, key })}
      />
    </div>
  )
}

function FullscreenButton() {
  const { isFullscreen, toggle } = useFullscreen()

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed top-4 right-4 border border-neutral-700 px-3 py-2 text-sm tracking-widest text-neutral-400 uppercase hover:border-white hover:text-white"
    >
      {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
    </button>
  )
}

function LoginScreen() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await login(username, password)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-4">
        <h1 className="mb-4 text-center text-3xl font-bold">big-torrent</h1>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          className="border border-neutral-700 bg-black p-3 text-lg outline-none focus:border-white"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
          className="border border-neutral-700 bg-black p-3 text-lg outline-none focus:border-white"
        />
        {error && <p className="text-red-400">{error}</p>}
        <button type="submit" className="border border-white p-3 text-lg font-semibold">
          Log in
        </button>
      </form>
    </div>
  )
}

function Header({ transferSpeed, selectedStat, onClearStat }) {
  if (selectedStat) {
    const field = STAT_FIELDS.find((candidate) => candidate.key === selectedStat.key)

    return (
      <button type="button" onClick={onClearStat} className="mb-16 w-full text-center">
        <p className="text-2xl tracking-widest text-neutral-500 uppercase">{field.label}</p>
        <p className="text-9xl font-bold tabular-nums">{field.value(selectedStat.torrent)}</p>
      </button>
    )
  }

  if (transferSpeed === undefined) return null

  return (
    <div className="mb-16 text-center">
      <p className="text-2xl tracking-widest text-neutral-500 uppercase">Download Speed</p>
      <p className="text-9xl font-bold tabular-nums">{formatSpeed(transferSpeed)}</p>
    </div>
  )
}

function TorrentList({ torrents, focusedHash, onFocus, onSelectStat }) {
  if (torrents.length === 0) {
    return <p className="text-center text-4xl text-neutral-600">No active torrents</p>
  }

  const focused = torrents.find((torrent) => torrent.hash === focusedHash)
  const rest = torrents.filter((torrent) => torrent.hash !== focusedHash)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {focused && (
        <FocusedTorrent torrent={focused} onClick={() => onFocus(null)} onSelectStat={onSelectStat} />
      )}
      {rest.map((torrent) => (
        <TorrentRow
          key={torrent.hash}
          torrent={torrent}
          onClick={() => onFocus(torrent.hash)}
          onSelectStat={onSelectStat}
        />
      ))}
    </div>
  )
}

function FocusedTorrent({ torrent, onClick, onSelectStat }) {
  const percent = Math.round(torrent.progress * 100)

  return (
    <div onClick={onClick} className="w-full cursor-pointer border border-white p-8 text-center">
      <p className="truncate text-5xl font-semibold">{torrent.name}</p>
      <div className="mt-6 h-3 w-full bg-neutral-800">
        <div className="h-full bg-white" style={{ width: `${percent}%` }} />
      </div>
      <TorrentStats torrent={torrent} onSelectStat={onSelectStat} />
    </div>
  )
}

function TorrentRow({ torrent, onClick, onSelectStat }) {
  const percent = Math.round(torrent.progress * 100)

  return (
    <div
      onClick={onClick}
      className="w-full cursor-pointer border border-neutral-800 p-6 hover:border-neutral-600"
    >
      <p className="truncate text-4xl font-semibold">{torrent.name}</p>
      <div className="mt-4 h-2 w-full bg-neutral-800">
        <div className="h-full bg-white" style={{ width: `${percent}%` }} />
      </div>
      <TorrentStats torrent={torrent} onSelectStat={onSelectStat} />
    </div>
  )
}

function TorrentStats({ torrent, onSelectStat }) {
  return (
    <div className="mt-4 grid grid-cols-4 gap-4 text-center">
      {STAT_FIELDS.map((field) => (
        <Stat
          key={field.key}
          label={field.label}
          value={field.value(torrent)}
          onClick={(event) => {
            event.stopPropagation()
            onSelectStat(torrent.hash, field.key)
          }}
        />
      ))}
    </div>
  )
}

function Stat({ label, value, onClick }) {
  return (
    <button type="button" onClick={onClick} className="cursor-pointer">
      <p className="text-lg tracking-widest text-neutral-500 uppercase">{label}</p>
      <p className="text-3xl font-bold tabular-nums">{value}</p>
    </button>
  )
}

export default App
