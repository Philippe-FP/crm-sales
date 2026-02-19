import { useMemo } from 'react'
import { updateActivite } from '../../services/activites'
import type { Activite, TypeActivite } from '../../types'

const typeLabels: Record<TypeActivite, string> = {
  appel: 'Appel',
  email: 'Email',
  reunion: 'Réunion',
  note: 'Note',
  tache: 'Tâche',
}

const typeIcons: Record<TypeActivite, string> = {
  appel: '📞',
  email: '✉️',
  reunion: '🤝',
  note: '📝',
  tache: '✅',
}

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR')
}

interface TimelineProps {
  activites: Activite[]
  onActiviteUpdated?: (updated: Activite) => void
}

export default function Timeline({ activites, onActiviteUpdated }: TimelineProps) {
  // Tri chronologique inverse (plus récentes en premier)
  const sorted = useMemo(() => {
    return [...activites].sort((a, b) => {
      const da = a.date_echeance ?? a.created_at
      const db = b.date_echeance ?? b.created_at
      return db.localeCompare(da)
    })
  }, [activites])

  async function toggleFait(activite: Activite) {
    const updated = await updateActivite(activite.id, { est_fait: !activite.est_fait })
    onActiviteUpdated?.(updated)
  }

  if (sorted.length === 0) {
    return <p className="text-sm text-gray-500 py-4">Aucune activité.</p>
  }

  return (
    <div className="space-y-3">
      {sorted.map((a) => (
        <div
          key={a.id}
          className={`rounded-lg border p-4 ${a.est_fait ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'}`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFait(a)}
              title={a.est_fait ? 'Marquer à faire' : 'Marquer comme fait'}
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border text-xs transition-colors ${
                a.est_fait
                  ? 'border-green-300 bg-green-100 text-green-600 hover:bg-green-200'
                  : 'border-gray-300 bg-white text-transparent hover:border-green-400 hover:text-green-400'
              }`}
            >
              ✓
            </button>
            <span className="mr-0.5" title={typeLabels[a.type]}>{typeIcons[a.type]}</span>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              a.est_fait ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {typeLabels[a.type]}
            </span>
            <span className={`text-sm font-medium ${a.est_fait ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {a.sujet}
            </span>
            {a.date_echeance && (
              <span className="ml-auto text-xs text-gray-500">{formatDate(a.date_echeance)}</span>
            )}
          </div>
          {a.description && <p className="mt-2 ml-8 text-sm text-gray-600">{a.description}</p>}
        </div>
      ))}
    </div>
  )
}
