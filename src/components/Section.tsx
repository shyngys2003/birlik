import type { ReactNode } from 'react'
import Ornament from './Ornament'

interface Props { id: string; eyebrow: string; title: string; children: ReactNode; tone?: 'soft' | 'white' }

export default function Section({ id, eyebrow, title, children, tone = 'soft' }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`scroll-mt-20 py-16 sm:py-20 ${tone === 'white' ? 'bg-white' : ''}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">{eyebrow}</p>
        <h2 id={`${id}-h`} className="mt-2 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">{title}</h2>
        <Ornament className="mt-4 max-w-[180px]" />
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}
