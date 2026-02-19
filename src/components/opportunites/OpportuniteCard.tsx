import { Link } from 'react-router-dom'
import type { Opportunite } from '../../types'

function formatMontant(value: number | null): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

interface OpportuniteCardProps {
  opportunite: Opportunite
  entrepriseNom: string
  onDragStart: (e: React.DragEvent, id: string) => void
}

export default function OpportuniteCard({ opportunite, entrepriseNom, onDragStart }: OpportuniteCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, opportunite.id)}
      className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow transition-all"
    >
      <Link
        to={`/opportunites/${opportunite.id}`}
        className="block text-sm font-medium text-blue-600 hover:text-blue-800 truncate"
      >
        {opportunite.titre}
      </Link>
      <p className="mt-1 text-xs text-gray-500 truncate">{entrepriseNom}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900 tabular-nums">
        {formatMontant(opportunite.montant)}
      </p>
    </div>
  )
}
