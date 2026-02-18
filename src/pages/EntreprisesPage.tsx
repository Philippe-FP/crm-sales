import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getEntreprises } from '../services/entreprises'
import type { Entreprise } from '../types'

type SortKey = 'nom' | 'secteur' | 'chiffre_affaires' | 'effectif'
type SortDir = 'asc' | 'desc'

function formatCA(value: number | null): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatEffectif(value: number | null): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('fr-FR').format(value)
}

export default function EntreprisesPage() {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('nom')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getEntreprises()
        if (!cancelled) setEntreprises(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return entreprises
    return entreprises.filter(
      (e) =>
        e.nom.toLowerCase().includes(q) ||
        (e.secteur && e.secteur.toLowerCase().includes(q)) ||
        (e.adresse && e.adresse.toLowerCase().includes(q)),
    )
  }, [entreprises, search])

  const sorted = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (va == null && vb == null) return 0
      if (va == null) return 1
      if (vb == null) return -1
      if (typeof va === 'string' && typeof vb === 'string') {
        return sortDir === 'asc'
          ? va.localeCompare(vb, 'fr')
          : vb.localeCompare(va, 'fr')
      }
      return sortDir === 'asc'
        ? (va as number) - (vb as number)
        : (vb as number) - (va as number)
    })
    return list
  }, [filtered, sortKey, sortDir])

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
          <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
          <p className="mt-1 text-sm text-gray-600">
            {loading ? 'Chargement…' : `${sorted.length} entreprise${sorted.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search bar */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Rechercher par nom, secteur ou adresse…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      {!loading && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th column="nom" label="Nom" toggleSort={toggleSort} indicator={<SortIndicator column="nom" />} />
                <Th column="secteur" label="Secteur" toggleSort={toggleSort} indicator={<SortIndicator column="secteur" />} />
                <Th column="chiffre_affaires" label="CA" toggleSort={toggleSort} indicator={<SortIndicator column="chiffre_affaires" />} />
                <Th column="effectif" label="Effectif" toggleSort={toggleSort} indicator={<SortIndicator column="effectif" />} />
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Adresse
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    {search ? 'Aucune entreprise ne correspond à la recherche.' : 'Aucune entreprise.'}
                  </td>
                </tr>
              ) : (
                sorted.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Link
                        to={`/entreprises/${e.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {e.nom}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {e.secteur ?? <span className="text-gray-400">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right text-gray-700 tabular-nums">
                      {formatCA(e.chiffre_affaires)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right text-gray-700 tabular-nums">
                      {formatEffectif(e.effectif)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                      {e.adresse ?? <span className="text-gray-400">—</span>}
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
