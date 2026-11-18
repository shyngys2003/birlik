import { useState } from 'react'
import { COLORS, TEXTS, txt, menu, directions, sectionContent, themeStyle, type SiteSettings } from '../site-settings'
import type { CSSProperties } from 'react'
const input='w-full rounded-xl border border-sky-line bg-white px-3 py-2 text-sm text-navy-900'
const button='rounded-xl border border-sky-line bg-white px-3 py-2 text-sm font-semibold'
const labels:Record<string,string>={brand:'Сайт атауы',logo:'Логотип әрпі',projectTitle:'Жобаның толық атауы',slogan:'Ұран',authorName:'Автордың аты-жөні',authorRole:'Автордың қызметі',school:'Мектеп',badge:'Басты бет белгісі',modelButton:'Модель батырмасы',aboutButton:'Жоба батырмасы',heroNote:'Сурет жанындағы мәтін',heroLike:'Жүрек ішіндегі мәтін',aboutText:'Жоба сипаттамасы',footer:'Төменгі мәтін',socialTitle:'QR тақырыбы',socialText:'Байланыс сипаттамасы'}
const colorLabels:Record<string,string>={'navy-950':'Қою фон / мәзір','navy-900':'Негізгі түс','navy-800':'Мәтін / қосымша түс','navy-700':'Сілтемелер','sky-soft':'Бет фоны','sky-line':'Жиектер',gold:'Акцент','gold-light':'Ашық акцент'}
export default function SettingsEditor({value,onChange}:{value?:SiteSettings;onChange:(s:SiteSettings)=>void}){
 const s=value??{};const [slug,setSlug]=useState(directions(s)[0].slug);const d=directions(s).find(x=>x.slug===slug)!;const c=sectionContent(s,slug)!;
 const text=(k:string,v:string)=>onChange({...s,texts:{...s.texts,[k]:v}})
 const dir=(k:string,v:string|string[])=>onChange({...s,directions:{...s.directions,[slug]:{...s.directions?.[slug],[k]:v}}})
 const theme=(k:string,v:string)=>onChange({...s,theme:{...s.theme,[k]:v}})
 const move=(i:number,delta:number)=>{const a=menu(s).map(n=>({...n}));const j=i+delta;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];onChange({...s,menu:a})}
 const editMenu=(i:number,p:{label?:string;hidden?:boolean})=>onChange({...s,menu:menu(s).map((n,j)=>j===i?{...n,...p}:n)})
 return <div className="space-y-5">
 <p className="text-sm">Өзгерістерді енгізіп, жоғарыдағы «Жариялау» батырмасын басыңыз. Бет атаулары, мәзір, түстер мен мәтіндер сайтта жаңарады.</p>
 <details open className="space-y-3 rounded-2xl border border-sky-line p-4"><summary className="cursor-pointer font-bold">Сайт атауы және негізгі мәтіндер</summary>
 {Object.entries(TEXTS).filter(([k])=>!k.includes('.')).map(([k,f])=><label key={k} className="block space-y-1"><span className="text-sm font-semibold">{labels[k]??(k.startsWith('tile')?`Басты бет карточкасы ${k.slice(-1)}`:k.startsWith('outcome')?`Нәтиже ${k[7]} — ${k.endsWith('Title')?'атауы':'мәтіні'}`:k)}</span><textarea className={input} rows={k==='aboutText'?5:2} value={txt(s,k,f)} onChange={e=>text(k,e.target.value)}/></label>)}
 </details>
 <details className="space-y-3 rounded-2xl border border-sky-line p-4"><summary className="cursor-pointer font-bold">Мәзір және бөлімдердің реті</summary>
 {menu(s).map((n,i)=><div key={n.id} className="space-y-2 rounded-xl border border-sky-line p-3"><label className="block text-sm">Мәзір атауы<input className={input} value={n.label} onChange={e=>editMenu(i,{label:e.target.value})}/></label><div className="flex flex-wrap items-center gap-2"><button className={button} disabled={!i} onClick={()=>move(i,-1)}>↑</button><button className={button} disabled={i===menu(s).length-1} onClick={()=>move(i,1)}>↓</button><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!n.hidden} onChange={e=>editMenu(i,{hidden:!e.target.checked})}/>Мәзірде көрсету</label></div><label className="block text-sm">Бөлім тақырыбы<input className={input} value={txt(s,`section.${n.id}`)} onChange={e=>text(`section.${n.id}`,e.target.value)}/></label><label className="block text-sm">Шағын тақырып<input className={input} value={txt(s,`eyebrow.${n.id}`)} onChange={e=>text(`eyebrow.${n.id}`,e.target.value)}/></label></div>)}
 </details>
 <details className="space-y-3 rounded-2xl border border-sky-line p-4"><summary className="cursor-pointer font-bold">Алты бағыттың мазмұны мен дизайны</summary>
 <select className={input} value={slug} onChange={e=>setSlug(e.target.value)}>{directions(s).map(x=><option key={x.slug} value={x.slug}>{x.title}</option>)}</select>
 {([['title','Атауы',d.title],['letter','Әріп',d.letter],['short','Қысқа сипаттама',d.short],['purpose','Мақсаты',c.purpose],['explanation','Түсіндірме',c.explanation],['categories','Мазмұн бағыттары (әр жолда біреу)',c.categories],['methods','Әдістер (әр жолда біреу)',c.methods],['tips','Ұсыныстар (әр жолда біреу)',c.tips]] as const).map(([k,l,v])=><label key={k} className="block text-sm font-semibold">{l}<textarea className={input} rows={k==='letter'?1:3} value={typeof v==='string'?v:v.join('\n')} onChange={e=>dir(k,typeof v==='string'?e.target.value:e.target.value.split('\n'))}/></label>)}
 <label className="flex items-center gap-3 text-sm">Бөлім түсі<input type="color" value={c.accent} onChange={e=>dir('accent',e.target.value)}/></label>
 {Object.keys(TEXTS).filter(k=>k.startsWith('block.')).map(k=><label key={k} className="block text-sm">Барлық бағыттар: {TEXTS[k]}<input className={input} value={txt(s,k)} onChange={e=>text(k,e.target.value)}/></label>)}
 </details>
 <details open className="space-y-3 rounded-2xl border border-sky-line p-4"><summary className="cursor-pointer font-bold">Дизайн және түстер</summary>
 <div className="grid gap-3 sm:grid-cols-2">{Object.entries(COLORS).map(([k,v])=><label key={k} className="flex items-center justify-between gap-2 text-sm">{colorLabels[k]}<input type="color" value={s.theme?.[k]??v} onChange={e=>theme(k,e.target.value)}/></label>)}</div>
 <label className="block text-sm">Қаріп<select className={input} value={s.theme?.font??'default'} onChange={e=>theme('font',e.target.value)}><option value="default">Inter</option><option value="system">System</option><option value="serif">Georgia</option></select></label>
 <label className="block text-sm">Карточка пішіні<select className={input} value={s.theme?.radius??'default'} onChange={e=>theme('radius',e.target.value)}><option value="default">Стандарт</option><option value="square">Тік бұрыш</option><option value="round">Дөңгелек</option></select></label>
 <div className="site-shell overflow-hidden rounded-xl border border-sky-line" style={themeStyle(s) as CSSProperties}><div className="bg-navy-950 p-4 text-gold-light font-bold">{txt(s,'brand')}</div><div className="bg-sky-soft p-4 text-navy-900"><div className="rounded-3xl border border-sky-line bg-white p-5"><h3 className="text-xl font-bold">{txt(s,'projectTitle')}</h3><p className="my-3">{txt(s,'slogan')}</p><span className="inline-block rounded-full bg-gold px-4 py-2 text-navy-950">{txt(s,'modelButton')}</span></div></div></div>
 <button className={button} onClick={()=>onChange({...s,theme:{}})}>Бастапқы дизайнды қайтару</button>
 </details>
 <button className={button} onClick={()=>{if(confirm('Барлық сайт баптауларын бастапқы күйге қайтарамыз ба?'))onChange({})}}>Барлық баптауларды қалпына келтіру</button>
 </div>
}
