# Contributing to big-torrent

Thanks for considering a contribution — bug fixes, small features, and even just
opening an issue about something confusing are all welcome.

## Getting set up

Requires [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/vishnuroshan/big-torrent.git
cd big-torrent
pnpm install
pnpm dev
```

`pnpm dev` runs against built-in mock data (5 dummy torrents), so you can work on
the UI without a running qBittorrent instance. The mock data lives in
[src/mockData.js](src/mockData.js) — edit it if you need different values to test
against (e.g. more torrents, edge-case names, extreme progress/ETA values).

To test against a real qBittorrent instance, run `pnpm run build` and point
qBittorrent's alternative Web UI at the `dist/public` folder it produces — see the
[wiki](https://github.com/vishnuroshan/big-torrent/wiki) for the full setup steps.

## Before opening a PR

```bash
pnpm run lint
pnpm run build
```

Both should pass cleanly. There's no test suite — verify UI changes by actually
looking at them (`pnpm dev` with the mock data covers most cases).

## Code style

- No comments except where something is genuinely non-obvious (an external
  constraint, a workaround for a specific bug). Names should make the "what"
  obvious on their own.
- Keep functions small and at one level of abstraction. Each component in
  [src/App.jsx](src/App.jsx) renders one thing.
- No new dependencies, build tools, or abstractions unless the task genuinely
  needs them. This project is deliberately minimal — plain fetch calls, no state
  library, no router, no component library.
- Match the existing visual style: plain, high-contrast, black background, no
  color accents or decorative styling. It's meant to be read from across a room.

## Reporting bugs / suggesting features

Open a [GitHub issue](https://github.com/vishnuroshan/big-torrent/issues) with
what you expected vs. what happened. For qBittorrent-specific quirks (Web UI
config, API behavior), include your qBittorrent version.

## License

By contributing, you agree your contribution is licensed under this project's
[MIT License](LICENSE).
