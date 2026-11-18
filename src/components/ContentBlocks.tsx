import { CalendarDays, FileText, ListChecks, Trophy, MessageSquareQuote, FileDown } from 'lucide-react'
import Placeholder from './Placeholder'
import type { Achievement, StepData } from '../content-store'

const RESOURCES = ['Әдістемелік нұсқаулық', 'Іс-шара сценарийі', 'Тапсырма парақтары мен сауалнамалар']

export function Experience({ d }: { d: StepData }) {
  if (!d.experience && !d.whenWhere) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Placeholder label="Іс-шара сипаттамасы" hint="Нақты іс-шаралар сипаттамасы кейінірек толтырылады" icon={FileText} className="min-h-36" />
        <Placeholder label="Өткізілген уақыты мен орны" hint="Күні мен орны кейінірек қосылады" icon={CalendarDays} className="min-h-36" />
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {d.whenWhere && <p className="accent-text flex items-center gap-2 font-semibold"><CalendarDays className="h-5 w-5" aria-hidden="true" />{d.whenWhere}</p>}
      {d.experience && <p className="whitespace-pre-line leading-relaxed text-navy-800">{d.experience}</p>}
    </div>
  )
}

export function Results({ d }: { d: StepData }) {
  const ev = d.evidence ?? []
  if (!d.results && ev.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Placeholder label="Нәтиже көрсеткіштері" hint="Нақты деректер кейінірек қосылады" icon={ListChecks} className="min-h-36" />
        <Placeholder label="Дәлелдер: грамоталар, куәліктер" hint="Сканерленген құжаттар кейінірек жүктеледі" icon={Trophy} className="min-h-36" />
        <Placeholder label="Оқушылар мен ата-аналар пікірі" hint="Пікірлер кейінірек қосылады" icon={MessageSquareQuote} className="min-h-36" />
      </div>
    )
  }
  return (
    <div className="space-y-5">
      {d.results && <p className="whitespace-pre-line leading-relaxed text-navy-800">{d.results}</p>}
      {ev.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ev.map(e => (
            <figure key={e.src} className="overflow-hidden rounded-2xl border border-sky-line">
              <a href={e.src} target="_blank" rel="noopener noreferrer"><img src={e.src} alt={e.caption || 'Дәлел құжаты'} loading="lazy" className="aspect-[4/3] w-full object-cover" /></a>
              {e.caption && <figcaption className="p-3 text-sm">{e.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}

export function Resources({ d }: { d: StepData }) {
  const list = d.resources ?? []
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {list.length > 0
        ? list.map(r => (
            <div key={r.file} className="flex flex-col gap-3 rounded-2xl border border-sky-line p-4">
              <p className="font-semibold">{r.title}</p>
              <a href={r.file} target="_blank" rel="noopener noreferrer" download className="accent-bg mt-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white">
                <FileDown className="h-4 w-4" aria-hidden="true" />Жүктеп алу
              </a>
            </div>
          ))
        : RESOURCES.map(r => (
            <div key={r} className="flex flex-col gap-3 rounded-2xl border border-sky-line p-4">
              <p className="font-semibold">{r}</p>
              <button disabled className="mt-auto inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-sky-soft px-4 py-2 text-sm font-semibold text-navy-700/60">
                <FileDown className="h-4 w-4" aria-hidden="true" />Файл кейінірек жүктеледі
              </button>
            </div>
          ))}
    </div>
  )
}

export function Achievements({ items }: { items: Achievement[] }) {
  if (items.length === 0) {
    return (
      <div className="grid gap-5 sm:grid-cols-3">
        {[1, 2, 3].map(n => <Placeholder key={n} label={`Жетістік карточкасы ${n}`} hint="Нақты деректер кейінірек қосылады" icon={Trophy} className="min-h-40" />)}
      </div>
    )
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a, i) => (
        <article key={i} className="overflow-hidden rounded-3xl border border-sky-line bg-white shadow-card">
          {a.photo && <img src={a.photo} alt={a.title} loading="lazy" className="aspect-video w-full object-cover" />}
          <div className="p-5">
            <Trophy className="h-6 w-6 text-gold" aria-hidden="true" />
            <h3 className="mt-2 font-bold">{a.title}</h3>
            {a.text && <p className="mt-1 text-sm leading-relaxed text-navy-800/80">{a.text}</p>}
          </div>
        </article>
      ))}
    </div>
  )
}
