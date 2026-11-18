import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Direction } from '../data'

export default function DirectionCard({ d, index }: { d: Direction; index: number }) {
  const Icon = d.icon
  return (
    <Link to={`/qadam/${d.slug}`} style={{ animationDelay: `${index * 80}ms` }}
      className="rise group relative flex flex-col overflow-hidden rounded-3xl border border-sky-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-xl">
      <span className="absolute -right-3 -top-6 select-none font-serif text-[8rem] font-extrabold leading-none text-sky-soft transition group-hover:text-gold-light/40" aria-hidden="true">{d.letter}</span>
      <div className="relative flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 font-serif text-2xl font-bold text-gold">{d.letter}</span>
        <Icon className="h-6 w-6 text-navy-700" aria-hidden="true" />
        <span className="ml-auto text-xs font-semibold text-navy-700/60">{index + 1} қадам</span>
      </div>
      <h3 className="relative mt-5 text-xl font-bold text-navy-900">{d.title}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-navy-800/80">{d.short}</p>
      <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-700 group-hover:text-navy-900">
        Бетке өту <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  )
}
