# big-torrent

A read-only dashboard that replaces qBittorrent's Web UI. It polls qBittorrent's own
WebUI API and shows global download speed plus per-torrent progress, in large type
meant to be read from across a room.

## Stack

React + Vite + Tailwind CSS v4, no router, no state library, no component library.
`@tailwindcss/vite` handles Tailwind directly in `vite.config.js` — there is no
`tailwind.config.js`.

## Commands

- `pnpm dev` — dev server on `localhost:5173`. Proxies `/api` to
  `QBIT_URL` (defaults to `http://localhost:8080`) so it can talk to a real
  qBittorrent instance during development.
- `pnpm run build` — production build to `dist/`.
- `pnpm run lint` — oxlint.

## Structure

- `src/api.js` — the only place that calls `fetch`. Two functions, one per
  qBittorrent endpoint (`/api/v2/transfer/info`, `/api/v2/torrents/info`).
- `src/usePolling.js` — generic interval-poll hook. Both endpoints use it; there is
  no other data-fetching mechanism in the app.
- `src/format.js` — pure formatting functions (bytes, speed, ETA). No JSX, no state.
- `src/App.jsx` — the UI. `App` wires data to components; each other function
  renders one thing and takes plain props.

There is no backend, no build step beyond Vite, and no client-side routing. Keep it
that way unless the requirements actually change.

## Deployment target

The build output (`dist/`) is served directly by qBittorrent's "alternative Web UI"
feature. That means:
- Same-origin `fetch` calls to `/api/v2/...` — no CORS handling, no auth token
  logic. The browser already carries qBittorrent's session cookie.
- `base: './'` in `vite.config.js` so assets resolve regardless of how qBittorrent
  mounts the UI.

## Code style

Write code the way you'd want to read it cold, six months from now, with no one
around to ask:

- Every function does one thing, at one level of abstraction. If a function mixes
  "what" and "how," split it.
- No comments explaining what code does — name things well enough that the code
  says it. A comment is only justified for a non-obvious *why* (a real qBittorrent
  API quirk, not a restatement of the next line).
- No defensive code for cases that can't happen. Don't validate inputs that are
  already guaranteed by the type or the caller.
- No workarounds. If something is awkward, fix the actual cause instead of adding
  a special case around it.
- No premature abstraction. Don't add config, props, or indirection for a second
  use case that doesn't exist yet. Duplication is cheaper than the wrong
  abstraction.
- Favor the boring, obvious solution over the clever one. If a reviewer would need
  an explanation to see why code is correct, it's too clever.

## Design

Plain, high-contrast, minimal. White text and simple borders on black — no
gradients, no color accents, no shadows, no decorative rounding. The only thing
allowed to stand out is the type scale: numbers people need to read from a
distance are large; everything else is small and quiet (uppercase, tracked-out,
neutral-500 labels).
