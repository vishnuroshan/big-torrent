import { useEffect, useState } from 'react'

export function usePolling(fetchFn, intervalMs) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const result = await fetchFn()
        if (cancelled) return
        setData(result)
        setError(null)
      } catch (err) {
        if (cancelled) return
        setError(err)
      }
    }

    poll()
    const id = setInterval(poll, intervalMs)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [fetchFn, intervalMs])

  return { data, error }
}
