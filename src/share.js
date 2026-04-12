/**
 * 生成分享图片 — 纯 Canvas 绘制，无外部依赖
 */
import { getImageUrl } from './assets.js'

const LEVEL_NUM = { L: 1, M: 2, H: 3 }
const LEVEL_LABEL = { L: '低', M: '中', H: '高' }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 生成分享卡片并下载
 */
export async function generateShareImage(primary, userLevels, dimOrder, dimDefs, mode) {
  const dpr = 2
  const W = 720
  const H = 1600 // 增加高度以容纳更多内容
  const canvas = document.createElement('canvas')
  canvas.width = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  // 背景
  ctx.fillStyle = '#f0f4f1'
  ctx.fillRect(0, 0, W, H)

  // 卡片白底
  const cardX = 32, cardY = 32, cardW = W - 64, cardH = H - 64
  roundRect(ctx, cardX, cardY, cardW, cardH, 20)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  let y = cardY + 50

  // Kicker
  ctx.textAlign = 'center'
  ctx.font = '400 22px system-ui, "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillStyle = '#6b7b6e'
  const kickerText = mode === 'drunk' ? '隐藏人格已激活' : mode === 'fallback' ? '系统强制兜底' : '你的主类型'
  ctx.fillText(kickerText, W / 2, y)
  y += 40

  // 绘制人格图片
  try {
    const mainImg = await loadImage(getImageUrl(primary.code))
    const imgSize = 320
    const imgX = (W - imgSize) / 2
    ctx.save()
    roundRect(ctx, imgX, y, imgSize, imgSize, 16)
    ctx.clip()
    ctx.drawImage(mainImg, imgX, y, imgSize, imgSize)
    ctx.restore()
    y += imgSize + 40
  } catch (e) {
    console.error('Failed to load image for share', e)
    y += 20
  }

  // 匹配度徽章
  const badgeText = `匹配度 ${primary.similarity}%` + (primary.exact != null ? ` · 精准命中 ${primary.exact}/15 维` : '')
  ctx.font = '500 20px system-ui, "PingFang SC", "Microsoft YaHei", sans-serif'
  const badgeW = ctx.measureText(badgeText).width + 40
  roundRect(ctx, (W - badgeW) / 2, y - 16, badgeW, 36, 18)
  ctx.fillStyle = '#e8f0ea'
  ctx.fill()
  ctx.fillStyle = '#4c6752'
  ctx.fillText(badgeText, W / 2, y + 6)
  y += 60

  // Intro
  ctx.font = 'italic 600 24px system-ui, "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillStyle = '#2c3e2d'
  const introLines = wrapText(ctx, primary.intro || '', cardW - 100)
  for (const line of introLines) {
    ctx.fillText(line, W / 2, y)
    y += 36
  }
  y += 20

  // Description
  ctx.textAlign = 'left'
  ctx.font = '400 20px system-ui, "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillStyle = '#6b7b6e'
  const descLines = wrapText(ctx, primary.desc || '', cardW - 120)
  const lineH = 32
  for (const line of descLines) {
    ctx.fillText(line, cardX + 60, y)
    y += lineH
  }
  y += 40

  // 雷达图
  const radarCx = W / 2
  const radarCy = y + 150
  const radarR = 130
  drawShareRadar(ctx, radarCx, radarCy, radarR, userLevels, dimOrder, dimDefs)
  y = radarCy + radarR + 60

  // 底部水印
  ctx.textAlign = 'center'
  ctx.font = '400 18px system-ui, "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillStyle = '#aab8ac'
  const currentUrl = window.location.origin + window.location.pathname
  ctx.fillText(`SBTI 人格测试 · 仅供娱乐 · ${currentUrl}`, W / 2, H - cardY - 30)

  // 下载
  const link = document.createElement('a')
  link.download = `SBTI-${primary.code}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

/**
 * 在分享图上绘制雷达图
 */
function drawShareRadar(ctx, cx, cy, maxR, userLevels, dimOrder, dimDefs) {
  const n = dimOrder.length
  const step = (Math.PI * 2) / n
  const start = -Math.PI / 2

  // 背景圆环
  for (let lv = 3; lv >= 1; lv--) {
    const r = (lv / 3) * maxR
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = lv === 3 ? 'rgba(76,103,82,0.06)' : lv === 2 ? 'rgba(76,103,82,0.04)' : 'rgba(76,103,82,0.02)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(76,103,82,0.12)'
    ctx.lineWidth = 0.5
    ctx.stroke()
  }

  // 轴线 + 标签
  ctx.font = '400 12px system-ui, "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < n; i++) {
    const angle = start + i * step
    const x = cx + Math.cos(angle) * maxR
    const y = cy + Math.sin(angle) * maxR
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(x, y)
    ctx.strokeStyle = 'rgba(76,103,82,0.1)'
    ctx.lineWidth = 0.5
    ctx.stroke()

    const lr = maxR + 24
    const lx = cx + Math.cos(angle) * lr
    const ly = cy + Math.sin(angle) * lr
    const label = (dimDefs[dimOrder[i]]?.name || dimOrder[i]).replace(/^[A-Za-z0-9]+\s*/, '')
    ctx.fillStyle = '#6b7b6e'
    ctx.fillText(label, lx, ly)
  }

  // 数据多边形
  const values = dimOrder.map((d) => LEVEL_NUM[userLevels[d]] || 2)
  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const angle = start + i * step
    const r = (values[i] / 3) * maxR
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(76,103,82,0.2)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(76,103,82,0.6)'
  ctx.lineWidth = 2
  ctx.stroke()

  // 数据点
  for (let i = 0; i < n; i++) {
    const angle = start + i * step
    const r = (values[i] / 3) * maxR
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#4c6752'
    ctx.fill()
  }
}

/**
 * 圆角矩形
 */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/**
 * 文字自动换行
 */
function wrapText(ctx, text, maxWidth) {
  if (!text) return []
  const lines = []
  let line = ''
  for (const char of text) {
    const test = line + char
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = char
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}
