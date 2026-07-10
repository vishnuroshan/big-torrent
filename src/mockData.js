export const mockTransferInfo = {
  dl_info_speed: 15728640,
}

export const mockTorrents = [
  {
    hash: 'mock-1',
    name: 'ubuntu-24.04-desktop-amd64.iso',
    progress: 0.82,
    downloaded: 3865470566,
    amount_left: 848256614,
    eta: 312,
  },
  {
    hash: 'mock-2',
    name: 'debian-13.0.0-amd64-netinst.iso',
    progress: 0.35,
    downloaded: 210763776,
    amount_left: 391168000,
    eta: 890,
  },
  {
    hash: 'mock-3',
    name: 'A.Very.Long.Torrent.Name.That.Should.Truncate.Nicely.On.The.Row.mkv',
    progress: 0.12,
    downloaded: 104857600,
    amount_left: 768000000,
    eta: 8640000,
  },
  {
    hash: 'mock-4',
    name: 'archlinux-2026.07.01-x86_64.iso',
    progress: 0.58,
    downloaded: 580000000,
    amount_left: 420000000,
    eta: 145,
  },
  {
    hash: 'mock-5',
    name: 'fedora-workstation-42-x86_64.iso',
    progress: 0.03,
    downloaded: 60000000,
    amount_left: 1940000000,
    eta: 4200,
  },
]
