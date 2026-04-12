const IMAGE_MAP = {
  OG8K: 'sbti/OJBK.webp',
  'FU?K': 'sbti/FUCK.webp',
  'Dior-s': 'sbti/Dior-s.webp',
  'JOKE-R': 'sbti/JOKE-R.webp',
}

export function getImageUrl(code) {
  const filename = IMAGE_MAP[code] || `sbti/${code}.webp`
  return new URL(filename, new URL(import.meta.env.BASE_URL, window.location.origin)).href
}
