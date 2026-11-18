import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Target, BookOpen, Lightbulb, School, Images, BarChart3, ClipboardList, Download, CheckCircle2, FileText, ListChecks, CalendarDays, Trophy, MessageSquareQuote } from 'lucide-react'
import { DIRECTIONS } from '../data'
import { CONTENT } from '../content'
import Ornament from '../components/Ornament'
import Placeholder from '../components/Placeholder'
import SectionNav from '../components/SectionNav'
import Block from '../components/Block'
import Gallery from '../components/Gallery'

const RESOURCES = ['Әдістемелік нұсқаулық', 'Іс-шара сценарийі', 'Тапсырма парақтары мен сауалнамалар']

export default function DirectionPage() {
  const { slug = '' } = useParams()
  const i = DIRECTIONS.findIndex(d => d.slug === slug)
  const c = CONTENT[slug]
  if (i < 0 || !c) return <div className="py-32 text-center text-xl">Бет табылмады</div>
  const d = DIRECTIONS[i]
  const prev = DIRECTIONS[i - 1], next = DIRECTIONS[i + 1]
  const Icon = d.icon

  return (
    <div style={{ '--accent': c.accent } as CSSProperties}>
      <div className="accent-border border-b-4 bg-gradient-to-br from-navy-950 to-navy-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <nav aria-label="Навигация жолы" className="text-sm text-white/70">
            <Link to="/" className="hover:text-gold-light">Басты бет</Link> / <span>{i + 1}-қадам</span>
          </nav>
          <div className="mt-6 flex items-center gap-5">
            <span className="accent-bg flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl font-serif text-5xl font-extrabold text-white">{d.letter}</span>
            <div>
              <h1 className="font-serif text-3xl font-extrabold sm:text-5xl">{d.title}</h1>
              <p className="mt-2 flex items-center gap-2 text-gold-light"><Icon className="h-5 w-5" aria-hidden="true" />БІРЛІК моделінің {i + 1}-қадамы</p>
            </div>
          </div>
          <Ornament className="mt-6 max-w-xs" />
        </div>
      </div>

      <SectionNav current={slug} />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        <Block n={1} title="Тәрбиелік мақсаты" icon={Target}>
          <p className="text-lg font-medium leading-relaxed text-navy-900">{c.purpose}</p>
        </Block>

        <Block n={2} title="Қысқаша түсініктеме" icon={BookOpen}>
          <p className="leading-relaxed text-navy-800">{c.explanation}</p>
          <h3 className="mt-6 font-bold text-navy-900">Мазмұн бағыттары</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.categories.map(t => (
              <li key={t} className="accent-soft flex flex-col gap-2 rounded-2xl p-4">
                <span className="font-semibold text-navy-900">{t}</span>
                <span className="text-xs text-navy-700/70">Материал кейінірек жүктеледі</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block n={3} title="Ұсынылатын оқыту әдістері" icon={Lightbulb}>
          <ul className="grid gap-3 sm:grid-cols-3">
            {c.methods.map(m => (
              <li key={m} className="flex items-start gap-3 rounded-2xl border border-sky-line p-4">
                <CheckCircle2 className="accent-text mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="font-medium">{m}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block n={4} title="Біздің сынып тәжірибесі" icon={School}>
          <div className="grid gap-4 md:grid-cols-2">
            <Placeholder label="Іс-шара сипаттамасы" hint="Нақты іс-шаралар сипаттамасы кейінірек толтырылады" icon={FileText} className="min-h-36" />
            <Placeholder label="Өткізілген уақыты мен орны" hint="Күні мен орны кейінірек қосылады" icon={CalendarDays} className="min-h-36" />
          </div>
        </Block>

        <Block n={5} title="Фото және бейне галерея" icon={Images}>
          <Gallery />
        </Block>

        <Block n={6} title="Нәтиже және дәлелдер" icon={BarChart3}>
          <div className="grid gap-4 md:grid-cols-3">
            <Placeholder label="Нәтиже көрсеткіштері" hint="Нақты деректер кейінірек қосылады" icon={ListChecks} className="min-h-36" />
            <Placeholder label="Дәлелдер: грамоталар, куәліктер" hint="Сканерленген құжаттар кейінірек жүктеледі" icon={Trophy} className="min-h-36" />
            <Placeholder label="Оқушылар мен ата-аналар пікірі" hint="Пікірлер кейінірек қосылады" icon={MessageSquareQuote} className="min-h-36" />
          </div>
        </Block>

        <Block n={7} title="Сынып жетекшілеріне практикалық ұсыныстар" icon={ClipboardList}>
          <ol className="space-y-3">
            {c.tips.map((t, k) => (
              <li key={t} className="flex gap-4">
                <span className="accent-bg flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">{k + 1}</span>
                <p className="pt-1 leading-relaxed text-navy-800">{t}</p>
              </li>
            ))}
          </ol>
        </Block>

        <Block n={8} title="Әдістемелік ресурстар" icon={Download}>
          <div className="grid gap-4 md:grid-cols-3">
            {RESOURCES.map(r => (
              <div key={r} className="flex flex-col gap-3 rounded-2xl border border-sky-line p-4">
                <p className="font-semibold">{r}</p>
                <button disabled className="mt-auto inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-sky-soft px-4 py-2 text-sm font-semibold text-navy-700/60">
                  <Download className="h-4 w-4" aria-hidden="true" />Файл кейінірек жүктеледі
                </button>
              </div>
            ))}
          </div>
        </Block>

        <div className="flex justify-between gap-4 pt-4">
          {prev ? <Link to={`/qadam/${prev.slug}`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold shadow-card hover:bg-sky-line"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{prev.title}</Link> : <span />}
          {next ? <Link to={`/qadam/${next.slug}`} className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3 font-semibold text-white shadow-card hover:bg-navy-700">{next.title}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link> : <Link to="/" className="rounded-full bg-gold px-5 py-3 font-semibold text-navy-950">Басты бетке</Link>}
        </div>
      </div>
    </div>
  )
}
