import { useState } from 'react'
import { Camera, Video } from 'lucide-react'
import Placeholder from './Placeholder'

type Tab = 'photo' | 'video'

export default function Gallery() {
  const [tab, setTab] = useState<Tab>('photo')
  const tabs: { id: Tab; label: string; icon: typeof Camera }[] = [
    { id: 'photo', label: 'Фотогалерея', icon: Camera },
    { id: 'video', label: 'Бейнегалерея', icon: Video },
  ]
  return (
    <div>
      <div role="tablist" aria-label="Галерея түрі" className="mb-5 inline-flex rounded-full bg-sky-soft p-1">
        {tabs.map(t => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.id ? 'accent-bg text-white shadow' : 'text-navy-800'}`}>
            <t.icon className="h-4 w-4" aria-hidden="true" />{t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <Placeholder key={n} icon={tab === 'photo' ? Camera : Video} className="aspect-video"
            label={tab === 'photo' ? `Фото ${n}` : `Бейне ${n}`}
            hint={tab === 'photo' ? 'Фотосурет кейінірек жүктеледі' : 'Бейне кейінірек жүктеледі'} />
        ))}
      </div>
    </div>
  )
}
