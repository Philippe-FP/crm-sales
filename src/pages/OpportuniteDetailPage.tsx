import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getOpportuniteById, updateOpportunite, deleteOpportunite } from '../services/opportunites'
import { getEntrepriseById } from '../services/entreprises'
import { getContactById } from '../services/contacts'
import { getActivitesByOpportunite } from '../services/activites'
import OpportuniteForm from '../components/opportunites/OpportuniteForm'
import type { Opportunite, Entreprise, Contact, Activite, StatutOpportunite, TypeActivite, OpportuniteInsert } from '../types'

function formatEuros(v: number | null): string {
  if (v == null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
}

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR')
}

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

const typeLabels: Record<TypeActivite, string> = {
  appel: 'Appel',
  email: 'Email',
  reunion: 'Réunion',
  note: 'Note',
  tache: 'Tâche',
}

export default function OpportuniteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [opportunite, setOpportunite] = useState<Opportunite | null>(null)
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
  const [contactPrincipal, setContactPrincipal] = useState<Contact | null>(null)
  const [activites, setActivites] = useState<Activite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [updatingStatut, setUpdatingStatut] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      try {
        const opp = await getOpportuniteById(id!)
        const [ent, contact, acts] = await Promise.all([
          getEntrepriseById(opp.entreprise_id),
          opp.contact_principal_id ? getContactById(opp.contact_principal_id) : Promise.resolve(null),
          getActivitesByOpportunite(id!),
        ])
        if (!cancelled) {
          setOpportunite(opp)
          setEntreprise(ent)
          setContactPrincipal(contact)
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

  async function handleStatutChange(newStatut: StatutOpportunite) {
    if (!opportunite || !id) return
    setUpdatingStatut(true)

    // Règle 5.3 : gagne/perdu => date_cloture_reelle = aujourd'hui
    // Retour à un statut antérieur => effacer date_cloture_reelle
    let dateCloture: string | null = opportunite.date_cloture_reelle
    if (newStatut === 'gagne' || newStatut === 'perdu') {
      dateCloture = new Date().toISOString().split('T')[0]
    } else {
      dateCloture = null
    }

    try {
      const updated = await updateOpportunite(id, {
        statut: newStatut,
        date_cloture_reelle: dateCloture,
      })
      setOpportunite(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de statut')
    } finally {
      setUpdatingStatut(false)
    }
  }

  async function handleEdit(data: OpportuniteInsert) {
    if (!id) return
    const updated = await updateOpportunite(id, data)
    setOpportunite(updated)
    // Recharger entreprise et contact si changés
    const [ent, contact] = await Promise.all([
      getEntrepriseById(updated.entreprise_id),
      updated.contact_principal_id ? getContactById(updated.contact_principal_id) : Promise.resolve(null),
    ])
    setEntreprise(ent)
    setContactPrincipal(contact)
    setShowEditForm(false)
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

  if (error) {
    return (
      <div>
        <Link to="/opportunites" className="text-sm text-blue-600 hover:text-blue-800">&larr; Retour aux opportunités</Link>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  if (!opportunite) return null

  return (
    <div>
      <Link to="/opportunites" className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Retour aux opportunités
      </Link>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{opportunite.titre}</h1>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statutColors[opportunite.statut]}`}>
            {statutLabels[opportunite.statut]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Modifier
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Changement de statut direct */}
      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="statut-select" className="text-sm font-medium text-gray-700">Changer le statut :</label>
        <select
          id="statut-select"
          value={opportunite.statut}
          onChange={(e) => handleStatutChange(e.target.value as StatutOpportunite)}
          disabled={updatingStatut}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
        >
          {allStatuts.map((s) => (
            <option key={s} value={s}>{statutLabels[s]}</option>
          ))}
        </select>
        {updatingStatut && <span className="text-xs text-gray-400">Mise à jour…</span>}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Supprimer <strong>{opportunite.titre}</strong> et toutes les activités liées ? Cette action est irréversible.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={async () => {
                setDeleting(true)
                try {
                  await deleteOpportunite(id!)
                  navigate('/opportunites')
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
        <InfoItem label="Montant" value={formatEuros(opportunite.montant)} />
        <InfoItem label="Probabilité" value={opportunite.probabilite != null ? `${opportunite.probabilite} %` : null} />
        <InfoItem label="Statut" value={statutLabels[opportunite.statut]} />
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Entreprise</dt>
          <dd className="mt-1 text-sm">
            {entreprise ? (
              <Link to={`/entreprises/${entreprise.id}`} className="text-blue-600 hover:text-blue-800">
                {entreprise.nom}
              </Link>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Contact principal</dt>
          <dd className="mt-1 text-sm">
            {contactPrincipal ? (
              <Link to={`/contacts/${contactPrincipal.id}`} className="text-blue-600 hover:text-blue-800">
                {contactPrincipal.prenom} {contactPrincipal.nom}
              </Link>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </dd>
        </div>
        <InfoItem label="Clôture prévue" value={formatDate(opportunite.date_cloture_prevue)} />
        <InfoItem label="Clôture réelle" value={formatDate(opportunite.date_cloture_reelle)} />
        <InfoItem label="Créée le" value={formatDate(opportunite.created_at)} />
      </div>

      {/* Activités */}
      <Section title="Activités" count={activites.length} className="mt-10 mb-8">
        {activites.length === 0 ? (
          <EmptyState text="Aucune activité liée." />
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
                    <span className="ml-auto text-xs text-gray-500">{formatDate(a.date_echeance)}</span>
                  )}
                </div>
                {a.description && <p className="mt-2 text-sm text-gray-600">{a.description}</p>}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Modale de modification */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Modifier l'opportunité</h2>
            <OpportuniteForm
              initial={opportunite}
              onSubmit={handleEdit}
              onCancel={() => setShowEditForm(false)}
              submitLabel="Enregistrer"
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ── */

function InfoItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">
        {value ?? <span className="text-gray-400">—</span>}
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
