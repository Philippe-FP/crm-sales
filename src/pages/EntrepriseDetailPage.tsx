import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getEntrepriseById, deleteEntreprise } from '../services/entreprises'
import { getContactsByEntreprise } from '../services/contacts'
import { getOpportunitesByEntreprise } from '../services/opportunites'
import { getActivitesByEntreprise } from '../services/activites'
import type { Entreprise, Contact, Opportunite, Activite, StatutOpportunite, TypeActivite } from '../types'

function formatEuros(v: number | null): string {
  if (v == null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
}

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR')
}

const statutColors: Record<StatutOpportunite, string> = {
  prospection: 'bg-gray-100 text-gray-700',
  qualification: 'bg-blue-100 text-blue-700',
  proposition: 'bg-indigo-100 text-indigo-700',
  negociation: 'bg-amber-100 text-amber-700',
  gagne: 'bg-green-100 text-green-700',
  perdu: 'bg-red-100 text-red-700',
}

const typeLabels: Record<TypeActivite, string> = {
  appel: 'Appel',
  email: 'Email',
  reunion: 'Réunion',
  note: 'Note',
  tache: 'Tâche',
}

export default function EntrepriseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [opportunites, setOpportunites] = useState<Opportunite[]>([])
  const [activites, setActivites] = useState<Activite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      try {
        const [ent, cts, opps, acts] = await Promise.all([
          getEntrepriseById(id!),
          getContactsByEntreprise(id!),
          getOpportunitesByEntreprise(id!),
          getActivitesByEntreprise(id!),
        ])
        if (!cancelled) {
          setEntreprise(ent)
          setContacts(cts)
          setOpportunites(opps)
          setActivites(acts)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

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

  if (error) {
    return (
      <div>
        <Link to="/entreprises" className="text-sm text-blue-600 hover:text-blue-800">&larr; Retour aux entreprises</Link>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  if (!entreprise) return null

  return (
    <div>
      <Link to="/entreprises" className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Retour aux entreprises
      </Link>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{entreprise.nom}</h1>
        <div className="flex items-center gap-2">
          <Link
            to={`/entreprises/${id}/edit`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Modifier
          </Link>
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Supprimer <strong>{entreprise.nom}</strong> et toutes ses opportunités associées ? Cette action est irréversible.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={async () => {
                setDeleting(true)
                try {
                  await deleteEntreprise(id!)
                  navigate('/entreprises')
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
                  setDeleting(false)
                  setConfirmDelete(false)
                }
              }}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Suppression…' : 'Confirmer la suppression'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Info grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <InfoItem label="Secteur" value={entreprise.secteur} />
        <InfoItem label="Chiffre d'affaires" value={formatEuros(entreprise.chiffre_affaires)} />
        <InfoItem label="Effectif" value={entreprise.effectif != null ? new Intl.NumberFormat('fr-FR').format(entreprise.effectif) : null} />
        <InfoItem label="Adresse" value={entreprise.adresse} />
        <InfoItem
          label="Site web"
          value={entreprise.site_web}
          href={entreprise.site_web ?? undefined}
        />
        <InfoItem label="Créée le" value={formatDate(entreprise.created_at)} />
      </div>

      {/* Contacts */}
      <Section title="Contacts" count={contacts.length} className="mt-10">
        {contacts.length === 0 ? (
          <EmptyState text="Aucun contact rattaché." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((c) => (
              <Link
                key={c.id}
                to={`/contacts/${c.id}`}
                className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{c.prenom} {c.nom}</span>
                  {c.est_principal && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Principal
                    </span>
                  )}
                </div>
                {c.fonction && <p className="mt-1 text-sm text-gray-500">{c.fonction}</p>}
                {c.email && <p className="mt-1 text-sm text-gray-600">{c.email}</p>}
                {c.telephone && <p className="text-sm text-gray-600">{c.telephone}</p>}
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Opportunités */}
      <Section title="Opportunités" count={opportunites.length} className="mt-10">
        {opportunites.length === 0 ? (
          <EmptyState text="Aucune opportunité." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Titre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Montant</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Proba.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Clôture prévue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {opportunites.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Link to={`/opportunites/${o.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                        {o.titre}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statutColors[o.statut]}`}>
                        {o.statut}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right tabular-nums text-gray-700">
                      {formatEuros(o.montant)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right tabular-nums text-gray-700">
                      {o.probabilite != null ? `${o.probabilite} %` : '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatDate(o.date_cloture_prevue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Activités */}
      <Section title="Activités" count={activites.length} className="mt-10 mb-8">
        {activites.length === 0 ? (
          <EmptyState text="Aucune activité." />
        ) : (
          <div className="space-y-3">
            {activites.map((a) => (
              <div
                key={a.id}
                className={`rounded-lg border p-4 ${a.est_fait ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    a.est_fait ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {typeLabels[a.type]}
                  </span>
                  <span className={`text-sm font-medium ${a.est_fait ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {a.sujet}
                  </span>
                  {a.date_echeance && (
                    <span className="ml-auto text-xs text-gray-500">
                      {formatDate(a.date_echeance)}
                    </span>
                  )}
                </div>
                {a.description && (
                  <p className="mt-2 text-sm text-gray-600">{a.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}

/* ── Sub-components ── */

function InfoItem({ label, value, href }: { label: string; value: string | null; href?: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">
        {value ? (
          href ? (
            <a href={href.startsWith('http') ? href : `https://${href}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              {value}
            </a>
          ) : value
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </dd>
    </div>
  )
}

function Section({ title, count, className, children }: { title: string; count: number; className?: string; children: React.ReactNode }) {
  return (
    <section className={className}>
      <h2 className="text-lg font-semibold text-gray-900">
        {title}
        <span className="ml-2 text-sm font-normal text-gray-500">({count})</span>
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-gray-500 py-4">{text}</p>
}
