import { useState } from 'react'
import { Camera, Video } from 'lucide-react'
import Placeholder from './Placeholder'
import type { Media, VideoItem } from '../content-store'

type Tab = 'photo' | 'video'
const ytId = (u: string) => u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/))([\w-]{11})/)?.[1]

function VideoCard({ v }: { v: VideoItem }) {
  if (!/^https?:\/\//.test(v.url)) return null
  const id = ytId(v.url)
  return (
    <figure className="overflow-hidden rounded-2xl border border-sky-line bg-white">
      {id ? (
        <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${id}`} title={v.caption || 'Бейне'} loading="lazy" allowFullScreen />
      ) : /\.mp4$/i.test(v.url) ? (
        <video className="aspect-video w-full" src={v.url} controls preload="metadata" />
      ) : (
        <a href={v.url} target="_blank" rel="noopener noreferrer" className="flex aspect-video items-center justify-center font-semibold text-navy-700 underline">Бейнені ашу</a>
      )}
      {v.caption && <figcaption className="p-3 text-sm text-navy-800">{v.caption}</figcaption>}
    </figure>
  )
}

export default function Gallery({ photos = [], videos = [] }: { photos?: Media[]; videos?: VideoItem[] }) {
  const [tab, setTab] = useState<Tab>('photo')
  const tabs = [
    { id: 'photo' as Tab, label: 'Фотогалерея', icon: Camera },
    { id: 'video' as Tab, label: 'Бейнегалерея', icon: Video },
  ]
  const items = tab === 'photo' ? photos : videos
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
        {items.length === 0 &&
          [1, 2, 3, 4, 5, 6].map(n => (
            <Placeholder key={n} icon={tab === 'photo' ? Camera : Video} className="aspect-video"
              label={tab === 'photo' ? `Фото ${n}` : `Бейне ${n}`}
              hint={tab === 'photo' ? 'Фотосурет кейінірек жүктеледі' : 'Бейне кейінірек жүктеледі'} />
          ))}
        {tab === 'photo' && photos.map(p => (
          <figure key={p.src} className="overflow-hidden rounded-2xl border border-sky-line bg-white">
            <a href={p.src} target="_blank" rel="noopener noreferrer">
              <img src={p.src} alt={p.caption || 'Сынып тәжірибесінен сурет'} loading="lazy" className="aspect-video w-full object-cover" />
            </a>
            {p.caption && <figcaption className="p-3 text-sm text-navy-800">{p.caption}</figcaption>}
          </figure>
        ))}
        {tab === 'video' && videos.map(v => <VideoCard key={v.url} v={v} />)}
      </div>
    </div>
  )
}
