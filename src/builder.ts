export type BlockKind = 'text' | 'image' | 'video' | 'link' | 'file' | 'quote' | 'divider'
export interface BuilderBlock { id: string; kind: BlockKind; title: string; text: string; url: string; align: 'left' | 'center' | 'right'; tone: 'white' | 'soft' | 'dark'; width: 'full' | 'normal' | 'narrow'; hidden?: boolean }
export interface BuilderPage { id: string; title: string; description: string; inMenu: boolean; hidden?: boolean; blocks: BuilderBlock[] }
export interface BuilderData { pages: BuilderPage[]; extras: Record<string, BuilderBlock[]> }
export const blankBuilder = (): BuilderData => ({pages: [], extras: {}})
export const uid = () => crypto.randomUUID()
export const kinds: Record<BlockKind,string> = {text:'Мәтін', image:'Сурет', video:'YouTube', link:'Батырма / сілтеме', file:'Құжат', quote:'Дәйексөз', divider:'Бөлгіш'}
export const newBlock = (kind: BlockKind): BuilderBlock => ({id:uid(),kind,title:'',text:'',url:'',align:'left',tone:'white',width:'normal'})
export function move<T>(items:T[], from:number, to:number):T[] {const a=[...items]; if(from<0||to<0||from>=a.length||to>=a.length)return a; a.splice(to,0,...a.splice(from,1)); return a}
export function safeUrl(raw:string, uploads=false):string {if(uploads && /^uploads\/[a-zA-Z0-9._/-]+$/.test(raw) && !raw.includes('..'))return `./${raw}`; try {const u=new URL(raw); return u.protocol==='https:'||u.protocol==='http:'?u.href:''}catch{return ''}}
export function youtube(raw:string):string {try{const u=new URL(raw); if(u.protocol!=='https:' && u.protocol!=='http:')return ''; const host=u.hostname.toLowerCase(); const id=host==='youtu.be'?u.pathname.split('/')[1]:['youtube.com','www.youtube.com','m.youtube.com'].includes(host)?(u.searchParams.get('v')||(/^\/(embed|shorts)\//.test(u.pathname)?u.pathname.split('/')[2]:'')):'';return id&&/^[\w-]{11}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}`:''}catch{return ''}}
