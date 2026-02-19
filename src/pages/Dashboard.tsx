import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEntreprises } from '../services/entreprises'
import { getContacts } from '../services/contacts'
import { getOpportunites } from '../services/opportunites'
import { getActivites } from '../services/activites'
import { updateActivite } from '../services/activites'
import type { Opportunite, Activite, TypeActivite } from '../types'

interface DashboardStats {
  entreprises: number
  contacts: number
  opportunitesEnCours: number
  montantPondere: number
  activitesAVenir: number
}

const STATUTS_EN_COURS = new Set(['prospection', 'qualification', 'proposition', 'negociation'])

const statutLabels: Record<string, string> = {
  prospection: 'Prospection',
  qualification: 'Qualification',
  proposition: 'Proposition',
  negociation: 'Négociation',
  gagne: 'Gagné',
  perdu: 'Perdu',
}

const typeLabels: Record<TypeActivite, string> = {
  appel: 'Appel',
  email: 'Email',
  reunion: 'Réunion',
  note: 'Note',
  tache: 'Tâche',
}

function computeStats(
  entreprisesCount: number,
  contactsCount: number,
  opportunites: Opportunite[],
  activites: Activite[],
): DashboardStats {
  const enCours = opportunites.filter((o) => STATUTS_EN_COURS.has(o.statut))

  const montantPondere = enCours.reduce((sum, o) => {
    const montant = o.montant ?? 0
    const proba = o.probabilite ?? 0
    return sum + montant * (proba / 100)
  }, 0)

  const today = new Date().toISOString().slice(0, 10)
  const activitesAVenir = activites.filter(
    (a) => !a.est_fait && a.date_echeance && a.date_echeance >= today,
  ).length

  return {
    entreprises: entreprisesCount,
    contacts: contactsCount,
    opportunitesEnCours: enCours.length,
    montantPondere,
    activitesAVenir,
  }
}

function formatEuros(value: number): string {
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

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [prochainesActivites, setProchainesActivites] = useState<Activite[]>([])
  const [dernieresOpportunites, setDernieresOpportunites] = useState<Opportunite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [entreprises, contacts, opportunites, activites] = await Promise.all([
          getEntreprises(),
          getContacts(),
          getOpportunites(),
          getActivites(),
        ])
        if (!cancelled) {
          setStats(computeStats(entreprises.length, contacts.length, opportunites, activites))

          // 10 prochaines activités à faire (non faites, triées par date d'échéance croissante)
          const today = new Date().toISOString().slice(0, 10)
          const prochaines = activites
            .filter((a) => !a.est_fait && a.date_echeance && a.date_echeance >= today)
            .sort((a, b) => (a.date_echeance ?? '').localeCompare(b.date_echeance ?? ''))
            .slice(0, 10)
          setProchainesActivites(prochaines)

          // 5 dernières opportunités modifiées
          const dernieres = [...opportunites]
            .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
            .slice(0, 5)
          setDernieresOpportunites(dernieres)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  async function toggleActiviteFait(activite: Activite) {
    const updated = await updateActivite(activite.id, { est_fait: !activite.est_fait })
    setProchainesActivites((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a)).filter((a) => !a.est_fait),
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-gray-600">Vue d'ensemble de l'activité commerciale.</p>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Chargement...
        </div>
      ) : stats && (
        <>
          {/* Stat cards */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Entreprises"
              value={stats.entreprises.toString()}
              color="blue"
              icon={<BuildingIcon />}
            />
            <StatCard
              label="Contacts"
              value={stats.contacts.toString()}
              color="green"
              icon={<UsersIcon />}
            />
            <StatCard
              label="Opportunités en cours"
              value={stats.opportunitesEnCours.toString()}
              color="amber"
              icon={<CurrencyIcon />}
            />
            <StatCard
              label="Montant pondéré"
              value={formatEuros(stats.montantPondere)}
              color="purple"
              icon={<ChartIcon />}
            />
            <StatCard
              label="Activités à venir"
              value={stats.activitesAVenir.toString()}
              color="rose"
              icon={<CalendarIcon />}
            />
          </div>

          {/* Sections détail */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* 10 prochaines activités */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Prochaines activités</h2>
                <Link to="/activites" className="text-sm text-blue-600 hover:text-blue-800">
                  Tout voir
                </Link>
              </div>
              {prochainesActivites.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">Aucune activité à venir.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {prochainesActivites.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 py-3">
                      <button
                        onClick={() => toggleActiviteFait(a)}
                        title="Marquer comme fait"
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-gray-300 bg-white text-xs text-transparent transition-colors hover:border-green-400 hover:text-green-400"
                      >
                        ✓
                      </button>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        a.est_fait ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {typeLabels[a.type]}
                      </span>
                      <span className="flex-1 truncate text-sm text-gray-900">{a.sujet}</span>
                      <span className="text-xs text-gray-500">{formatDate(a.date_echeance)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 5 dernières opportunités modifiées */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Dernières opportunités</h2>
                <Link to="/opportunites" className="text-sm text-blue-600 hover:text-blue-800">
                  Tout voir
                </Link>
              </div>
              {dernieresOpportunites.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">Aucune opportunité.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {dernieresOpportunites.map((o) => (
                    <li key={o.id} className="py-3">
                      <Link to={`/opportunites/${o.id}`} className="block hover:bg-gray-50 -mx-2 px-2 py-1 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 truncate">{o.titre}</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {o.montant != null ? formatEuros(o.montant) : '—'}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            o.statut === 'gagne'
                              ? 'bg-green-100 text-green-700'
                              : o.statut === 'perdu'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {statutLabels[o.statut]}
                          </span>
                          <span className="text-xs text-gray-500">
                            modifié le {formatDate(o.updated_at)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Liens rapides */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Liens rapides</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <QuickLink to="/entreprises/new" label="Nouvelle entreprise" icon={<BuildingIcon />} color="blue" />
              <QuickLink to="/contacts/new" label="Nouveau contact" icon={<UsersIcon />} color="green" />
              <QuickLink to="/opportunites/new" label="Nouvelle opportunité" icon={<CurrencyIcon />} color="amber" />
              <QuickLink to="/activites/new" label="Nouvelle activité" icon={<CalendarIcon />} color="rose" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ── QuickLink ── */

const quickLinkColors: Record<string, string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
  green: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
  amber: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
  rose: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
}

function QuickLink({ to, label, icon, color }: { to: string; label: string; icon: React.ReactNode; color: string }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${quickLinkColors[color] ?? quickLinkColors.blue}`}
    >
      {icon}
      {label}
    </Link>
  )
}

/* ── StatCard ── */

const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   text: 'text-blue-900' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  text: 'text-green-900' },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  text: 'text-amber-900' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-900' },
  rose:   { bg: 'bg-rose-50',   icon: 'text-rose-600',   text: 'text-rose-900' },
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: string
  color: string
  icon: React.ReactNode
}) {
  const c = colorMap[color] ?? colorMap.blue
  return (
    <div className={`rounded-xl ${c.bg} p-6`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className={`${c.icon}`}>{icon}</span>
      </div>
      <p className={`mt-3 text-3xl font-bold ${c.text}`}>{value}</p>
    </div>
  )
}

/* ── Icons ── */

function BuildingIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  )
}

function CurrencyIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}
