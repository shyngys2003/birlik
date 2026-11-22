import { FileDown, Image as ImageIcon, Video as VideoIcon, FileText } from 'lucide-react'
import type { CategoryMaterials } from '../content-store'

const youtubeId = (url: string) => url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/))([\w-]{11})/)?.[1]

export default function CategoryMaterialsView({ title, materials }: { title: string; materials?: CategoryMaterials }) {
  const photos = materials?.photos ?? []
  const videos = materials?.videos ?? []
  const files = materials?.files ?? []
  const total = photos.length + videos.length + files.length
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-semibold text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
        <span>{title}</span>
        <span className="shrink-0 rounded-full bg-white/70 px-2 py-1 text-xs font-normal text-navy-700">{total > 0 ? `${total} материал · Ашу` : 'Материал жоқ'}</span>
      </summary>
      {total === 0 ? (
        <p className="mt-3 text-xs text-navy-700/70">Материал кейінірек жүктеледі</p>
      ) : (
        <div className="mt-4 space-y-4">
          {photos.length > 0 && <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold"><ImageIcon className="h-4 w-4"/> Фотолар</h4>
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo, i) => <figure key={`${photo.src}-${i}`}>
                <a href={photo.src} target="_blank" rel="noopener noreferrer"><img src={photo.src} loading="lazy" alt={photo.caption || title} className="aspect-[4/3] w-full rounded-xl object-cover"/></a>
                {photo.caption && <figcaption className="mt-1 text-xs text-navy-700">{photo.caption}</figcaption>}
              </figure>)}
            </div>
          </div>}
          {videos.length > 0 && <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold"><VideoIcon className="h-4 w-4"/> Бейнелер</h4>
            <div className="space-y-2">
              {videos.map((video, i) => {
                const id = youtubeId(video.url)
                return <figure key={`${video.url}-${i}`} className="overflow-hidden rounded-xl bg-white">
                  {id ? <iframe title={video.caption || title} src={`https://www.youtube-nocookie.com/embed/${id}`} className="aspect-video w-full" allowFullScreen loading="lazy" />
                    : /\.(?:mp4|webm)(?:\?.*)?$/i.test(video.url) ? <video src={video.url} controls preload="metadata" className="aspect-video w-full" />
                    : /^https:\/\//i.test(video.url) ? <a href={video.url} target="_blank" rel="noopener noreferrer" className="block p-3 text-sm underline">Бейнені ашу</a> : null}
                  {video.caption && <figcaption className="p-2 text-xs text-navy-700">{video.caption}</figcaption>}
                </figure>
              })}
            </div>
          </div>}
          {files.length > 0 && <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4"/> Құжаттар</h4>
            <ul className="space-y-2">{files.map((file,i) => <li key={`${file.file}-${i}`}>
              <a href={file.file} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium hover:underline"><FileDown className="h-4 w-4 shrink-0"/><span className="min-w-0 break-words">{file.title}</span></a>
            </li>)}</ul>
          </div>}
        </div>
      )}
    </details>
  )
}
