import { HeartHandshake, Sprout, UserCheck, ThumbsUp, Handshake, MessagesSquare, type LucideIcon } from 'lucide-react'

export const PROJECT_TITLE = '«Дос бол LIKE» жобасы негізіндегі «БІРЛІК» моделі'
export const SLOGAN = 'Бір мақсат. Бір команда. Бірлікке бастар алты қадам!'
export const AUTHOR = {
  name: 'Каниева Макпал Қадірбековна',
  role: 'Қазақ тілі мен әдебиеті пәнінің мұғалімі, сынып жетекшісі',
  school: 'Абай облысы, Аякөз ауданы, №11 орта мектеп',
}

export interface Direction {
  slug: string; letter: string; title: string; short: string; icon: LucideIcon
}

export const DIRECTIONS: Direction[] = [
  { slug: 'beyimdelu', letter: 'Б', title: 'Бейімделу', icon: Sprout,
    short: 'Оқушының сынып ұжымына, мектеп ортасына жайлы және сенімді бейімделуіне бағытталған қадам.' },
  { slug: 'izgilik', letter: 'І', title: 'Ізгілік', icon: HeartHandshake,
    short: 'Мейірімділік, жанашырлық және бір-біріне көмектесу құндылықтарын қалыптастыру.' },
  { slug: 'rol-jauapkershilik', letter: 'Р', title: 'Рөл мен жауапкершілік', icon: UserCheck,
    short: 'Әр оқушының сынып өмірінде өз рөлін түсініп, жауапкершілікті сезінуі.' },
  { slug: 'laik', letter: 'Л', title: 'Лайк арқылы қолдау', icon: ThumbsUp,
    short: 'Бір-бірін мойындау, мақтау және ізгі пікірмен қолдау мәдениеті.' },
  { slug: 'iltipat', letter: 'І', title: 'Ілтипат', icon: Handshake,
    short: 'Құрмет, сыпайылық және өзгенің пікіріне ілтипатпен қарау дағдысы.' },
  { slug: 'keri-baylanys', letter: 'К', title: 'Кері байланыс және қорытынды', icon: MessagesSquare,
    short: 'Атқарылған жұмысты талдау, пікір алмасу және қорытынды шығару.' },
]

export const NAV = [
  { id: 'about', label: 'Жоба туралы' },
  { id: 'author', label: 'Автор' },
  { id: 'model', label: 'БІРЛІК моделі' },
  { id: 'practice', label: 'Тәжірибе' },
  { id: 'resources', label: 'Әдіскерлерге' },
  { id: 'achievements', label: 'Жетістіктер' },
  { id: 'social', label: 'Байланыс' },
]
