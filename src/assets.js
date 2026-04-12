const IMAGE_MAP = {
  OG8K: 'OJBK.png',
  'FU?K': 'FUCK.png',
  'Dior-s': 'Dior-s.jpg',
  'JOKE-R': 'JOKE-R.jpg',
}

export function getImageUrl(code) {
  const filename = IMAGE_MAP[code] || `${code}.png`
  return new URL(filename, new URL(import.meta.env.BASE_URL, window.location.origin)).href
}
