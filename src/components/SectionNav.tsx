import { directions } from '../site-settings'
import { useContent } from '../content-store'
import { Link } from 'react-router-dom'
import { DIRECTIONS } from '../data'

export default function SectionNav({ current }: { current: string }) {
  const {content}=useContent()
  return (
    <nav aria-label="Алты қадам арасында ауысу" className="sticky top-16 z-30 border-b border-sky-line bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {directions(content.settings).map((d, i) => {
          const active = d.slug === current
          const {content}=useContent()
  return (
            <li key={d.slug} className="shrink-0">
              <Link to={`/qadam/${d.slug}`} aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${active ? 'accent-bg accent-border text-white' : 'border-sky-line bg-white text-navy-800 hover:bg-sky-soft'}`}>
                <span className="font-serif text-base">{d.letter}</span>
                <span className="hidden sm:inline">{i + 1}. {d.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
