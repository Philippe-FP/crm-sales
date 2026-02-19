import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getContactById, deleteContact } from '../services/contacts'
import { getEntrepriseById } from '../services/entreprises'
import { getOpportunitesByContact } from '../services/opportunites'
import { getActivitesByContact } from '../services/activites'
import Timeline from '../components/activites/Timeline'
import type { Contact, Entreprise, Opportunite, Activite, StatutOpportunite } from '../types'

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

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contact, setContact] = useState<Contact | null>(null)
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
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
        const ct = await getContactById(id!)
        const [ent, opps, acts] = await Promise.all([
          ct.entreprise_id ? getEntrepriseById(ct.entreprise_id) : Promise.resolve(null),
          getOpportunitesByContact(id!),
          getActivitesByContact(id!),
        ])
        if (!cancelled) {
          setContact(ct)
          setEntreprise(ent)
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
        <Link to="/contacts" className="text-sm text-blue-600 hover:text-blue-800">&larr; Retour aux contacts</Link>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  if (!contact) return null

  return (
    <div>
      <Link to="/contacts" className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Retour aux contacts
      </Link>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{contact.prenom} {contact.nom}</h1>
          {contact.est_principal && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Principal</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/contacts/${id}/edit`}
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
            Supprimer <strong>{contact.prenom} {contact.nom}</strong> ? Cette action est irréversible.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={async () => {
                setDeleting(true)
                try {
                  await deleteContact(id!)
                  navigate('/contacts')
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
        <InfoItem label="Fonction" value={contact.fonction} />
        <InfoItem label="Email" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} />
        <InfoItem label="Téléphone" value={contact.telephone} href={contact.telephone ? `tel:${contact.telephone}` : undefined} />
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
        <InfoItem label="Contact principal" value={contact.est_principal ? 'Oui' : 'Non'} />
        <InfoItem label="Créé le" value={formatDate(contact.created_at)} />
      </div>

      {/* Opportunités */}
      <Section title="Opportunités" count={opportunites.length} className="mt-10">
        {opportunites.length === 0 ? (
          <EmptyState text="Aucune opportunité liée." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Titre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Montant</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Proba.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {opportunites.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Link to={`/opportunites/${o.id}`} className="font-medium text-blue-600 hover:text-blue-800">{o.titre}</Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statutColors[o.statut]}`}>{o.statut}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right tabular-nums text-gray-700">{formatEuros(o.montant)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right tabular-nums text-gray-700">
                      {o.probabilite != null ? `${o.probabilite} %` : '—'}
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
        <Timeline
          activites={activites}
          onActiviteUpdated={(updated) =>
            setActivites((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
          }
        />
      </Section>
    </div>
  )
}

function InfoItem({ label, value, href }: { label: string; value: string | null; href?: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">
        {value ? (
          href ? (
            <a href={href} className="text-blue-600 hover:text-blue-800">{value}</a>
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
