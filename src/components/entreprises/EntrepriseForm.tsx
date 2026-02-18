import { useState } from 'react'
import type { Entreprise, EntrepriseInsert } from '../../types'

interface EntrepriseFormProps {
  initial?: Entreprise
  onSubmit: (data: EntrepriseInsert) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export default function EntrepriseForm({ initial, onSubmit, onCancel, submitLabel = 'Enregistrer' }: EntrepriseFormProps) {
  const [nom, setNom] = useState(initial?.nom ?? '')
  const [secteur, setSecteur] = useState(initial?.secteur ?? '')
  const [chiffreAffaires, setChiffreAffaires] = useState(initial?.chiffre_affaires?.toString() ?? '')
  const [effectif, setEffectif] = useState(initial?.effectif?.toString() ?? '')
  const [adresse, setAdresse] = useState(initial?.adresse ?? '')
  const [siteWeb, setSiteWeb] = useState(initial?.site_web ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!nom.trim()) {
      setError('Le nom est obligatoire.')
      return
    }

    const data: EntrepriseInsert = {
      nom: nom.trim(),
      secteur: secteur.trim() || null,
      chiffre_affaires: chiffreAffaires ? Number(chiffreAffaires) : null,
      effectif: effectif ? Number(effectif) : null,
      adresse: adresse.trim() || null,
      site_web: siteWeb.trim() || null,
      proprietaire_id: initial?.proprietaire_id ?? null,
    }

    if (data.chiffre_affaires != null && isNaN(data.chiffre_affaires)) {
      setError('Le chiffre d\'affaires doit être un nombre.')
      return
    }
    if (data.effectif != null && (isNaN(data.effectif) || data.effectif < 0)) {
      setError('L\'effectif doit être un nombre positif.')
      return
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Field label="Nom *" id="nom">
        <input
          id="nom"
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="input"
          required
        />
      </Field>

      <Field label="Secteur" id="secteur">
        <input
          id="secteur"
          type="text"
          value={secteur}
          onChange={(e) => setSecteur(e.target.value)}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Chiffre d'affaires (€)" id="ca">
          <input
            id="ca"
            type="number"
            min="0"
            step="1"
            value={chiffreAffaires}
            onChange={(e) => setChiffreAffaires(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Effectif" id="effectif">
          <input
            id="effectif"
            type="number"
            min="0"
            step="1"
            value={effectif}
            onChange={(e) => setEffectif(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Adresse" id="adresse">
        <input
          id="adresse"
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Site web" id="site_web">
        <input
          id="site_web"
          type="text"
          value={siteWeb}
          onChange={(e) => setSiteWeb(e.target.value)}
          placeholder="https://…"
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
