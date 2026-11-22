export const EVENT_CATEGORIES = [
  { id: 'class-events', title: 'Сыныптағы іс-шаралар' },
  { id: 'class-hours', title: 'Сынып сағаттары' },
  { id: 'parent-meetings', title: 'Ата-аналар жиналысы' },
] as const
export type EventCategory = typeof EVENT_CATEGORIES[number]['id']
