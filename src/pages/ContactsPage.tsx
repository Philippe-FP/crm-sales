import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getContacts } from '../services/contacts'
import { getEntreprises } from '../services/entreprises'
import type { Contact, Entreprise } from '../types'

type SortKey = 'nom' | 'prenom' | 'fonction' | 'email' | 'entreprise'
type SortDir = 'asc' | 'desc'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [entreprises, setEntreprises] = useState<Map<string, Entreprise>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('nom')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [cts, ents] = await Promise.all([getContacts(), getEntreprises()])
        if (!cancelled) {
          setContacts(cts)
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

  function entrepriseName(id: string | null): string {
    if (!id) return ''
    return entreprises.get(id)?.nom ?? ''
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return contacts
    return contacts.filter(
      (c) =>
        c.nom.toLowerCase().includes(q) ||
        c.prenom.toLowerCase().includes(q) ||
        (c.fonction && c.fonction.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        entrepriseName(c.entreprise_id).toLowerCase().includes(q),
    )
  }, [contacts, search, entreprises])

  const sorted = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      let va: string, vb: string
      if (sortKey === 'entreprise') {
        va = entrepriseName(a.entreprise_id)
        vb = entrepriseName(b.entreprise_id)
      } else {
        va = (a[sortKey] ?? '') as string
        vb = (b[sortKey] ?? '') as string
      }
      const cmp = va.localeCompare(vb, 'fr')
      return sortDir === 'asc' ? cmp : -cmp
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
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-1 text-sm text-gray-600">
            {loading ? 'Chargement…' : `${sorted.length} contact${sorted.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          to="/contacts/new"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nouveau contact
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom, fonction, email ou entreprise…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {!loading && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th column="nom" label="Nom" toggleSort={toggleSort} indicator={<SortIndicator column="nom" />} />
                <Th column="prenom" label="Prénom" toggleSort={toggleSort} indicator={<SortIndicator column="prenom" />} />
                <Th column="entreprise" label="Entreprise" toggleSort={toggleSort} indicator={<SortIndicator column="entreprise" />} />
                <Th column="fonction" label="Fonction" toggleSort={toggleSort} indicator={<SortIndicator column="fonction" />} />
                <Th column="email" label="Email" toggleSort={toggleSort} indicator={<SortIndicator column="email" />} />
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tél.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    {search ? 'Aucun contact ne correspond à la recherche.' : 'Aucun contact.'}
                  </td>
                </tr>
              ) : (
                sorted.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Link to={`/contacts/${c.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                        {c.nom}
                      </Link>
                      {c.est_principal && (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          Principal
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{c.prenom}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {c.entreprise_id ? (
                        <Link to={`/entreprises/${c.entreprise_id}`} className="text-blue-600 hover:text-blue-800">
                          {entrepriseName(c.entreprise_id)}
                        </Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {c.fonction ?? <span className="text-gray-400">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {c.email ?? <span className="text-gray-400">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {c.telephone ?? <span className="text-gray-400">—</span>}
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
