import type { BuilderData } from './builder'
import type { SiteSettings } from './site-settings'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface Media { src: string; caption?: string }
export interface VideoItem { url: string; caption?: string }
export interface Resource { title: string; file: string }
export interface StepData {
  experience?: string; whenWhere?: string; results?: string
  photos?: Media[]; videos?: VideoItem[]; evidence?: Media[]; resources?: Resource[]
}
export interface Achievement { title: string; text?: string; photo?: string }
export interface SiteContent {
  builder?: BuilderData
  settings?: SiteSettings
  site: { logoPhoto?: string; heroPhoto?: string; authorPhoto?: string; authorBio?: string; socialUrl?: string; socialQr?: string }
  steps: Record<string, StepData>
  achievements: Achievement[]
}

export const EMPTY: SiteContent = { site: {}, steps: {}, achievements: [] }

export function normalize(j: Partial<SiteContent> | null | undefined): SiteContent {
  return { builder: j?.builder, settings: j?.settings, site: j?.site ?? {}, steps: j?.steps ?? {}, achievements: j?.achievements ?? [] }
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
