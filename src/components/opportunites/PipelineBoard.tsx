import { useState } from 'react'
import OpportuniteCard from './OpportuniteCard'
import type { Opportunite, Entreprise, StatutOpportunite } from '../../types'

const columns: { statut: StatutOpportunite; label: string; color: string }[] = [
  { statut: 'prospection', label: 'Prospection', color: 'bg-gray-500' },
  { statut: 'qualification', label: 'Qualification', color: 'bg-blue-500' },
  { statut: 'proposition', label: 'Proposition', color: 'bg-indigo-500' },
  { statut: 'negociation', label: 'Négociation', color: 'bg-amber-500' },
  { statut: 'gagne', label: 'Gagné', color: 'bg-green-500' },
  { statut: 'perdu', label: 'Perdu', color: 'bg-red-500' },
]

function formatMontant(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

interface PipelineBoardProps {
  opportunites: Opportunite[]
  entreprises: Map<string, Entreprise>
  onStatutChange: (id: string, newStatut: StatutOpportunite) => Promise<void>
}

export default function PipelineBoard({ opportunites, entreprises, onStatutChange }: PipelineBoardProps) {
  const [dragOverStatut, setDragOverStatut] = useState<StatutOpportunite | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(id)
  }

  function handleDragOver(e: React.DragEvent, statut: StatutOpportunite) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStatut(statut)
  }

  function handleDragLeave() {
    setDragOverStatut(null)
  }

  async function handleDrop(e: React.DragEvent, statut: StatutOpportunite) {
    e.preventDefault()
    setDragOverStatut(null)
    setDraggingId(null)
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return

    const opp = opportunites.find((o) => o.id === id)
    if (!opp || opp.statut === statut) return

    await onStatutChange(id, statut)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const colOpps = opportunites.filter((o) => o.statut === col.statut)
        const total = colOpps.reduce((sum, o) => sum + (o.montant ?? 0), 0)
        const isDragOver = dragOverStatut === col.statut

        return (
          <div
            key={col.statut}
            onDragOver={(e) => handleDragOver(e, col.statut)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.statut)}
            className={`flex-shrink-0 w-64 rounded-lg border-2 transition-colors ${
              isDragOver ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            {/* Header */}
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold text-gray-900">{col.label}</span>
                <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                  {colOpps.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2 min-h-[120px]">
              {colOpps.map((o) => (
                <div key={o.id} className={draggingId === o.id ? 'opacity-40' : ''}>
                  <OpportuniteCard
                    opportunite={o}
                    entrepriseNom={entreprises.get(o.entreprise_id)?.nom ?? ''}
                    onDragStart={handleDragStart}
                  />
                </div>
              ))}
            </div>

            {/* Footer: total */}
            <div className="border-t border-gray-200 px-3 py-2">
              <p className="text-xs text-gray-500 tabular-nums">
                {formatMontant(total)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
