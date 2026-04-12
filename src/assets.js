const IMAGE_MAP = {
  OG8K: 'sbti/OJBK.png',
  'FU?K': 'sbti/FUCK.png',
  'Dior-s': 'sbti/Dior-s.jpg',
  'JOKE-R': 'sbti/JOKE-R.jpg',
}

export function getImageUrl(code) {
  const filename = IMAGE_MAP[code] || `sbti/${code}.png`
  return new URL(filename, new URL(import.meta.env.BASE_URL, window.location.origin)).href
}
