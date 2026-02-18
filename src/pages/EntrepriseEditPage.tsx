import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import EntrepriseForm from '../components/entreprises/EntrepriseForm'
import { getEntrepriseById, updateEntreprise } from '../services/entreprises'
import type { Entreprise, EntrepriseInsert } from '../types'

export default function EntrepriseEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        const data = await getEntrepriseById(id!)
        if (!cancelled) setEntreprise(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  async function handleSubmit(data: EntrepriseInsert) {
    await updateEntreprise(id!, data)
    navigate(`/entreprises/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-12">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Chargement…
      </div>
    )
  }

  if (error || !entreprise) {
    return (
      <div>
        <Link to="/entreprises" className="text-sm text-blue-600 hover:text-blue-800">&larr; Retour aux entreprises</Link>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error ?? 'Entreprise introuvable.'}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link to={`/entreprises/${id}`} className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Retour à la fiche
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Modifier {entreprise.nom}</h1>
      <div className="mt-6">
        <EntrepriseForm
          initial={entreprise}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/entreprises/${id}`)}
          submitLabel="Enregistrer"
        />
      </div>
    </div>
  )
}
