import { useEffect, useState } from 'react'
import { getOpportunites, updateOpportunite } from '../services/opportunites'
import { getEntreprises } from '../services/entreprises'
import PipelineBoard from '../components/opportunites/PipelineBoard'
import type { Opportunite, Entreprise, StatutOpportunite } from '../types'

export default function PipelinePage() {
  const [opportunites, setOpportunites] = useState<Opportunite[]>([])
  const [entreprises, setEntreprises] = useState<Map<string, Entreprise>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [opps, ents] = await Promise.all([getOpportunites(), getEntreprises()])
        if (!cancelled) {
          setOpportunites(opps)
          setEntreprises(new Map(ents.map((e) => [e.id, e])))
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function handleStatutChange(id: string, newStatut: StatutOpportunite) {
    // Règle 5.3 : gagne/perdu => date_cloture_reelle = aujourd'hui
    // Retour à un statut antérieur => effacer date_cloture_reelle
    let dateCloture: string | null
    if (newStatut === 'gagne' || newStatut === 'perdu') {
      dateCloture = new Date().toISOString().split('T')[0]
    } else {
      dateCloture = null
    }

    // Mise à jour optimiste
    setOpportunites((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, statut: newStatut, date_cloture_reelle: dateCloture } : o,
      ),
    )

    try {
      await updateOpportunite(id, {
        statut: newStatut,
        date_cloture_reelle: dateCloture,
      })
    } catch (err) {
      // Rollback en cas d'erreur : recharger les données
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de statut')
      const opps = await getOpportunites()
      setOpportunites(opps)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
      <p className="mt-1 text-sm text-gray-600">
        {loading ? 'Chargement…' : `${opportunites.length} opportunité${opportunites.length > 1 ? 's' : ''}`}
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Chargement…
        </div>
      )}

      {!loading && (
        <div className="mt-6">
          <PipelineBoard
            opportunites={opportunites}
            entreprises={entreprises}
            onStatutChange={handleStatutChange}
          />
        </div>
      )}
    </div>
  )
}
