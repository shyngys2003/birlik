import { BRANCH, REPO } from './config'
import { EMPTY, normalize, type SiteContent } from './content-store'

const API = 'https://api.github.com'
export class AuthError extends Error {}

async function call(t: string, path: string, init: RequestInit = {}) {
  const r = await fetch(`${API}${path}`, {
    ...init, cache: 'no-store',
    headers: { Authorization: `Bearer ${t}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
  })
  if (r.status === 401 || r.status === 403) throw new AuthError()
  return r
}

const b64ToText = (b64: string) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), c => c.charCodeAt(0)))
const textToB64 = (s: string) => { let bin = ''; new TextEncoder().encode(s).forEach(b => { bin += String.fromCharCode(b) }); return btoa(bin) }

export async function checkAccess(t: string) {
  const r = await call(t, `/repos/${REPO}`)
  if (!r.ok) return false
  const j = await r.json()
  if (!j.permissions?.push) return false
  // A fixed, unreferenced blob checks actual token write rights without a commit.
  const probe = await call(t, `/repos/${REPO}/git/blobs`, {
    method: 'POST', body: JSON.stringify({ content: 'birlik-admin-access-check', encoding: 'utf-8' }),
  })
  if (probe.status === 404) return false
  if (!probe.ok) throw new Error(`access ${probe.status}`)
  return true
}

export async function readContent(t: string): Promise<{ content: SiteContent; sha?: string }> {
  const r = await call(t, `/repos/${REPO}/contents/public/content.json?ref=${BRANCH}`)
  if (r.status === 404) return { content: EMPTY }
  if (!r.ok) throw new Error('read')
  const j = await r.json()
  return { content: normalize(JSON.parse(b64ToText(j.content))), sha: j.sha as string }
}

async function put(t: string, path: string, b64: string, message: string, sha?: string) {
  const r = await call(t, `/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: b64, branch: BRANCH, ...(sha ? { sha } : {}) }),
  })
  if (!r.ok) throw new Error(`put ${r.status}`)
}

export async function publishAll(t: string, files: Record<string, { b64: string }>, content: SiteContent) {
  for (const [p, f] of Object.entries(files)) await put(t, `public/${p}`, f.b64, 'Файл қосылды')
  const { sha } = await readContent(t)
  await put(t, 'public/content.json', textToB64(JSON.stringify(content, null, 2)), 'Сайт мазмұны жаңартылды', sha)
}

export async function imageToB64(file: File, max = 1600) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * k), h = Math.round(bmp.height * k)
  const cv = document.createElement('canvas')
  cv.width = w; cv.height = h
  const ctx = cv.getContext('2d')
  if (!ctx) throw new Error('canvas')
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.drawImage(bmp, 0, 0, w, h)
  const url = cv.toDataURL('image/jpeg', 0.82)
  return { b64: url.split(',')[1], preview: url }
}

export const fileToB64 = (f: File) => new Promise<string>((res, rej) => {
  const r = new FileReader()
  r.onload = () => res(String(r.result).split(',')[1])
  r.onerror = () => rej(r.error)
  r.readAsDataURL(f)
})

export const slugName = (n: string) => n.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'file'
