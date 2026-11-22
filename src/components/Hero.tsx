import { txt } from '../site-settings'
import { useEffect, useState } from 'react'
import { useContent } from '../content-store'
import { Link } from 'react-router-dom'
import { Play, ArrowDown, Handshake, Star, BrainCircuit, TrendingUp, ThumbsUp, Heart, BookOpen, Send, ImagePlus } from 'lucide-react'

const TILES = [
  { icon: Handshake, label: 'Ұйымшылдық пен достық' },
  { icon: Star, label: 'Тәрбиелік мәні' },
  { icon: BrainCircuit, label: 'Жаңашыл әдіс-тәсілдер' },
  { icon: TrendingUp, label: 'Жетістікке бірге!' },
]
const goldText = 'bg-gradient-to-r from-gold-light via-gold to-gold-light bg-clip-text text-transparent'
const glow = { filter: 'drop-shadow(0 0 10px rgba(255,215,130,.85))' }

export default function Hero() {
  const [photoOk, setPhotoOk] = useState(true)
  const { content } = useContent()
  const settings = content.settings
  const heroSrc = content.site.heroPhoto || 'hero-photo.jpg'
  useEffect(() => setPhotoOk(true), [heroSrc])
  return (
    <div className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 60% at 82% 30%, rgba(120,170,255,.55), transparent 62%), radial-gradient(ellipse 35% 35% at 88% 52%, rgba(255,190,110,.45), transparent 65%), linear-gradient(135deg,rgb(var(--navy-950)) 0%,rgb(var(--navy-900)) 45%,rgb(var(--navy-800)) 100%)' }} />
      <svg aria-hidden="true" className="absolute bottom-0 left-0 w-2/3 max-w-lg opacity-80" viewBox="0 0 400 160" fill="none">
        <defs><linearGradient id="gld" x1="0" x2="1"><stop offset="0" stopColor="#E8D39A" /><stop offset="1" stopColor="#C9A24B" stopOpacity="0" /></linearGradient></defs>
        <path d="M0 110C100 50 200 150 400 40" stroke="url(#gld)" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 145C120 95 220 160 400 85" stroke="url(#gld)" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-16">
        <div>
          <div className="rise flex items-center gap-4">
            <img
              src={content.site.schoolEmblem || '/birlik/uploads/keleshek11-school-emblem.png'}
              alt="№11 мектеп эмблемасы"
              className="h-20 w-20 shrink-0 rounded-full border-2 border-gold-light bg-white object-cover p-0.5 shadow-lg sm:h-24 sm:w-24"
            />
            {txt(settings,"badge").trim() && (
              <span className="rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-light px-4 py-2 text-xs font-bold uppercase tracking-wide text-navy-950 shadow-lg sm:text-sm">
                {txt(settings,"badge")}
              </span>
            )}
          </div>
          <h1 className="rise mt-6 font-serif text-4xl font-extrabold leading-[1.12] sm:text-5xl xl:text-6xl">
            {settings?.texts?.projectTitle !== undefined ? txt(settings,"projectTitle") : <>«Дос бол <span className={goldText}>LIKE</span>» жобасы негізіндегі «<span className={goldText}>БІРЛІК</span>» моделі</>}
          </h1>
          <p className="rise mt-6 text-2xl leading-snug sm:text-3xl" style={{ fontFamily: '"Marck Script", cursive' }}>
            {settings?.texts?.slogan !== undefined ? txt(settings,"slogan") : <>Бір мақсат. Бір команда.<br /><span className="text-gold-light">Бірлікке бастар алты қадам!</span></>}
            <span className="mt-2 block h-1 w-64 max-w-full rounded-full bg-gradient-to-r from-gold to-transparent" aria-hidden="true" />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" state={{ scrollTo: 'model' }} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-light px-7 py-3 font-semibold text-navy-950 shadow-lg transition hover:-translate-y-0.5">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />{txt(settings,"modelButton")}
            </Link>
            <Link to="/" state={{ scrollTo: 'about' }} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3 font-semibold transition hover:bg-white/10">
              {txt(settings,"aboutButton")} <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TILES.map((t,i) => (
              <li key={txt(settings,`tile${i+1}`,t.label)} className="flex flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-4 text-center text-sm font-medium backdrop-blur">
                <t.icon className="h-7 w-7 text-gold" aria-hidden="true" />{txt(settings,`tile${i+1}`,t.label)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-[4/3.4] w-full max-w-lg">
          <ThumbsUp className="absolute left-0 top-10 h-20 w-20 text-white sm:h-24 sm:w-24" strokeWidth={1.5} style={glow} aria-hidden="true" />
          <svg className="absolute left-1/4 top-0 w-3/5" viewBox="0 0 200 180" fill="none" aria-hidden="true" style={glow}>
            <path d="M100 165C20 105 15 45 55 30C80 20 98 38 100 52C102 38 120 20 145 30C185 45 180 105 100 165Z" stroke="#F4E2A8" strokeWidth="3" />
            <text x="100" y="95" textAnchor="middle" fontSize="38" fontWeight="700" fill="#E8D39A" fontFamily="Playfair Display, serif">{txt(settings,"heroLike")}</text>
          </svg>
          <Heart className="absolute right-4 top-3 h-8 w-8 text-white/90" aria-hidden="true" />
          <p className="absolute right-0 top-14 w-44 -rotate-6 text-right text-xl text-white/90" style={{ fontFamily: '"Marck Script", cursive' }}>{txt(settings,"heroNote")}</p>

          {photoOk ? (
            <img src={heroSrc} alt="Сынып оқушылары" onError={() => setPhotoOk(false)}
              className="absolute inset-x-0 bottom-0 h-3/5 w-full rounded-2xl object-cover object-top" />
          ) : (
            <div role="img" aria-label="Орын: сынып фотосы" className="absolute inset-x-0 bottom-6 flex h-2/5 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-white/40 bg-white/10 p-4 text-center backdrop-blur">
              <ImagePlus className="h-6 w-6 text-gold" aria-hidden="true" />
              <p className="font-semibold">Сынып фотосы</p>
              <p className="text-xs text-white/70">public/hero-photo.jpg файлы кейінірек қосылады</p>
            </div>
          )}
          <Send className="absolute bottom-24 right-6 h-8 w-8 text-white/80" strokeWidth={1.5} aria-hidden="true" />
          <BookOpen className="absolute -bottom-4 right-0 h-24 w-24 text-gold-light" strokeWidth={1.4} style={glow} aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
