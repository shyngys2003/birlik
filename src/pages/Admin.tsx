import { loadDraft, saveDraft, clearDraft, downloadBackup, type Draft } from '../admin-drafts'
import { ConflictError, readHistory, readVersion, type HistoryItem } from '../github'
import BuilderEditor from '../components/BuilderEditor'
import { blankBuilder } from '../builder'
import SettingsEditor from '../components/SettingsEditor'
import { directions } from '../site-settings'
import { useEffect, useState, useRef, type ReactNode } from 'react'
import { Upload, Trash2, LogOut, Send, Plus, Lock, AlertTriangle } from 'lucide-react'
import { DIRECTIONS } from '../data'
import { SITE_URL } from '../config'
import { AuthError, checkAccess, readContent, publishAll, imageToB64, fileToB64, slugName } from '../github'
import { HOME_RESOURCE_GROUPS, ACHIEVEMENT_YEARS, achievementYear, type AchievementYear, type SiteContent, type StepData } from '../content-store'

type Pending = Record<string, { b64: string; preview: string }>
type Tab = 'resources' | 'dashboard' | 'home' | 'steps' | 'ach' | 'settings' | 'builder'
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
function ImageField({ label, src, onPick, circle = false }: { label: string; src: string; onPick: (f: File) => void; circle?: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-navy-900">{label}</p>
      {src && <img src={src} alt="" className={`h-32 border border-sky-line object-cover ${circle ? 'w-32 rounded-full' : 'rounded-xl'}`} />}
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
  const currentContent = useRef(content); currentContent.current = content
  const [snap, setSnap] = useState('')
  const [pending, setPending] = useState<Pending>({})
  const [tab, setTab] = useState<Tab>('dashboard')
  const [undo, setUndo] = useState<SiteContent[]>([])
  const [redo, setRedo] = useState<SiteContent[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [draftStatus, setDraftStatus] = useState('')
  const [savedDraft, setSavedDraft] = useState<Draft | undefined>()
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
      try { const d = await loadDraft(); setSavedDraft(d); if (d && d.base === remote && (!snap || !dirty) && window.confirm('Сақталған нобайды қалпына келтіресіз бе?')) { setContent(d.content); setPending(d.pending); setSnap(remote) } } catch { setDraftStatus('Нобайды оқу мүмкін болмады') }
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
  useEffect(() => {
    if (!ready || !dirty || busy) return
    const timer=window.setTimeout(()=>{const d={content,pending,base:snap,savedAt:Date.now()}; void saveDraft(d).then(()=>{setSavedDraft(d);setDraftStatus('Нобай сақталды: '+new Date(d.savedAt).toLocaleTimeString())}).catch(()=>setDraftStatus('Нобай сақталмады — резервтік көшірме жүктеңіз'))},800)
    return ()=>window.clearTimeout(timer)
  },[ready,dirty,busy,content,pending,snap])
  useEffect(()=>{if(!ready||!dirty)return; const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue=''};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn)},[ready,dirty])
  const upd = (fn: (c: SiteContent) => void) => {const prevContent=currentContent.current;const n=structuredClone(prevContent);fn(n);currentContent.current=n;setUndo(prev=>[...prev.slice(-29),prevContent]);setRedo([]);setContent(n)}
  const restore = (c:SiteContent) => {setUndo(prev=>[...prev.slice(-29),content]);setRedo([]);setContent(c)}
  const undoOne=()=>{const last=undo[undo.length-1];if(!last)return;setRedo(r=>[...r,content]);setUndo(u=>u.slice(0,-1));setContent(last)}
  const redoOne=()=>{const last=redo[redo.length-1];if(!last)return;setUndo(u=>[...u,content]);setRedo(r=>r.slice(0,-1));setContent(last)}
  async function refreshHistory(){setBusy(true);try{setHistory(await readHistory(token))}catch(e){fail(e)}finally{setBusy(false)}}
  async function restoreVersion(sha:string){if(!window.confirm('Бұл нұсқа нобайға жүктеледі. Жалғастыру керек пе?'))return;setBusy(true);try{restore(await readVersion(token,sha))}catch(e){fail(e)}finally{setBusy(false)}}

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
    const p = `uploads/files/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${slugName(f.name)}`
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
      await publishAll(token, files, content, snap)
      setPending({}); setSnap(JSON.stringify(content)); setUndo([]); setRedo([]); setSavedDraft(undefined); setDraftStatus(''); try { await clearDraft() } catch { setDraftStatus('Ескі нобайды жою мүмкін болмады') }
      setMsg({ ok: true, text: 'GitHub-та сақталды! Сайт GitHub Actions сәтті аяқталған соң жаңарады.' })
    } catch (e) {
      if (e instanceof AuthError) lock('Код жарамсыз немесе жазуға рұқсат жоқ. Кодты қайта енгізіңіз.')
      else if (e instanceof ConflictError) err('Сайттың жаңа нұсқасы бар. Резервтік көшірме жүктеп, қайта кіріңіз.')
      else fail(e)
    } finally { setBusy(false) }
  }
  const logout = async () => {
    if (dirty) { if (!window.confirm('Нобайды сақтап, шығасыз ба?')) return; try { await saveDraft({content,pending,base:snap,savedAt:Date.now()}) } catch { err('Нобай сақталмады. Резервтік көшірме жүктеңіз.'); return } }
    setUndo([]); setRedo([]); setHistory([]); setSavedDraft(undefined)
    clearLegacyToken(); setToken(''); setReady(false); setInput(''); setPending({}); setExpiresAt(0); setSnap(''); setContent({ site: {}, steps: {}, achievements: [] }); setMsg(null)
  }

  const setSite = (k: Exclude<keyof SiteContent['site'], 'resources'>, v: string) => upd(c => { c.site[k] = v })
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
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="sticky top-16 z-30 -mx-2 flex flex-wrap items-center gap-3 rounded-2xl border border-sky-line bg-white/95 p-3 shadow-card backdrop-blur">
        <button disabled={busy || !dirty} onClick={publish} className={`${btn} bg-gold text-navy-950 disabled:opacity-50`}><Send className="h-4 w-4" aria-hidden="true" />{busy ? 'Жарияланып жатыр…' : 'Жариялау'}</button>
        <span className="text-sm text-navy-800">{dirty ? 'Жарияланбаған өзгерістер бар' : 'Өзгерістер жоқ'}</span>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="ml-auto text-sm underline">Сайтты ашу</a>
        <button disabled={busy} onClick={logout} className={`${btn} bg-sky-soft`}><LogOut className="h-4 w-4" aria-hidden="true" />Шығу</button>
      </div>
      {msg && <p role="status" className={`rounded-xl p-3 text-sm font-medium ${msg.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>}
      <p className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />Сайт барлығына ашық. Балалардың фотосы мен аты-жөнін тек ата-аналардың келісімімен жариялаңыз.</p>

      <div role="tablist" className="flex flex-wrap gap-2">
        {([['dashboard','Басқару тақтасы'], ['builder','Бет конструкторы'], ['settings','Сайт баптаулары'], ['home', 'Басты бет'], ['resources', 'Ресурстар'], ['steps', 'Алты қадам'], ['ach', 'Жетістіктер']] as [Tab, string][]).map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`${btn} ${tab === id ? 'bg-navy-900 text-white' : 'bg-white shadow-card'}`}>{l}</button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button className={`${btn} bg-sky-soft disabled:opacity-40`} disabled={busy||!undo.length} onClick={undoOne}>↶ Болдырмау</button>
        <button className={`${btn} bg-sky-soft disabled:opacity-40`} disabled={busy||!redo.length} onClick={redoOne}>↷ Қайталау</button>
        <button className={`${btn} bg-sky-soft`} disabled={busy} onClick={()=>downloadBackup(content,pending)}>Көшірмені жүктеу</button>
        <span role="status">{draftStatus}</span>
      </div>
      <fieldset disabled={busy} className="min-w-0 space-y-6 disabled:opacity-70">
      {tab === 'dashboard' && <>
        <Card title="Сайт статистикасы">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["Беттер",7+(content.builder?.pages.length??0)],["Фотолар",Object.values(content.steps).reduce((n,s)=>n+(s.photos?.length??0)+(s.evidence?.length??0),0)],["Құжаттар",Object.values(content.steps).reduce((n,s)=>n+(s.resources?.length??0),0)+HOME_RESOURCE_GROUPS.reduce((n,g)=>n+(content.site.resources?.[g.id]?.length??0),0)],["Жетістіктер",content.achievements.length]].map(([label,n])=><div key={label} className="rounded-2xl bg-sky-soft p-4"><p className="text-2xl font-bold">{n}</p><p className="text-sm">{label}</p></div>)}
          </div><p className="text-xs">Негізгі бөлімдердегі материалдар саны. Кірушілер статистикасы емес.</p>
          {directions(content.settings).map(d=>{const s=content.steps[d.slug];return <button key={d.slug} disabled={busy} onClick={()=>{setStep(d.slug);setTab('steps')}} className="flex w-full justify-between rounded-xl border border-sky-line p-3 text-left"><span>{d.title}</span><span>{(s?.photos?.length??0)+(s?.videos?.length??0)+(s?.resources?.length??0)+(s?.evidence?.length??0)} материал</span></button>})}
        </Card>
        <Card title="Нобайлар және резервтік көшірме">
          <p className="text-sm">Нобай осы браузерде сақталады. Токен сақталмайды. Резервтік көшірмеде жарияланған файлдардың сілтемелері ғана болады.</p>
          <button disabled={busy} className={`${btn} bg-sky-soft`} onClick={async()=>{try{const d={content,pending,base:snap,savedAt:Date.now()};await saveDraft(d);setSavedDraft(d);setDraftStatus('Нобай сақталды')}catch{err('Нобай сақталмады')}}}>Нобайды сақтау</button>
          {savedDraft&&<button disabled={busy} className={`${btn} bg-sky-soft`} onClick={()=>{if(window.confirm(savedDraft.base!==snap?'Нобай ескі нұсқадан. Қазіргі мазмұнды ауыстырасыз ба?':'Нобайды қалпына келтіресіз бе?')){restore(savedDraft.content);setPending(p=>({...p,...savedDraft.pending}))}}}>Нобайды қалпына келтіру</button>}
          {savedDraft&&<button disabled={busy} className={`${btn} text-red-700`} onClick={async()=>{if(!window.confirm('Сақталған нобайды өшіру керек пе?'))return;try{await clearDraft();setSavedDraft(undefined);setDraftStatus('Нобай өшірілді (өзгерістер болса, қайта сақталуы мүмкін)')}catch{err('Нобайды өшіру мүмкін болмады')}}}>Нобайды өшіру</button>}
        </Card>
        <Card title="Жариялау тарихы">
          <button disabled={busy} className={`${btn} bg-sky-soft`} onClick={refreshHistory}>Тарихты жүктеу / жаңарту</button>
          {history.map(h=><div key={h.sha} className="flex flex-wrap items-center gap-3 rounded-xl border border-sky-line p-3"><div className="flex-1"><p className="font-medium">{h.message}</p><p className="text-xs">{new Date(h.date).toLocaleString()} · {h.sha.slice(0,7)}</p></div><button disabled={busy} className={`${btn} bg-sky-soft`} onClick={()=>restoreVersion(h.sha)}>Нұсқаны ашу</button></div>)}
          <p className="text-xs">Қалпына келтіру тек нобайға әсер етеді. Сайтты жаңарту үшін «Жариялау» басыңыз.</p>
        </Card>
      </>}
      {tab === 'builder' && <Card title="Бет конструкторы"><BuilderEditor value={content.builder} settings={content.settings} busy={busy} onChange={fn=>upd(c=>fn(c.builder??=blankBuilder()))} show={show} upload={async(f,k)=>{setBusy(true);try{return k==='image'?(await addImages([f]))[0]||null:await addDoc(f)}catch{err('Файлды оқу мүмкін болмады.');return null}finally{setBusy(false)}}}/></Card>}
      {tab === 'settings' && <Card title="Сайт баптаулары"><ImageField label="Сайт логотипі" src={show(content.site.logoPhoto)} onPick={pickSite('logoPhoto')} /><button className={btn} onClick={()=>setSite('logoPhoto','')}>Логотипті алып тастау</button><SettingsEditor value={content.settings} onChange={v=>upd(c=>{c.settings=v})}/></Card>}
      {tab === 'home' && (
        <Card title="Басты бет">
          <ImageField label="Басты беттегі сынып фотосы" src={show(content.site.heroPhoto)} onPick={pickSite('heroPhoto')} />
          <ImageField circle label="Автордың фотосы" src={show(content.site.authorPhoto)} onPick={pickSite('authorPhoto')} />
          <Field label="Автор туралы қысқаша мәлімет"><textarea rows={5} className={inp} value={content.site.authorBio ?? ''} onChange={e => setSite('authorBio', e.target.value)} /></Field>
          <Field label="Әлеуметтік желі сілтемесі (https://…)"><input className={inp} value={content.site.socialUrl ?? ''} onChange={e => setSite('socialUrl', e.target.value)} /></Field>
          <ImageField label="QR-код суреті" src={show(content.site.socialQr)} onPick={pickSite('socialQr')} />
        </Card>
      )}

      {tab === 'resources' && <Card title="Сынып жетекшілеріне арналған ресурстар">
        <p className="text-sm text-navy-800">Басты беттегі үш бөлімге құжаттар қосыңыз. Өзгерістерді сайтқа шығару үшін «Жариялау» батырмасын басыңыз.</p>
        {HOME_RESOURCE_GROUPS.map(group => <fieldset disabled={busy} key={group.id} className="space-y-3 rounded-2xl border border-sky-line p-4 disabled:opacity-60">
          <legend className="px-2 font-bold">{group.title}</legend>
          {(content.site.resources?.[group.id] ?? []).map((r,i) => <div key={r.file} className="flex items-center gap-2">
            <input aria-label="Құжат атауы" className={inp} value={r.title} onChange={e=>upd(c=>{const item=c.site.resources?.[group.id]?.[i];if(item)item.title=e.target.value})}/>
            {pending[r.file] ? <span className="text-xs">Нобай</span> : <a href={r.file} target="_blank" rel="noopener noreferrer" className="text-sm underline">Ашу</a>}
            <button aria-label="Өшіру" className="rounded-full p-2 text-red-700" onClick={()=>upd(c=>{c.site.resources?.[group.id]?.splice(i,1)})}><Trash2 className="h-4 w-4"/></button>
          </div>)}
          <Pick label="Құжат қосу" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip" multiple onFiles={async files=>{
            setBusy(true);setMsg(null)
            try { for (const f of files) { const path=await addDoc(f);if(path)upd(c=>{((c.site.resources??={})[group.id]??=[]).push({title:f.name,file:path})}) } }
            catch {err('Файлды оқу мүмкін болмады.')} finally {setBusy(false)}
          }}/>
          <p className="text-xs text-navy-700">Әр файл 25 МБ-тан аспауы керек.</p>
        </fieldset>)}
      </Card>}

      {tab === 'steps' && (
        <Card title="Алты қадам">
          <Field label="Қадамды таңдаңыз">
            <select className={inp} value={step} onChange={e => setStep(e.target.value)}>
              {directions(content.settings).map((d, i) => <option key={d.slug} value={d.slug}>{i + 1}. {d.title}</option>)}
            </select>
          </Field>
          {mediaList('photos', 'Фотолар')}

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
        </Card>
      )}

      {tab === 'ach' && (
        <Card title="Оқушылар жетістіктері">
          {ACHIEVEMENT_YEARS.map(year => <div key={year} className="space-y-4 rounded-2xl border border-sky-line p-4">
          <h3 className="text-lg font-bold">{year.replace('-', '–')} оқу жылы</h3>
          {content.achievements.map((a, i) => achievementYear(a) !== year ? null : (
            <div key={i} className="space-y-3 rounded-2xl border border-sky-line p-4">
              <Field label="Атауы"><input className={inp} value={a.title} onChange={e => upd(c => { c.achievements[i].title = e.target.value })} /></Field>
              <Field label="Сипаттамасы"><textarea rows={3} className={inp} value={a.text ?? ''} onChange={e => upd(c => { c.achievements[i].text = e.target.value })} /></Field>
              <Field label="Оқу жылы"><select className={inp} value={achievementYear(a)} onChange={e => upd(c => { c.achievements[i].year = e.target.value as AchievementYear })}>{ACHIEVEMENT_YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></Field>
              <ImageField circle label="Сурет" src={show(a.photo)} onPick={async f => { const [p] = await addImages([f]); if (p) upd(c => { c.achievements[i].photo = p }) }} />
              <button className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`} onClick={() => upd(c => { c.achievements.splice(i, 1) })}><Trash2 className="h-4 w-4" aria-hidden="true" />Карточканы өшіру</button>
            </div>
          ))}
          <button className={`${btn} bg-sky-soft`} onClick={() => upd(c => { c.achievements.push({ title: '', year }) })}><Plus className="h-4 w-4" aria-hidden="true" />Жаңа карточка қосу</button>
          </div>)}
        </Card>
      )}
      </fieldset>
    </div>
  )
}
