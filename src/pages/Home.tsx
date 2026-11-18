import { Camera, Video, MessageSquareQuote, FileText, Download, Trophy, QrCode, Share2, Users, Target, Laptop } from 'lucide-react'
import Section from '../components/Section'
import Hero from '../components/Hero'
import Placeholder from '../components/Placeholder'
import DirectionCard from '../components/DirectionCard'
import { AUTHOR, DIRECTIONS } from '../data'

const OUTCOMES = [
  { icon: Users, title: 'Тәрбиелік нәтиже', text: 'Достық, бірлік, жанашырлық, ынтымақтастық және жауапкершілік қасиеттерін қалыптастыру.' },
  { icon: Target, title: 'Әдістемелік нәтиже', text: 'Басқа сынып жетекшілеріне арналған практикалық ресурстар мен дайын материалдар.' },
  { icon: Laptop, title: 'Цифрлық нәтиже', text: 'Нақты сынып іс-шараларының, жетістіктердің, фото және бейнематериалдардың онлайн портфолиосы.' },
]

export default function Home() {
  return (
    <>
      <Hero />

      <Section id="about" eyebrow="Таныстыру" title="Жоба туралы">
        <p className="max-w-3xl text-lg leading-relaxed text-navy-800">
          «БІРЛІК» моделі — сынып жетекшілеріне ұйымшыл, бір-бірін қолдайтын сынып ұжымын құруға көмектесетін алты өзара байланысты тәрбиелік бағыттан тұрады. Бұл платформа — жобаның әдістемелік материалдарын және нақты сынып тәжірибесін бір жерге жинайтын цифрлық кеңістік.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {OUTCOMES.map(o => (
            <div key={o.title} className="rounded-3xl border border-sky-line bg-white p-6 shadow-card">
              <o.icon className="h-8 w-8 text-gold" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-800/80">{o.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="author" eyebrow="Автор" title="Жоба авторы" tone="white">
        <div className="grid items-center gap-8 md:grid-cols-[240px_1fr]">
          <Placeholder label="Автордың фотосы" hint="Фото кейінірек жүктеледі" className="aspect-[3/4]" />
          <div>
            <h3 className="font-serif text-2xl font-bold">{AUTHOR.name}</h3>
            <p className="mt-2 font-medium text-navy-700">{AUTHOR.role}</p>
            <p className="mt-1 text-navy-800/80">{AUTHOR.school}</p>
            <Placeholder label="Автор туралы қысқаша мәлімет" hint="Мәтін кейінірек толтырылады" icon={FileText} className="mt-6" />
          </div>
        </div>
      </Section>

      <Section id="model" eyebrow="Модель" title="БІРЛІК — алты қадам">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIRECTIONS.map((d, i) => <DirectionCard key={d.slug} d={d} index={i} />)}
        </div>
      </Section>

      <Section id="practice" eyebrow="Тәжірибе" title="Сыныптағы нақты тәжірибе" tone="white">
        <div className="grid gap-5 md:grid-cols-3">
          <Placeholder label="Фотогалерея" icon={Camera} className="min-h-48" />
          <Placeholder label="Бейнематериалдар" icon={Video} className="min-h-48" />
          <Placeholder label="Оқушылар мен ата-аналардың пікірлері" icon={MessageSquareQuote} className="min-h-48" />
        </div>
      </Section>

      <Section id="resources" eyebrow="Әдіскерлерге" title="Сынып жетекшілеріне арналған ресурстар">
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
      </Section>

      <Section id="achievements" eyebrow="Жетістіктер" title="Оқушылар жетістіктері" tone="white">
        <div className="grid gap-5 sm:grid-cols-3">
          {[1, 2, 3].map(n => <Placeholder key={n} label={`Жетістік карточкасы ${n}`} hint="Нақты деректер кейінірек қосылады" icon={Trophy} className="min-h-40" />)}
        </div>
      </Section>

      <Section id="social" eyebrow="Байланыс" title="Әлеуметтік желілер">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-navy-900 p-8 text-white sm:flex-row">
          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-gold bg-white/10" role="img" aria-label="QR-код орны">
            <QrCode className="h-16 w-16 text-gold" aria-hidden="true" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-gold-light">QR-код орны</h3>
            <p className="mt-2 text-white/80">Әлеуметтік желідегі парақшаның QR-коды мен сілтемесі кейінірек қойылады.</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/60"><Share2 className="h-4 w-4" aria-hidden="true" /> Сілтеме: —</p>
          </div>
        </div>
      </Section>
    </>
  )
}
