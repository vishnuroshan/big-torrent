import { useEffect } from 'react'

// Browsers only grant the Fullscreen API in response to a user gesture,
// so this listens for the first click/tap instead of running on mount.
export function useFullscreenOnClick() {
  useEffect(() => {
    function enterFullscreen() {
      if (document.fullscreenElement) return
      document.documentElement.requestFullscreen().catch(() => {})
    }

    document.addEventListener('click', enterFullscreen)
    return () => document.removeEventListener('click', enterFullscreen)
  }, [])
}
