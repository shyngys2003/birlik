import SettingsEditor from '../components/SettingsEditor'
import { directions } from '../site-settings'
import { useEffect, useState, type ReactNode } from 'react'
import { Upload, Trash2, LogOut, Send, Plus, Lock, AlertTriangle } from 'lucide-react'
import { DIRECTIONS } from '../data'
import { SITE_URL } from '../config'
import { AuthError, checkAccess, readContent, publishAll, imageToB64, fileToB64, slugName } from '../github'
import type { SiteContent, StepData } from '../content-store'

type Pending = Record<string, { b64: string; preview: string }>
type Tab = 'home' | 'steps' | 'ach' | 'settings'
type MediaKind = 'photos' | 'evidence'

const KEY = 'birlik_admin_token'
const SESSION_MS = 60 * 60 * 1000
const clearLegacyToken = () => { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY) } catch { /* storage disabled */ } }

const inp = 'w-full rounded-xl border border-sky-line bg-white px-3 py-2 text-sm'
const btn = 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1"><span className="text-sm font-semibold text-navy-900">{label}</span>{children}</label>
}
function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-4 rounded-3xl border border-sky-line bg-white p-5 shadow-card sm:p-6"><h2 className="font-serif text-xl font-bold">{title}</h2>{children}</section>
}
function Pick({ label, accept, multiple, onFiles }: { label: string; accept: string; multiple?: boolean; onFiles: (f: File[]) => void }) {
  return (
    <label className={`${btn} cursor-pointer bg-sky-soft text-navy-800 focus-within:ring-2 focus-within:ring-gold hover:bg-sky-line`}>
      <Upload className="h-4 w-4" aria-hidden="true" />{label}
      <input type="file" className="sr-only" accept={accept} multiple={multiple}
        onChange={e => { const f = Array.from(e.target.files ?? []); e.target.value = ''; if (f.length) onFiles(f) }} />
    </label>
  )
}
function ImageField({ label, src, onPick }: { label: string; src: string; onPick: (f: File) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-navy-900">{label}</p>
      {src && <img src={src} alt="" className="h-32 rounded-xl border border-sky-line object-cover" />}
      <Pick label={src ? 'Суретті ауыстыру' : 'Сурет таңдау'} accept="image/*" onFiles={f => onPick(f[0])} />
    </div>
  )
}

export default function Admin() {
  const [token, setToken] = useState('')
  const [expiresAt, setExpiresAt] = useState(0)
  const [input, setInput] = useState('')
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [content, setContent] = useState<SiteContent>({ site: {}, steps: {}, achievements: [] })
  const [snap, setSnap] = useState('')
  const [pending, setPending] = useState<Pending>({})
  const [tab, setTab] = useState<Tab>('home')
  const [step, setStep] = useState(DIRECTIONS[0].slug)
  const [vUrl, setVUrl] = useState('')
  const [vCap, setVCap] = useState('')
  const [rTitle, setRTitle] = useState('')

  const err = (text: string) => setMsg({ ok: false, text })
  const fail = (e: unknown) => err(e instanceof AuthError ? 'Код дұрыс емес, мерзімі өткен немесе сайтқа рұқсат жоқ.' : 'Қате шықты. Интернетті тексеріп, қайталаңыз.')

  async function login(t: string) {
    setBusy(true); setMsg(null)
    try {
      if (!(await checkAccess(t))) throw new AuthError()
      const { content: c } = await readContent(t)
      const remote = JSON.stringify(c)
      // Retain an in-memory draft after relogin if the published data is unchanged.
      if (snap && dirty && remote !== snap) {
        if (!window.confirm('Сайт мазмұны өзгерген. Жарияланбаған өзгерістерді өшіріп, жаңа нұсқаны ашасыз ба?')) return
        setContent(c); setSnap(remote); setPending({})
      } else if (!snap || !dirty) { setContent(c); setSnap(remote); setPending({}) }
      setInput(''); setToken(t); setExpiresAt(Date.now() + SESSION_MS); setReady(true)
    } catch (e) { fail(e); setToken(''); setInput(''); setReady(false) } finally { setBusy(false) }
  }
  useEffect(() => { clearLegacyToken() }, [])
  function lock(message: string) {
    setToken(''); setInput(''); setReady(false); setExpiresAt(0); clearLegacyToken(); err(message)
  }
  useEffect(() => {
    if (!ready || busy) return
    const expire = () => { if (Date.now() >= expiresAt) lock('Сеанс аяқталды. Кодты қайта енгізіңіз. Жарияланбаған өзгерістер осы бетте сақталады.') }
    const timer = window.setTimeout(expire, Math.max(0, expiresAt - Date.now()))
    window.addEventListener('focus', expire)
    document.addEventListener('visibilitychange', expire)
    return () => { window.clearTimeout(timer); window.removeEventListener('focus', expire); document.removeEventListener('visibilitychange', expire) }
  }, [ready, expiresAt, busy])

  const dirty = JSON.stringify(content) !== snap || Object.keys(pending).length > 0
  const upd = (fn: (c: SiteContent) => void) => setContent(prev => { const n = structuredClone(prev); fn(n); return n })
  const sd = (c: SiteContent): StepData => (c.steps[step] ??= {})
  const show = (s?: string) => (s ? pending[s]?.preview ?? s : '')

  async function addImages(files: File[]) {
    const paths: string[] = []
    for (const f of files) {
      try {
        const { b64, preview } = await imageToB64(f)
        const p = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`
        setPending(prev => ({ ...prev, [p]: { b64, preview } }))
        paths.push(p)
      } catch { err('Суретті оқу мүмкін болмады. JPG немесе PNG пайдаланыңыз.') }
    }
    return paths
  }
  async function addDoc(f: File) {
    if (f.size > 25 * 1024 * 1024) { err('Файл тым үлкен (25 МБ-тан аспауы керек).'); return null }
    const p = `uploads/files/${Date.now()}-${slugName(f.name)}`
    const b64 = await fileToB64(f)
    setPending(prev => ({ ...prev, [p]: { b64, preview: '' } }))
    return p
  }

  async function publish() {
    if (!token || Date.now() >= expiresAt) { lock('Сеанс аяқталды. Кодты қайта енгізіңіз.'); return }
    setBusy(true); setMsg(null)
    try {
      const used = JSON.stringify(content)
      const files = Object.fromEntries(Object.entries(pending).filter(([p]) => used.includes(p)))
      await publishAll(token, files, content)
      setPending({}); setSnap(JSON.stringify(content))
      setMsg({ ok: true, text: 'Жарияланды! Сайт 1–2 минуттан кейін жаңарады.' })
    } catch (e) {
      if (e instanceof AuthError) lock('Код жарамсыз немесе жазуға рұқсат жоқ. Кодты қайта енгізіңіз.')
      else fail(e)
    } finally { setBusy(false) }
  }
  const logout = () => {
    if (dirty && !window.confirm('Жарияланбаған өзгерістер жоғалады. Шығасыз ба?')) return
    clearLegacyToken(); setToken(''); setReady(false); setInput(''); setPending({}); setExpiresAt(0); setSnap(''); setContent({ site: {}, steps: {}, achievements: [] }); setMsg(null)
  }

  const setSite = (k: keyof SiteContent['site'], v: string) => upd(c => { c.site[k] = v })
  const pickSite = (k: 'heroPhoto' | 'authorPhoto' | 'socialQr' | 'logoPhoto') => async (f: File) => { const [p] = await addImages([f]); if (p) setSite(k, p) }
  const s = content.steps[step] ?? {}

  const mediaList = (kind: MediaKind, label: string) => (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-navy-900">{label}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(s[kind] ?? []).map((m, i) => (
          <li key={m.src} className="space-y-2 rounded-2xl border border-sky-line p-3">
            <img src={show(m.src)} alt="" className="aspect-video w-full rounded-xl object-cover" />
            <input className={inp} placeholder="Қысқаша жазу (міндетті емес)" value={m.caption ?? ''}
              onChange={e => upd(c => { (sd(c)[kind] ??= [])[i].caption = e.target.value })} />
            <button className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`} onClick={() => upd(c => { (sd(c)[kind] ??= []).splice(i, 1) })}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />Өшіру
            </button>
          </li>
        ))}
      </ul>
      <Pick label="Фото қосу" accept="image/*" multiple onFiles={async f => { const ps = await addImages(f); upd(c => { (sd(c)[kind] ??= []).push(...ps.map(src => ({ src }))) }) }} />
    </div>
  )

  if (!ready) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Card title="Әкімші панелі">
          <p className="flex items-center gap-2 text-sm text-navy-800"><Lock className="h-4 w-4 text-gold" aria-hidden="true" />Сайтқа фото мен мәтін қосу үшін кіру кодын (токен) енгізіңіз.</p>
          <Field label="Кіру коды (токен)"><input type="password" className={inp} value={input} onChange={e => setInput(e.target.value)} autoComplete="off" disabled={busy} onKeyDown={e => { if (e.key === 'Enter' && !busy && input.trim()) void login(input.trim()) }} /></Field>
          {msg && <p role="alert" className="text-sm font-medium text-red-700">{msg.text}</p>}
          <button disabled={busy || !input.trim()} onClick={() => login(input.trim())} className={`${btn} bg-navy-900 text-white hover:bg-navy-700 disabled:opacity-50`}>{busy ? 'Тексерілуде…' : 'Кіру'}</button>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div className="sticky top-16 z-30 -mx-2 flex flex-wrap items-center gap-3 rounded-2xl border border-sky-line bg-white/95 p-3 shadow-card backdrop-blur">
        <button disabled={busy || !dirty} onClick={publish} className={`${btn} bg-gold text-navy-950 disabled:opacity-50`}><Send className="h-4 w-4" aria-hidden="true" />{busy ? 'Жарияланып жатыр…' : 'Жариялау'}</button>
        <span className="text-sm text-navy-800">{dirty ? 'Жарияланбаған өзгерістер бар' : 'Өзгерістер жоқ'}</span>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="ml-auto text-sm underline">Сайтты ашу</a>
        <button disabled={busy} onClick={logout} className={`${btn} bg-sky-soft`}><LogOut className="h-4 w-4" aria-hidden="true" />Шығу</button>
      </div>
      {msg && <p role="status" className={`rounded-xl p-3 text-sm font-medium ${msg.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>}
      <p className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />Сайт барлығына ашық. Балалардың фотосы мен аты-жөнін тек ата-аналардың келісімімен жариялаңыз.</p>

      <div role="tablist" className="flex flex-wrap gap-2">
        {([['settings','Сайт баптаулары'], ['home', 'Басты бет'], ['steps', 'Алты қадам'], ['ach', 'Жетістіктер']] as [Tab, string][]).map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`${btn} ${tab === id ? 'bg-navy-900 text-white' : 'bg-white shadow-card'}`}>{l}</button>
        ))}
      </div>

      {tab === 'settings' && <Card title="Сайт баптаулары"><ImageField label="Сайт логотипі" src={show(content.site.logoPhoto)} onPick={pickSite('logoPhoto')} /><button className={btn} onClick={()=>setSite('logoPhoto','')}>Логотипті алып тастау</button><SettingsEditor value={content.settings} onChange={v=>upd(c=>{c.settings=v})}/></Card>}
      {tab === 'home' && (
        <Card title="Басты бет">
          <ImageField label="Басты беттегі сынып фотосы" src={show(content.site.heroPhoto)} onPick={pickSite('heroPhoto')} />
          <ImageField label="Автордың фотосы" src={show(content.site.authorPhoto)} onPick={pickSite('authorPhoto')} />
          <Field label="Автор туралы қысқаша мәлімет"><textarea rows={5} className={inp} value={content.site.authorBio ?? ''} onChange={e => setSite('authorBio', e.target.value)} /></Field>
          <Field label="Әлеуметтік желі сілтемесі (https://…)"><input className={inp} value={content.site.socialUrl ?? ''} onChange={e => setSite('socialUrl', e.target.value)} /></Field>
          <ImageField label="QR-код суреті" src={show(content.site.socialQr)} onPick={pickSite('socialQr')} />
        </Card>
      )}

      {tab === 'steps' && (
        <Card title="Алты қадам">
          <Field label="Қадамды таңдаңыз">
            <select className={inp} value={step} onChange={e => setStep(e.target.value)}>
              {directions(content.settings).map((d, i) => <option key={d.slug} value={d.slug}>{i + 1}. {d.title}</option>)}
            </select>
          </Field>
          <Field label="Өткізілген уақыты мен орны"><input className={inp} value={s.whenWhere ?? ''} onChange={e => upd(c => { sd(c).whenWhere = e.target.value })} /></Field>
          <Field label="Біздің сынып тәжірибесі (мәтін)"><textarea rows={5} className={inp} value={s.experience ?? ''} onChange={e => upd(c => { sd(c).experience = e.target.value })} /></Field>
          <Field label="Нәтиже мен дәлелдер (мәтін)"><textarea rows={4} className={inp} value={s.results ?? ''} onChange={e => upd(c => { sd(c).results = e.target.value })} /></Field>
          {mediaList('photos', 'Фотолар')}
          {mediaList('evidence', 'Дәлел құжаттары (грамота, куәлік суреттері)')}

          <div className="space-y-3">
            <p className="text-sm font-semibold text-navy-900">Бейнелер (YouTube сілтемесі)</p>
            <ul className="space-y-2">
              {(s.videos ?? []).map((v, i) => (
                <li key={v.url} className="flex items-center gap-2 rounded-xl border border-sky-line p-2 text-sm">
                  <span className="min-w-0 flex-1 truncate">{v.caption ? `${v.caption} — ` : ''}{v.url}</span>
                  <button aria-label="Өшіру" className="rounded-full p-2 text-red-700 hover:bg-red-50" onClick={() => upd(c => { (sd(c).videos ??= []).splice(i, 1) })}><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
            <input className={inp} placeholder="https://youtu.be/…" value={vUrl} onChange={e => setVUrl(e.target.value)} />
            <input className={inp} placeholder="Қысқаша жазу (міндетті емес)" value={vCap} onChange={e => setVCap(e.target.value)} />
            <button className={`${btn} bg-sky-soft`} disabled={!/^https?:\/\//.test(vUrl.trim())}
              onClick={() => { upd(c => { (sd(c).videos ??= []).push({ url: vUrl.trim(), caption: vCap.trim() || undefined }) }); setVUrl(''); setVCap('') }}>
              <Plus className="h-4 w-4" aria-hidden="true" />Бейне қосу
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-navy-900">Әдістемелік ресурстар (PDF, Word, т.б.)</p>
            <ul className="space-y-2">
              {(s.resources ?? []).map((r, i) => (
                <li key={r.file} className="flex items-center gap-2 rounded-xl border border-sky-line p-2 text-sm">
                  <span className="min-w-0 flex-1 truncate">{r.title}</span>
                  <button aria-label="Өшіру" className="rounded-full p-2 text-red-700 hover:bg-red-50" onClick={() => upd(c => { (sd(c).resources ??= []).splice(i, 1) })}><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
            <input className={inp} placeholder="Ресурс атауы" value={rTitle} onChange={e => setRTitle(e.target.value)} />
            <Pick label="Файл таңдау және қосу" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
              onFiles={async f => {
                if (!rTitle.trim()) { err('Алдымен ресурс атауын жазыңыз.'); return }
                const p = await addDoc(f[0])
                if (p) { upd(c => { (sd(c).resources ??= []).push({ title: rTitle.trim(), file: p }) }); setRTitle('') }
              }} />
          </div>
        </Card>
      )}

      {tab === 'ach' && (
        <Card title="Оқушылар жетістіктері">
          {content.achievements.map((a, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-sky-line p-4">
              <Field label="Атауы"><input className={inp} value={a.title} onChange={e => upd(c => { c.achievements[i].title = e.target.value })} /></Field>
              <Field label="Сипаттамасы"><textarea rows={3} className={inp} value={a.text ?? ''} onChange={e => upd(c => { c.achievements[i].text = e.target.value })} /></Field>
              <ImageField label="Сурет" src={show(a.photo)} onPick={async f => { const [p] = await addImages([f]); if (p) upd(c => { c.achievements[i].photo = p }) }} />
              <button className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`} onClick={() => upd(c => { c.achievements.splice(i, 1) })}><Trash2 className="h-4 w-4" aria-hidden="true" />Карточканы өшіру</button>
            </div>
          ))}
          <button className={`${btn} bg-sky-soft`} onClick={() => upd(c => { c.achievements.push({ title: '' }) })}><Plus className="h-4 w-4" aria-hidden="true" />Жаңа карточка қосу</button>
        </Card>
      )}
    </div>
  )
}
