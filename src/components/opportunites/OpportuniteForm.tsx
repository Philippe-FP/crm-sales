import { useState, useEffect } from 'react'
import { getEntreprises } from '../../services/entreprises'
import { getContactsByEntreprise } from '../../services/contacts'
import type { Opportunite, OpportuniteInsert, Entreprise, Contact, StatutOpportunite } from '../../types'

const statutLabels: Record<StatutOpportunite, string> = {
  prospection: 'Prospection',
  qualification: 'Qualification',
  proposition: 'Proposition',
  negociation: 'Négociation',
  gagne: 'Gagné',
  perdu: 'Perdu',
}

const allStatuts: StatutOpportunite[] = [
  'prospection',
  'qualification',
  'proposition',
  'negociation',
  'gagne',
  'perdu',
]

interface OpportuniteFormProps {
  initial?: Opportunite
  onSubmit: (data: OpportuniteInsert) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export default function OpportuniteForm({ initial, onSubmit, onCancel, submitLabel = 'Enregistrer' }: OpportuniteFormProps) {
  const [titre, setTitre] = useState(initial?.titre ?? '')
  const [montant, setMontant] = useState(initial?.montant?.toString() ?? '')
  const [statut, setStatut] = useState<StatutOpportunite>(initial?.statut ?? 'prospection')
  const [probabilite, setProbabilite] = useState(initial?.probabilite?.toString() ?? '')
  const [dateCloturePrevue, setDateCloturePrevue] = useState(initial?.date_cloture_prevue ?? '')
  const [entrepriseId, setEntrepriseId] = useState(initial?.entreprise_id ?? '')
  const [contactPrincipalId, setContactPrincipalId] = useState(initial?.contact_principal_id ?? '')

  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger la liste des entreprises au montage
  useEffect(() => {
    getEntreprises().then(setEntreprises).catch(() => {})
  }, [])

  // Charger les contacts filtrés quand l'entreprise change
  useEffect(() => {
    if (!entrepriseId) {
      setContacts([])
      setContactPrincipalId('')
      return
    }

    let cancelled = false
    setLoadingContacts(true)
    getContactsByEntreprise(entrepriseId)
      .then((data) => {
        if (!cancelled) {
          setContacts(data)
          // Si le contact sélectionné n'appartient plus à cette entreprise, le retirer
          if (contactPrincipalId && !data.some((c) => c.id === contactPrincipalId)) {
            setContactPrincipalId('')
          }
        }
      })
      .catch(() => {
        if (!cancelled) setContacts([])
      })
      .finally(() => {
        if (!cancelled) setLoadingContacts(false)
      })
    return () => { cancelled = true }
  }, [entrepriseId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!titre.trim()) {
      setError('Le titre est obligatoire.')
      return
    }
    if (!entrepriseId) {
      setError("L'entreprise est obligatoire.")
      return
    }

    const montantNum = montant ? Number(montant) : null
    if (montantNum != null && (isNaN(montantNum) || montantNum < 0)) {
      setError('Le montant doit être un nombre positif.')
      return
    }

    const probaNum = probabilite ? Number(probabilite) : null
    if (probaNum != null && (isNaN(probaNum) || probaNum < 0 || probaNum > 100)) {
      setError('La probabilité doit être un nombre entre 0 et 100.')
      return
    }

    const data: OpportuniteInsert = {
      titre: titre.trim(),
      montant: montantNum,
      statut,
      probabilite: probaNum,
      date_cloture_prevue: dateCloturePrevue || null,
      date_cloture_reelle: initial?.date_cloture_reelle ?? null,
      entreprise_id: entrepriseId,
      contact_principal_id: contactPrincipalId || null,
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

      <Field label="Titre *" id="titre">
        <input id="titre" type="text" value={titre} onChange={(e) => setTitre(e.target.value)} className="input" required />
      </Field>

      <Field label="Entreprise *" id="entreprise_id">
        <select
          id="entreprise_id"
          value={entrepriseId}
          onChange={(e) => setEntrepriseId(e.target.value)}
          className="input"
          required
        >
          <option value="">— Sélectionner —</option>
          {entreprises.map((ent) => (
            <option key={ent.id} value={ent.id}>{ent.nom}</option>
          ))}
        </select>
      </Field>

      <Field label="Contact principal" id="contact_principal_id">
        <select
          id="contact_principal_id"
          value={contactPrincipalId}
          onChange={(e) => setContactPrincipalId(e.target.value)}
          className="input"
          disabled={!entrepriseId || loadingContacts}
        >
          <option value="">— Aucun —</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.prenom} {c.nom}{c.est_principal ? ' (principal)' : ''}
            </option>
          ))}
        </select>
        {!entrepriseId && (
          <p className="mt-1 text-xs text-gray-400">Sélectionnez une entreprise pour voir ses contacts.</p>
        )}
        {entrepriseId && contacts.length === 0 && !loadingContacts && (
          <p className="mt-1 text-xs text-gray-400">Aucun contact pour cette entreprise.</p>
        )}
      </Field>

      <Field label="Statut *" id="statut">
        <select
          id="statut"
          value={statut}
          onChange={(e) => setStatut(e.target.value as StatutOpportunite)}
          className="input"
          required
        >
          {allStatuts.map((s) => (
            <option key={s} value={s}>{statutLabels[s]}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Montant (€)" id="montant">
          <input
            id="montant"
            type="number"
            min="0"
            step="1"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Probabilité (%)" id="probabilite">
          <input
            id="probabilite"
            type="number"
            min="0"
            max="100"
            step="1"
            value={probabilite}
            onChange={(e) => setProbabilite(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Date de clôture prévue" id="date_cloture_prevue">
        <input
          id="date_cloture_prevue"
          type="date"
          value={dateCloturePrevue}
          onChange={(e) => setDateCloturePrevue(e.target.value)}
          className="input"
        />
      </Field>

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
