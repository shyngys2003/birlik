import { useParams, Link } from 'react-router-dom'
import { EVENT_CATEGORIES, type EventCategory } from '../event-categories'
import { useContent } from '../content-store'
import Gallery from '../components/Gallery'
import { CalendarDays, FileDown, ArrowLeft } from 'lucide-react'

export default function EventsPage() {
  const { category } = useParams()
  const active = EVENT_CATEGORIES.find(c => c.id === category)
  const { content } = useContent()
  if (!active) return <div className="mx-auto max-w-6xl py-24 text-center">Бөлім табылмады</div>
  const items = content.events?.[active.id as EventCategory] ?? []
  return <div className="mx-auto max-w-6xl space-y-7 px-4 py-10 sm:px-6">
    <Link to="/" className="inline-flex items-center gap-2 text-sm text-navy-700 hover:underline"><ArrowLeft className="h-4 w-4"/>Басты бет</Link>
    <div><p className="text-sm font-semibold uppercase tracking-widest text-gold">Іс-шаралар</p><h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{active.title}</h1></div>
    <nav aria-label="Іс-шаралар санаттары" className="flex flex-wrap gap-2">{EVENT_CATEGORIES.map(c=><Link key={c.id} to={`/events/${c.id}`} className={`rounded-full px-4 py-2 text-sm font-semibold ${c.id===category?'bg-navy-900 text-white':'bg-white text-navy-900 border border-sky-line'}`}>{c.title}</Link>)}</nav>
    {items.length===0 && <div className="rounded-3xl border border-sky-line bg-white p-10 text-center text-navy-700">Материалдар кейінірек қосылады.</div>}
    {items.map(event=><article key={event.id} className="space-y-5 rounded-3xl border border-sky-line bg-white p-5 shadow-card sm:p-7">
      <h2 className="font-serif text-2xl font-bold">{event.title}</h2>
      {event.date && <p className="flex items-center gap-2 text-sm text-navy-700"><CalendarDays className="h-4 w-4"/>{event.date}</p>}
      {event.description && <p className="whitespace-pre-line leading-relaxed text-navy-800">{event.description}</p>}
      {((event.photos?.length??0)>0 || (event.videos?.length??0)>0) && <Gallery photos={event.photos} videos={event.videos}/>}
      {(event.files?.length??0)>0 && <div className="grid gap-3 sm:grid-cols-2">{event.files.map(f=><a key={f.file} href={f.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-sky-soft p-3 font-medium hover:underline"><FileDown className="h-5 w-5 shrink-0 text-gold"/>{f.title}</a>)}</div>}
    </article>)}
  </div>
}
