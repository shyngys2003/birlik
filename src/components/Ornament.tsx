export default function Ornament({ className = '' }: { className?: string }) {
  return <div className={`ornament w-full ${className}`} aria-hidden="true" />
}
