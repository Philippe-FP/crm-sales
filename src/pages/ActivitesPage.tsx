import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getActivites, createActivite, updateActivite } from '../services/activites'
import { getEntreprises } from '../services/entreprises'
import { getContacts } from '../services/contacts'
import { getOpportunites } from '../services/opportunites'
import ActiviteForm from '../components/activites/ActiviteForm'
import type { Activite, ActiviteInsert, Entreprise, Contact, Opportunite, TypeActivite } from '../types'

type StatutFilter = '' | 'a_faire' | 'fait'

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

const allTypes: TypeActivite[] = ['appel', 'email', 'reunion', 'note', 'tache']

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR')
}

export default function ActivitesPage() {
  const [activites, setActivites] = useState<Activite[]>([])
  const [entreprises, setEntreprises] = useState<Map<string, Entreprise>>(new Map())
  const [contacts, setContacts] = useState<Map<string, Contact>>(new Map())
  const [opportunites, setOpportunites] = useState<Map<string, Opportunite>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeActivite | ''>('')
  const [statutFilter, setStatutFilter] = useState<StatutFilter>('')
  const [periodeFilter, setPeriodeFilter] = useState<'' | 'passe' | 'aujourdhui' | 'semaine' | 'mois'>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingActivite, setEditingActivite] = useState<Activite | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [acts, ents, cts, opps] = await Promise.all([
          getActivites(),
          getEntreprises(),
          getContacts(),
          getOpportunites(),
        ])
        if (!cancelled) {
          setActivites(acts)
          setEntreprises(new Map(ents.map((e) => [e.id, e])))
          setContacts(new Map(cts.map((c) => [c.id, c])))
          setOpportunites(new Map(opps.map((o) => [o.id, o])))
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

  async function handleCreate(data: ActiviteInsert) {
    const created = await createActivite(data)
    setActivites((prev) => [created, ...prev])
    setShowCreateForm(false)
  }

  async function handleEdit(data: ActiviteInsert) {
    if (!editingActivite) return
    const updated = await updateActivite(editingActivite.id, data)
    setActivites((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    setEditingActivite(null)
  }

  const filtered = useMemo(() => {
    let list = activites

    // Filtre par type
    if (typeFilter) {
      list = list.filter((a) => a.type === typeFilter)
    }

    // Filtre par statut
    if (statutFilter === 'fait') {
      list = list.filter((a) => a.est_fait)
    } else if (statutFilter === 'a_faire') {
      list = list.filter((a) => !a.est_fait)
    }

    // Filtre par période (basé sur date_echeance)
    if (periodeFilter) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      list = list.filter((a) => {
        if (!a.date_echeance) return false
        const d = new Date(a.date_echeance)

        switch (periodeFilter) {
          case 'passe':
            return d < today
          case 'aujourdhui':
            return d.toDateString() === today.toDateString()
          case 'semaine': {
            const endOfWeek = new Date(today)
            endOfWeek.setDate(today.getDate() + 7)
            return d >= today && d < endOfWeek
          }
          case 'mois': {
            const endOfMonth = new Date(today)
            endOfMonth.setDate(today.getDate() + 30)
            return d >= today && d < endOfMonth
          }
          default:
            return true
        }
      })
    }

    // Recherche par sujet
    const q = search.toLowerCase().trim()
    if (q) {
      list = list.filter((a) => a.sujet.toLowerCase().includes(q))
    }

    return list
  }, [activites, search, typeFilter, statutFilter, periodeFilter])

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activités</h1>
          <p className="mt-1 text-sm text-gray-600">
            {loading ? 'Chargement…' : `${filtered.length} activité${filtered.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nouvelle activité
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher par sujet…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeActivite | '')}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Tous les types</option>
          {allTypes.map((t) => (
            <option key={t} value={t}>{typeLabels[t]}</option>
          ))}
        </select>
        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value as StatutFilter)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="a_faire">À faire</option>
          <option value="fait">Fait</option>
        </select>
        <select
          value={periodeFilter}
          onChange={(e) => setPeriodeFilter(e.target.value as typeof periodeFilter)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Toutes les périodes</option>
          <option value="passe">En retard</option>
          <option value="aujourdhui">Aujourd'hui</option>
          <option value="semaine">7 prochains jours</option>
          <option value="mois">30 prochains jours</option>
        </select>
      </div>

      {/* Tableau */}
      {!loading && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sujet</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Entités liées</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Échéance</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    {search || typeFilter || statutFilter || periodeFilter
                      ? 'Aucune activité ne correspond aux critères.'
                      : 'Aucune activité.'}
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setEditingActivite(a)}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className="mr-1.5" title={typeLabels[a.type]}>{typeIcons[a.type]}</span>
                      <span className="text-gray-700">{typeLabels[a.type]}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-medium ${a.est_fait ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {a.sujet}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {a.entreprise_id && entreprises.has(a.entreprise_id) && (
                          <Link to={`/entreprises/${a.entreprise_id}`} className="text-blue-600 hover:text-blue-800 text-xs">
                            {entreprises.get(a.entreprise_id)!.nom}
                          </Link>
                        )}
                        {a.contact_id && contacts.has(a.contact_id) && (
                          <Link to={`/contacts/${a.contact_id}`} className="text-blue-600 hover:text-blue-800 text-xs">
                            {contacts.get(a.contact_id)!.prenom} {contacts.get(a.contact_id)!.nom}
                          </Link>
                        )}
                        {a.opportunite_id && opportunites.has(a.opportunite_id) && (
                          <Link to={`/opportunites/${a.opportunite_id}`} className="text-blue-600 hover:text-blue-800 text-xs">
                            {opportunites.get(a.opportunite_id)!.titre}
                          </Link>
                        )}
                        {!a.entreprise_id && !a.contact_id && !a.opportunite_id && (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatDate(a.date_echeance)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        a.est_fait ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {a.est_fait ? 'Fait' : 'À faire'}
                      </span>
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
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Nouvelle activité</h2>
            <ActiviteForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              submitLabel="Créer"
            />
          </div>
        </div>
      )}

      {/* Modale de modification */}
      {editingActivite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Modifier l'activité</h2>
            <ActiviteForm
              initial={editingActivite}
              onSubmit={handleEdit}
              onCancel={() => setEditingActivite(null)}
              submitLabel="Enregistrer"
            />
          </div>
        </div>
      )}
    </div>
  )
}
