const IMAGE_MAP = {
  'OG8K': 'OJBK.png',
  'FU?K': 'FUCK.png',
  'Dior-s': 'Dior-s.jpg',
  'JOKE-R': 'JOKE-R.jpg',
}

function getImageUrl(code) {
  const filename = IMAGE_MAP[code] || `${code}.png`
  return `../${filename}` // Vite public folder assets are at root
}

async function loadJSON(path) {
  const res = await fetch(path)
  return res.json()
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'))
  document.getElementById(pageId).classList.add('active')
  window.scrollTo(0, 0)
}

function renderDetail(type) {
  document.getElementById('detail-img').src = getImageUrl(type.code)
  document.getElementById('detail-code').textContent = type.code
  document.getElementById('detail-name').textContent = type.cn
  document.getElementById('detail-pattern').textContent = type.pattern || 'Special'
  document.getElementById('detail-intro').textContent = type.intro || ''
  document.getElementById('detail-desc').textContent = type.desc || ''
  showPage('page-detail')
}

function createTypeCard(type) {
  const card = document.createElement('article')
  card.className = 'gallery-card'

  const img = document.createElement('img')
  img.src = getImageUrl(type.code)
  img.alt = type.cn
  img.loading = 'lazy'

  const content = document.createElement('div')
  content.className = 'gallery-card-content'

  const header = document.createElement('div')
  header.className = 'gallery-card-header'

  const code = document.createElement('div')
  code.className = 'gallery-card-code'
  code.textContent = type.code

  const name = document.createElement('div')
  name.className = 'gallery-card-name'
  name.textContent = type.cn

  header.append(code, name)

  const intro = document.createElement('p')
  intro.className = 'gallery-card-intro'
  intro.textContent = type.intro

  content.append(header, intro)
  card.append(img, content)

  card.addEventListener('click', () => {
    renderDetail(type)
  })

  return card
}

function renderGallery(types) {
  const container = document.getElementById('gallery-grid')
  container.innerHTML = ''

  const categories = [
    { title: '标准人格', list: types.standard },
    { title: '特殊人格', list: types.special },
  ]

  categories.forEach((group) => {
    if (!group.list || !group.list.length) return

    const section = document.createElement('section')
    section.className = 'gallery-group'

    const title = document.createElement('h2')
    title.className = 'section-title'
    title.textContent = `${group.title} (${group.list.length})`
    section.appendChild(title)

    const grid = document.createElement('div')
    grid.className = 'gallery-grid-inner'

    group.list.forEach((item) => {
      grid.appendChild(createTypeCard(item))
    })

    section.appendChild(grid)
    container.appendChild(section)
  })
}

async function init() {
  const types = await loadJSON(new URL('../data/types.json', import.meta.url).href)
  renderGallery(types)
}

document.getElementById('btn-refresh')?.addEventListener('click', () => {
  init()
})

document.getElementById('btn-back')?.addEventListener('click', () => {
  showPage('page-list')
})

init()
