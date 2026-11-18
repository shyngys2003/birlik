import { ImagePlus, type LucideIcon } from 'lucide-react'

interface Props { label: string; hint?: string; icon?: LucideIcon; className?: string }

export default function Placeholder({ label, hint = 'Мазмұн кейінірек жүктеледі', icon: Icon = ImagePlus, className = '' }: Props) {
  return (
    <div role="img" aria-label={`Орын: ${label}`}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-navy-700/30 bg-white/60 p-6 text-center ${className}`}>
      <Icon className="h-7 w-7 text-gold" aria-hidden="true" />
      <p className="font-semibold text-navy-800">{label}</p>
      <p className="text-xs text-navy-700/70">{hint}</p>
    </div>
  )
}
