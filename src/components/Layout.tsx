import { useContent } from '../content-store'
import { txt, menu, themeStyle } from '../site-settings'
import type { CSSProperties } from 'react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, MapPin, GraduationCap, Home, Star, Trophy, Lightbulb, Users, TrendingUp, Share2, type LucideIcon } from 'lucide-react'
import { NAV, AUTHOR, PROJECT_TITLE, SLOGAN } from '../data'
import Ornament from './Ornament'

const ICONS: Record<string, LucideIcon> = { about: Home, author: Star, model: Trophy, practice: Lightbulb, resources: Users, achievements: TrendingUp, social: Share2 }
const NavIcon = ({ id }: { id: string }) => { const I = ICONS[id] ?? Home; return <I className="h-4 w-4 text-gold" aria-hidden="true" /> }

export default function Layout({ children }: { children: ReactNode }) {
  const {content} = useContent()
  const settings = content.settings
  useEffect(()=>{document.title=txt(settings,"projectTitle")},[settings])
  const nav = menu(settings).filter(n=>!n.hidden)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const go = (id: string) => { setOpen(false); navigate('/', { state: { scrollTo: id } }) }

  return (
    <div className="site-shell flex min-h-screen flex-col bg-sky-soft text-navy-900" style={themeStyle(settings) as CSSProperties}>
      <a href="#main" className="sr-only rounded bg-gold px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50">Негізгі мазмұнға өту</a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/90 text-white backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-serif text-xl font-extrabold text-gold-light" aria-label="Басты бет">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-navy-950">{content.site.logoPhoto ? <img src={content.site.logoPhoto} className="h-full w-full rounded-xl object-contain" alt=""/> : txt(settings,"logo")}</span>{txt(settings,"brand")}
          </Link>
          <nav aria-label="Негізгі мәзір" className="hidden items-center gap-0.5 xl:flex">
            {nav.map(n => (
              <button key={n.id} onClick={() => go(n.id)} className="inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-[13px] font-medium text-white/85 transition hover:bg-white/10 hover:text-white"><NavIcon id={n.id} />{n.label}</button>
            ))}
          </nav>
          <button className="rounded-xl p-2 text-white xl:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Мәзірді жабу' : 'Мәзірді ашу'}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Мобильді мәзір" className="border-t border-white/10 bg-navy-950 px-4 py-3 xl:hidden">
            {nav.map(n => (
              <button key={n.id} onClick={() => go(n.id)} className="block w-full rounded-xl px-3 py-3 text-left font-medium text-white hover:bg-white/10">{n.label}</button>
            ))}
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">{children}</main>

      <footer className="bg-navy-950 text-white">
        <Ornament />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
          <div>
            <p className="font-serif text-lg font-bold text-gold-light">{txt(settings,"projectTitle")}</p>
            <p className="mt-3 text-sm text-white/70">{txt(settings,"slogan")}</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" /><span><strong>Автор:</strong> {txt(settings,"authorName")}<br />{txt(settings,"authorRole")}</span></p>
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />{txt(settings,"school")}</p>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs text-white/50">© {new Date().getFullYear()} {txt(settings,"footer")} · <Link to="/admin" className="hover:underline">Әкімші</Link></p>
      </footer>
    </div>
  )
}
