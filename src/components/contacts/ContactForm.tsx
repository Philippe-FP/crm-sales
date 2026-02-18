import { useState, useEffect } from 'react'
import { getEntreprises } from '../../services/entreprises'
import type { Contact, ContactInsert, Entreprise } from '../../types'

interface ContactFormProps {
  initial?: Contact
  onSubmit: (data: ContactInsert) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export default function ContactForm({ initial, onSubmit, onCancel, submitLabel = 'Enregistrer' }: ContactFormProps) {
  const [prenom, setPrenom] = useState(initial?.prenom ?? '')
  const [nom, setNom] = useState(initial?.nom ?? '')
  const [fonction, setFonction] = useState(initial?.fonction ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [telephone, setTelephone] = useState(initial?.telephone ?? '')
  const [estPrincipal, setEstPrincipal] = useState(initial?.est_principal ?? false)
  const [entrepriseId, setEntrepriseId] = useState(initial?.entreprise_id ?? '')
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getEntreprises().then(setEntreprises).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!prenom.trim() || !nom.trim()) {
      setError('Le prénom et le nom sont obligatoires.')
      return
    }

    const data: ContactInsert = {
      prenom: prenom.trim(),
      nom: nom.trim(),
      fonction: fonction.trim() || null,
      email: email.trim() || null,
      telephone: telephone.trim() || null,
      est_principal: estPrincipal,
      entreprise_id: entrepriseId || null,
      proprietaire_id: initial?.proprietaire_id ?? null,
    }

    setSaving(true)
    try {
      await onSubmit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Prénom *" id="prenom">
          <input id="prenom" type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="input" required />
        </Field>
        <Field label="Nom *" id="nom">
          <input id="nom" type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="input" required />
        </Field>
      </div>

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

      <Field label="Fonction" id="fonction">
        <input id="fonction" type="text" value={fonction} onChange={(e) => setFonction(e.target.value)} className="input" />
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Email" id="email">
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </Field>
        <Field label="Téléphone" id="telephone">
          <input id="telephone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="input" />
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="est_principal"
          type="checkbox"
          checked={estPrincipal}
          onChange={(e) => setEstPrincipal(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="est_principal" className="text-sm font-medium text-gray-700">
          Contact principal
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
