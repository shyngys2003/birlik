import { useContent } from '../content-store'
import { txt } from '../site-settings'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface Props { n: number; title: string; icon: LucideIcon; children: ReactNode }

export default function Block({ n, title, icon: Icon, children }: Props) {
  const {content}=useContent()
  return (
    <section aria-labelledby={`b${n}`} className="rounded-3xl border border-sky-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center gap-3">
        <span className="accent-soft accent-text flex h-10 w-10 items-center justify-center rounded-xl"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <h2 id={`b${n}`} className="font-serif text-2xl font-bold text-navy-900">{txt(content.settings,`block.${n}`,title)}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
