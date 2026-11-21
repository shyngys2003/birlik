import { AUTHOR, DIRECTIONS, NAV, PROJECT_TITLE, SLOGAN } from './data'
import { CONTENT, type SectionContent } from './content'
export interface SiteSettings {
  texts?: Record<string,string>
  menu?: {id:string; label:string; hidden?:boolean}[]
  directions?: Record<string, Partial<SectionContent> & {title?:string;letter?:string;short?:string}>
  theme?: Record<string,string>
}
export const TEXTS: Record<string,string> = {
  brand:'БІРЛІК', logo:'Б', projectTitle:PROJECT_TITLE, slogan:SLOGAN,
  authorName:AUTHOR.name, authorRole:AUTHOR.role, school:AUTHOR.school,
  badge:'Педагогикалық идеялар фестиваліне', modelButton:'Модельмен танысу', aboutButton:'Жоба туралы',
  heroNote:'Бірлік – бақыттың бастауы!', heroLike:'LIKE',
  aboutText:'«БІРЛІК» моделі — сынып жетекшілеріне ұйымшыл, бір-бірін қолдайтын сынып ұжымын құруға көмектесетін алты өзара байланысты тәрбиелік бағыттан тұрады. Бұл платформа — жобаның әдістемелік материалдарын және нақты сынып тәжірибесін бір жерге жинайтын цифрлық кеңістік.',
  'tile1':'Ұйымшылдық пен достық','tile2':'Тәрбиелік мәні','tile3':'Жаңашыл әдіс-тәсілдер','tile4':'Жетістікке бірге!',
  'outcome1Title':'Тәрбиелік нәтиже','outcome1Text':'Достық, бірлік, жанашырлық, ынтымақтастық және жауапкершілік қасиеттерін қалыптастыру.',
  'outcome2Title':'Әдістемелік нәтиже','outcome2Text':'Басқа сынып жетекшілеріне арналған практикалық ресурстар мен дайын материалдар.',
  'outcome3Title':'Цифрлық нәтиже','outcome3Text':'Нақты сынып іс-шараларының, жетістіктердің, фото және бейнематериалдардың онлайн портфолиосы.',
  footer:'Барлық құқықтар қорғалған', socialTitle:'QR-код орны', socialText:'Әлеуметтік желідегі парақшаның QR-коды мен сілтемесі кейінірек қойылады.',
  ...Object.fromEntries(NAV.map(n=>[`eyebrow.${n.id}`,n.label])),
  'section.about':'Жоба туралы','section.author':'Жоба авторы','section.model':'БІРЛІК — алты қадам','section.resources':'Сынып жетекшілеріне арналған ресурстар','section.achievements':'Оқушылар жетістіктері','section.social':'Әлеуметтік желілер',
  'eyebrow.about':'Таныстыру','eyebrow.model':'Модель',
  'block.1':'Тәрбиелік мақсаты','block.2':'Қысқаша түсініктеме','block.5':'Фото және бейне галерея','block.7':'Сынып жетекшілеріне практикалық ұсыныстар',
}
export const COLORS:Record<string,string>={ 'navy-950':'#071536','navy-900':'#0B1F4B','navy-800':'#12306B','navy-700':'#1B4290','sky-soft':'#EAF1FB','sky-line':'#D3E1F5',gold:'#C9A24B','gold-light':'#E8D39A' }
export const txt=(s:SiteSettings|undefined,k:string,fallback=TEXTS[k]??'')=>s?.texts?.[k]??fallback
export function menu(s?:SiteSettings){return s?.menu??NAV.map(n=>({...n,hidden:false}))}
export function directions(s?:SiteSettings){return DIRECTIONS.map(d=>{const o=s?.directions?.[d.slug];return {...d,title:o?.title??d.title,letter:o?.letter??d.letter,short:o?.short??d.short}})}
export function sectionContent(s:SiteSettings|undefined,slug:string){return CONTENT[slug]?{...CONTENT[slug],...s?.directions?.[slug]}:undefined}
export function themeStyle(s?:SiteSettings){const result:Record<string,string>={};for(const [k,v] of Object.entries(COLORS)){const c=s?.theme?.[k]??v;const safe=/^#[0-9a-f]{6}$/i.test(c)?c:v;result[`--${k}`]=[1,3,5].map(i=>parseInt(safe.slice(i,i+2),16)).join(' ')};result['--site-radius']=s?.theme?.radius==='square'?'4px':s?.theme?.radius==='round'?'32px':'24px';result['--site-font']=s?.theme?.font==='serif'?'Georgia, serif':s?.theme?.font==='system'?'system-ui, sans-serif':'Inter, system-ui, sans-serif';return result}
