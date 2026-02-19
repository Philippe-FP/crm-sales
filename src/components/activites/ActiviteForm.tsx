import { useState, useEffect } from 'react'
import { getEntreprises } from '../../services/entreprises'
import { getContacts } from '../../services/contacts'
import { getOpportunites } from '../../services/opportunites'
import type { Activite, ActiviteInsert, Entreprise, Contact, Opportunite, TypeActivite } from '../../types'

const typeLabels: Record<TypeActivite, string> = {
  appel: 'Appel',
  email: 'Email',
  reunion: 'Réunion',
  note: 'Note',
  tache: 'Tâche',
}

const allTypes: TypeActivite[] = ['appel', 'email', 'reunion', 'note', 'tache']

interface ActiviteFormProps {
  initial?: Activite
  onSubmit: (data: ActiviteInsert) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export default function ActiviteForm({ initial, onSubmit, onCancel, submitLabel = 'Enregistrer' }: ActiviteFormProps) {
  const [type, setType] = useState<TypeActivite>(initial?.type ?? 'appel')
  const [sujet, setSujet] = useState(initial?.sujet ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [dateEcheance, setDateEcheance] = useState(initial?.date_echeance ?? '')
  const [estFait, setEstFait] = useState(initial?.est_fait ?? false)
  const [entrepriseId, setEntrepriseId] = useState(initial?.entreprise_id ?? '')
  const [contactId, setContactId] = useState(initial?.contact_id ?? '')
  const [opportuniteId, setOpportuniteId] = useState(initial?.opportunite_id ?? '')

  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [opportunites, setOpportunites] = useState<Opportunite[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getEntreprises(), getContacts(), getOpportunites()])
      .then(([ents, cts, opps]) => {
        setEntreprises(ents)
        setContacts(cts)
        setOpportunites(opps)
      })
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!sujet.trim()) {
      setError('Le sujet est obligatoire.')
      return
    }

    // Règle 5.2 : au moins un lien obligatoire
    if (!entrepriseId && !contactId && !opportuniteId) {
      setError('Au moins un lien est obligatoire (entreprise, contact ou opportunité).')
      return
    }

    const data: ActiviteInsert = {
      type,
      sujet: sujet.trim(),
      description: description.trim() || null,
      date_echeance: dateEcheance || null,
      date_realisation: initial?.date_realisation ?? null,
      est_fait: estFait,
      entreprise_id: entrepriseId || null,
      contact_id: contactId || null,
      opportunite_id: opportuniteId || null,
      proprietaire_id: initial?.proprietaire_id ?? null,
    }

    setSaving(true)
    try {
      await onSubmit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Type *" id="type">
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as TypeActivite)}
            className="input"
            required
          >
            {allTypes.map((t) => (
              <option key={t} value={t}>{typeLabels[t]}</option>
            ))}
          </select>
        </Field>

        <Field label="Date d'échéance" id="date_echeance">
          <input
            id="date_echeance"
            type="date"
            value={dateEcheance}
            onChange={(e) => setDateEcheance(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Sujet *" id="sujet">
        <input id="sujet" type="text" value={sujet} onChange={(e) => setSujet(e.target.value)} className="input" required />
      </Field>

      <Field label="Description" id="description">
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
      </Field>

      {/* Liens (au moins 1 obligatoire) */}
      <div className="rounded-lg border border-gray-200 p-4 space-y-4">
        <p className="text-sm font-medium text-gray-700">
          Entités liées <span className="font-normal text-gray-400">(au moins une obligatoire)</span>
        </p>

        <Field label="Entreprise" id="entreprise_id">
          <select
            id="entreprise_id"
            value={entrepriseId}
            onChange={(e) => setEntrepriseId(e.target.value)}
            className="input"
          >
            <option value="">— Aucune —</option>
            {entreprises.map((ent) => (
              <option key={ent.id} value={ent.id}>{ent.nom}</option>
            ))}
          </select>
        </Field>

        <Field label="Contact" id="contact_id">
          <select
            id="contact_id"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="input"
          >
            <option value="">— Aucun —</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
            ))}
          </select>
        </Field>

        <Field label="Opportunité" id="opportunite_id">
          <select
            id="opportunite_id"
            value={opportuniteId}
            onChange={(e) => setOpportuniteId(e.target.value)}
            className="input"
          >
            <option value="">— Aucune —</option>
            {opportunites.map((o) => (
              <option key={o.id} value={o.id}>{o.titre}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="est_fait"
          type="checkbox"
          checked={estFait}
          onChange={(e) => setEstFait(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="est_fait" className="text-sm font-medium text-gray-700">
          Marquée comme faite
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
