import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getOpportunites, createOpportunite } from '../services/opportunites'
import { getEntreprises } from '../services/entreprises'
import OpportuniteForm from '../components/opportunites/OpportuniteForm'
import type { Opportunite, Entreprise, StatutOpportunite, OpportuniteInsert } from '../types'

type SortKey = 'titre' | 'entreprise' | 'montant' | 'statut' | 'probabilite' | 'date_cloture_prevue'
type SortDir = 'asc' | 'desc'

const statutLabels: Record<StatutOpportunite, string> = {
  prospection: 'Prospection',
  qualification: 'Qualification',
  proposition: 'Proposition',
  negociation: 'Négociation',
  gagne: 'Gagné',
  perdu: 'Perdu',
}

const statutColors: Record<StatutOpportunite, string> = {
  prospection: 'bg-gray-100 text-gray-700',
  qualification: 'bg-blue-100 text-blue-700',
  proposition: 'bg-indigo-100 text-indigo-700',
  negociation: 'bg-amber-100 text-amber-700',
  gagne: 'bg-green-100 text-green-700',
  perdu: 'bg-red-100 text-red-700',
}

const allStatuts: StatutOpportunite[] = [
  'prospection',
  'qualification',
  'proposition',
  'negociation',
  'gagne',
  'perdu',
]

function formatMontant(value: number | null): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR')
}

export default function OpportunitesPage() {
  const [opportunites, setOpportunites] = useState<Opportunite[]>([])
  const [entreprises, setEntreprises] = useState<Map<string, Entreprise>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statutFilter, setStatutFilter] = useState<StatutOpportunite | ''>('')
  const [sortKey, setSortKey] = useState<SortKey>('titre')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [showForm, setShowForm] = useState(false)

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

  async function handleCreate(data: OpportuniteInsert) {
    const created = await createOpportunite(data)
    setOpportunites((prev) => [created, ...prev])
    setShowForm(false)
  }

  function entrepriseName(id: string): string {
    return entreprises.get(id)?.nom ?? ''
  }

  const filtered = useMemo(() => {
    let list = opportunites

    // Filtre par statut
    if (statutFilter) {
      list = list.filter((o) => o.statut === statutFilter)
    }

    // Filtre par recherche (titre ou entreprise)
    const q = search.toLowerCase().trim()
    if (q) {
      list = list.filter(
        (o) =>
          o.titre.toLowerCase().includes(q) ||
          entrepriseName(o.entreprise_id).toLowerCase().includes(q),
      )
    }

    return list
  }, [opportunites, search, statutFilter, entreprises])

  const sorted = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      let va: string | number | null
      let vb: string | number | null

      if (sortKey === 'entreprise') {
        va = entrepriseName(a.entreprise_id)
        vb = entrepriseName(b.entreprise_id)
      } else {
        va = a[sortKey]
        vb = b[sortKey]
      }

      if (va == null && vb == null) return 0
      if (va == null) return 1
      if (vb == null) return -1

      if (typeof va === 'string' && typeof vb === 'string') {
        const cmp = va.localeCompare(vb, 'fr')
        return sortDir === 'asc' ? cmp : -cmp
      }

      return sortDir === 'asc'
        ? (va as number) - (vb as number)
        : (vb as number) - (va as number)
    })
    return list
  }, [filtered, sortKey, sortDir, entreprises])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function SortIndicator({ column }: { column: SortKey }) {
    if (sortKey !== column) return <span className="ml-1 text-gray-300">&udarr;</span>
    return <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunités</h1>
          <p className="mt-1 text-sm text-gray-600">
            {loading ? 'Chargement…' : `${sorted.length} opportunité${sorted.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nouvelle opportunité
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Recherche + filtre statut */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher par titre ou entreprise…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value as StatutOpportunite | '')}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          {allStatuts.map((s) => (
            <option key={s} value={s}>
              {statutLabels[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      {!loading && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th column="titre" label="Titre" toggleSort={toggleSort} indicator={<SortIndicator column="titre" />} />
                <Th column="entreprise" label="Entreprise" toggleSort={toggleSort} indicator={<SortIndicator column="entreprise" />} />
                <Th column="montant" label="Montant" toggleSort={toggleSort} indicator={<SortIndicator column="montant" />} />
                <Th column="statut" label="Statut" toggleSort={toggleSort} indicator={<SortIndicator column="statut" />} />
                <Th column="probabilite" label="Probabilité" toggleSort={toggleSort} indicator={<SortIndicator column="probabilite" />} />
                <Th column="date_cloture_prevue" label="Clôture prévue" toggleSort={toggleSort} indicator={<SortIndicator column="date_cloture_prevue" />} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    {search || statutFilter
                      ? 'Aucune opportunité ne correspond aux critères.'
                      : 'Aucune opportunité.'}
                  </td>
                </tr>
              ) : (
                sorted.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Link
                        to={`/opportunites/${o.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {o.titre}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      <Link
                        to={`/entreprises/${o.entreprise_id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {entrepriseName(o.entreprise_id)}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right text-gray-700 tabular-nums">
                      {formatMontant(o.montant)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statutColors[o.statut]}`}>
                        {statutLabels[o.statut]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right text-gray-700 tabular-nums">
                      {o.probabilite != null ? `${o.probabilite} %` : '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatDate(o.date_cloture_prevue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

      {/* Modale de création */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Nouvelle opportunité</h2>
            <OpportuniteForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              submitLabel="Créer"
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Th (sortable column header) ── */

function Th({
  column,
  label,
  toggleSort,
  indicator,
}: {
  column: SortKey
  label: string
  toggleSort: (key: SortKey) => void
  indicator: React.ReactNode
}) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer select-none hover:text-gray-900"
      onClick={() => toggleSort(column)}
    >
      {label}
      {indicator}
    </th>
  )
}
