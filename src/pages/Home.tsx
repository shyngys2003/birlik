import { txt, directions, menu } from '../site-settings'
import { Camera, Video, MessageSquareQuote, FileText, Download, Trophy, QrCode, Share2, Users, Target, Laptop } from 'lucide-react'
import Section from '../components/Section'
import Hero from '../components/Hero'
import { Achievements } from '../components/ContentBlocks'
import { useContent } from '../content-store'
import Placeholder from '../components/Placeholder'
import DirectionCard from '../components/DirectionCard'
import { AUTHOR, DIRECTIONS } from '../data'

const OUTCOMES = [
  { icon: Users, title: 'Тәрбиелік нәтиже', text: 'Достық, бірлік, жанашырлық, ынтымақтастық және жауапкершілік қасиеттерін қалыптастыру.' },
  { icon: Target, title: 'Әдістемелік нәтиже', text: 'Басқа сынып жетекшілеріне арналған практикалық ресурстар мен дайын материалдар.' },
  { icon: Laptop, title: 'Цифрлық нәтиже', text: 'Нақты сынып іс-шараларының, жетістіктердің, фото және бейнематериалдардың онлайн портфолиосы.' },
]

export default function Home() {
  const { content } = useContent()
  const settings=content.settings
  const sections = [

      <Section key="about" id="about" eyebrow="Таныстыру" title="Жоба туралы">
        <p className="max-w-3xl text-lg leading-relaxed text-navy-800">
          {txt(settings,"aboutText")}
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {OUTCOMES.map((o,i) => (
            <div key={txt(settings,`outcome${i+1}Title`,o.title)} className="rounded-3xl border border-sky-line bg-white p-6 shadow-card">
              <o.icon className="h-8 w-8 text-gold" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold">{txt(settings,`outcome${i+1}Title`,o.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-800/80">{txt(settings,`outcome${i+1}Text`,o.text)}</p>
            </div>
          ))}
        </div>
      </Section>,

      <Section key="author" id="author" eyebrow="Автор" title="Жоба авторы" tone="white">
        <div className="grid items-center gap-8 md:grid-cols-[240px_1fr]">
          {content.site.authorPhoto ? <img src={content.site.authorPhoto} alt="Автордың фотосы" className="aspect-square w-full max-w-[240px] rounded-full border-2 border-gold object-cover shadow-card" /> : <Placeholder label="Автордың фотосы" hint="Фото кейінірек жүктеледі" className="aspect-square w-full max-w-[240px] !rounded-full" />}
          <div>
            <h3 className="font-serif text-2xl font-bold">{txt(settings,"authorName")}</h3>
            <p className="mt-2 font-medium text-navy-700">{txt(settings,"authorRole")}</p>
            <p className="mt-1 text-navy-800/80">{txt(settings,"school")}</p>
            {content.site.authorBio ? <p className="mt-6 whitespace-pre-line leading-relaxed text-navy-800">{content.site.authorBio}</p> : <Placeholder label="Автор туралы қысқаша мәлімет" hint="Мәтін кейінірек толтырылады" icon={FileText} className="mt-6" />}
          </div>
        </div>
      </Section>,

      <Section key="model" id="model" eyebrow="Модель" title="БІРЛІК — алты қадам">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {directions(settings).map((d, i) => <DirectionCard key={d.slug} d={d} index={i} />)}
        </div>
      </Section>,

      <Section key="practice" id="practice" eyebrow="Тәжірибе" title="Сыныптағы нақты тәжірибе" tone="white">
        <div className="grid gap-5 md:grid-cols-3">
          <Placeholder label="Фотогалерея" icon={Camera} className="min-h-48" />
          <Placeholder label="Бейнематериалдар" icon={Video} className="min-h-48" />
          <Placeholder label="Оқушылар мен ата-аналардың пікірлері" icon={MessageSquareQuote} className="min-h-48" />
        </div>
      </Section>,

      <Section key="resources" id="resources" eyebrow="Әдіскерлерге" title="Сынып жетекшілеріне арналған ресурстар">
        <div className="grid gap-5 md:grid-cols-3">
          {['Әдістемелік нұсқаулық', 'Сынып сағаттарының сценарийлері', 'Тапсырма парақтары мен сауалнамалар'].map(t => (
            <div key={t} className="flex flex-col gap-4 rounded-3xl border border-sky-line bg-white p-6 shadow-card">
              <FileText className="h-7 w-7 text-gold" aria-hidden="true" />
              <h3 className="font-bold">{t}</h3>
              <button disabled className="mt-auto inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-sky-soft px-4 py-2 text-sm font-semibold text-navy-700/60">
                <Download className="h-4 w-4" aria-hidden="true" /> Файл кейінірек жүктеледі
              </button>
            </div>
          ))}
        </div>
      </Section>,

      <Section key="achievements" id="achievements" eyebrow="Жетістіктер" title="Оқушылар жетістіктері" tone="white">
        <Achievements items={content.achievements} />
      </Section>,

      <Section key="social" id="social" eyebrow="Байланыс" title="Әлеуметтік желілер">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-navy-900 p-8 text-white sm:flex-row">
          {content.site.socialQr ? (
            <img src={content.site.socialQr} alt="QR-код" className="h-40 w-40 shrink-0 rounded-2xl bg-white p-2" />
          ) : (
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-gold bg-white/10" role="img" aria-label="QR-код орны">
              <QrCode className="h-16 w-16 text-gold" aria-hidden="true" />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-gold-light">{txt(settings,"socialTitle")}</h3>
            <p className="mt-2 text-white/80">{txt(settings,"socialText")}</p>
            {/^https?:\/\//.test(content.site.socialUrl ?? '')
              ? <a href={content.site.socialUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-gold-light underline"><Share2 className="h-4 w-4" aria-hidden="true" /> Парақшаға өту</a>
              : <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/60"><Share2 className="h-4 w-4" aria-hidden="true" /> Сілтеме: —</p>}
          </div>
        </div>
      </Section>,
  ]
  const order=menu(settings).map(n=>n.id)
  return <><Hero />{sections.sort((a,b)=>order.indexOf(a.props.id)-order.indexOf(b.props.id))}</>
}
