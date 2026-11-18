import { Link, useParams } from 'react-router-dom'
import { useContent } from '../content-store'
import { type BuilderBlock, safeUrl, youtube } from '../builder'
import type { ReactNode } from 'react'
export function BuilderView({blocks, preview}: {blocks:BuilderBlock[];preview?:(s:string)=>string}) {
 return <div className="space-y-5">{blocks.filter(b=>!b.hidden).map(b=>{const url=safeUrl(b.url,true); const vid=youtube(b.url); const src=preview?.(b.url)||url; return <section key={b.id} style={{textAlign:b.align}} className={`${b.width==='narrow'?'max-w-xl':b.width==='normal'?'max-w-4xl':'max-w-none'} mx-auto rounded-3xl ${b.tone==='dark'?'bg-navy-900 text-white':b.tone==='soft'?'bg-sky-soft':'bg-white shadow-card'} p-5 sm:p-8`}>
 {b.kind!=='divider'&&b.title&&<h2 className="mb-3 font-serif text-2xl font-bold break-words">{b.title}</h2>}
 {b.kind==='image'&&src&&<img className="mx-auto max-h-[650px] max-w-full rounded-xl object-contain" src={src} alt={b.text||b.title} loading="lazy"/>}
 {b.kind==='video'&&vid&&<iframe className="aspect-video w-full rounded-xl" src={vid} title={b.title||'YouTube'} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>}
 {b.kind==='quote'&&<blockquote className="border-l-4 border-gold px-4 italic whitespace-pre-wrap break-words">{b.text}</blockquote>}
 {b.kind!=='quote'&&b.kind!=='divider'&&b.text&&<p className="my-3 whitespace-pre-wrap break-words leading-relaxed">{b.text}</p>}
 {(b.kind==='link'||b.kind==='file')&&url&&<a className="inline-block rounded-full bg-gold px-5 py-3 font-semibold text-navy-950" href={url} target="_blank" rel="noopener noreferrer">{b.kind==='file'?'Жүктеп алу':'Сілтемені ашу'}</a>}
 {b.kind==='divider'&&<hr className="border-gold"/>}
 </section>})}</div>
}
export function ExtraBlocks({target,children}:{target?:string;children:ReactNode}) {const {slug}=useParams();const {content}=useContent();const blocks=content.builder?.extras?.[target||slug||'']||[];return <>{children}{blocks.some(b=>!b.hidden)&&<div className="mx-auto max-w-6xl px-4 py-8"><BuilderView blocks={blocks}/></div>}</>}
export function CustomPage(){const {id}=useParams();const {content}=useContent(); const p=content.builder?.pages?.find(p=>p.id===id&&!p.hidden); if(!p)return <div className="py-24 text-center">Бет табылмады <Link className="underline" to="/">Басты бет</Link></div>;return <div className="mx-auto max-w-6xl space-y-8 px-4 py-10"><header className="text-center"><h1 className="font-serif text-4xl font-bold break-words">{p.title}</h1><p className="mt-4 whitespace-pre-wrap">{p.description}</p></header><BuilderView blocks={p.blocks}/></div>}
