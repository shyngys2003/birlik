import type { EventCategory } from './event-categories'
import type { BuilderData } from './builder'
import type { SiteSettings } from './site-settings'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface Media { src: string; caption?: string }
export interface VideoItem { url: string; caption?: string }
export interface Resource { title: string; file: string }
export const HOME_RESOURCE_GROUPS = [
  { id: 'guide', title: 'Әдістемелік көмек' },
  { id: 'scenarios', title: 'Сынып сағаттарының жоспарлары' },
  { id: 'worksheets', title: 'Сыныптан тыс іс-шаралардың жоспарлары' },
] as const
export type HomeResourceGroup = typeof HOME_RESOURCE_GROUPS[number]['id']
export interface StepData {
  experience?: string; whenWhere?: string; results?: string
  photos?: Media[]; videos?: VideoItem[]; evidence?: Media[]; resources?: Resource[]
}
export const ACHIEVEMENT_YEARS = ['2025-2026', '2026-2027'] as const
export type AchievementYear = typeof ACHIEVEMENT_YEARS[number]
export interface Achievement { year?: AchievementYear; title: string; text?: string; photo?: string }
export const achievementYear = (a: Achievement): AchievementYear => a.year === '2026-2027' ? '2026-2027' : '2025-2026'
export interface SchoolEvent { id: string; title: string; date?: string; description?: string; photos: Media[]; videos: VideoItem[]; files: Resource[] }
export interface SiteContent {
  events?: Partial<Record<EventCategory, SchoolEvent[]>>
  builder?: BuilderData
  settings?: SiteSettings
  site: { schoolEmblem?: string; logoPhoto?: string; heroPhoto?: string; authorPhoto?: string; authorBio?: string; socialUrl?: string; socialQr?: string; resources?: Partial<Record<HomeResourceGroup, Resource[]>> }
  steps: Record<string, StepData>
  achievements: Achievement[]
}

export const EMPTY: SiteContent = { site: {}, steps: {}, achievements: [] }

export function normalize(j: Partial<SiteContent> | null | undefined): SiteContent {
  return { events: j?.events ?? {}, builder: j?.builder, settings: j?.settings, site: j?.site ?? {}, steps: j?.steps ?? {}, achievements: j?.achievements ?? [] }
}

const Ctx = createContext<SiteContent>(EMPTY)
export const useContent = () => ({ content: useContext(Ctx) })

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(EMPTY)
  useEffect(() => {
    fetch(`content.json?v=${Date.now()}`)
      .then(r => (r.ok ? r.json() : null))
      .then(j => setContent(normalize(j)))
      .catch(() => undefined)
  }, [])
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}
