import { useState, useEffect, useCallback } from 'react'
import type {
  Utilisateur, UtilisateurInsert,
  Entreprise, EntrepriseInsert,
  Contact, ContactInsert,
  Opportunite, OpportuniteInsert,
  Activite, ActiviteInsert,
  RoleUtilisateur, StatutOpportunite, TypeActivite,
} from '../types'
import * as utilisateursService from '../services/utilisateurs'
import * as entreprisesService from '../services/entreprises'
import * as contactsService from '../services/contacts'
import * as opportunitesService from '../services/opportunites'
import * as activitesService from '../services/activites'

// ============================================
// Constantes
// ============================================
const TABS = ['Utilisateurs', 'Entreprises', 'Contacts', 'Opportunités', 'Activités'] as const
const ROLES: RoleUtilisateur[] = ['admin', 'commercial']
const STATUTS: StatutOpportunite[] = ['prospection', 'qualification', 'proposition', 'negociation', 'gagne', 'perdu']
const TYPES_ACTIVITE: TypeActivite[] = ['appel', 'email', 'reunion', 'note', 'tache']

// ============================================
// Composants utilitaires
// ============================================
function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded bg-red-100 px-4 py-2 text-sm text-red-700">
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 font-bold">✕</button>
    </div>
  )
}

function Spinner() {
  return <div className="py-8 text-center text-gray-500">Chargement…</div>
}

// ============================================
// Onglet Utilisateurs
// ============================================
function UtilisateursTab() {
  const [rows, setRows] = useState<Utilisateur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const emptyForm: UtilisateurInsert = { email: '', nom: '', role: 'commercial' }
  const [form, setForm] = useState<UtilisateurInsert>(emptyForm)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setRows(await utilisateursService.getUtilisateurs())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await utilisateursService.updateUtilisateur(editId, form)
        setEditId(null)
      } else {
        await utilisateursService.createUtilisateur(form)
      }
      setForm(emptyForm)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const startEdit = (u: Utilisateur) => {
    setEditId(u.id)
    setForm({ email: u.email, nom: u.nom, role: u.role })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await utilisateursService.deleteUtilisateur(id)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-3 rounded border bg-white p-4 sm:grid-cols-4">
        <input className="rounded border px-3 py-2" placeholder="Nom *" required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
        <input className="rounded border px-3 py-2" placeholder="Email *" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <select className="rounded border px-3 py-2" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as RoleUtilisateur })}>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">{editId ? 'Modifier' : 'Créer'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm) }} className="rounded border px-4 py-2 hover:bg-gray-100">Annuler</button>}
        </div>
      </form>

      {loading ? <Spinner /> : (
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rôle</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{u.nom}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2"><span className="rounded bg-gray-200 px-2 py-0.5 text-xs">{u.role}</span></td>
                <td className="px-4 py-2">
                  <button onClick={() => startEdit(u)} className="mr-2 text-blue-600 hover:underline">Modifier</button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="px-4 py-4 text-center text-gray-400">Aucun utilisateur</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ============================================
// Onglet Entreprises
// ============================================
function EntreprisesTab({ utilisateurs }: { utilisateurs: Utilisateur[] }) {
  const [rows, setRows] = useState<Entreprise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const emptyForm: EntrepriseInsert = { nom: '', secteur: null, chiffre_affaires: null, effectif: null, adresse: null, site_web: null, proprietaire_id: null }
  const [form, setForm] = useState<EntrepriseInsert>(emptyForm)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setRows(await entreprisesService.getEntreprises())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await entreprisesService.updateEntreprise(editId, form)
        setEditId(null)
      } else {
        await entreprisesService.createEntreprise(form)
      }
      setForm(emptyForm)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const startEdit = (ent: Entreprise) => {
    setEditId(ent.id)
    setForm({ nom: ent.nom, secteur: ent.secteur, chiffre_affaires: ent.chiffre_affaires, effectif: ent.effectif, adresse: ent.adresse, site_web: ent.site_web, proprietaire_id: ent.proprietaire_id })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette entreprise ?')) return
    try {
      await entreprisesService.deleteEntreprise(id)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-3 rounded border bg-white p-4 sm:grid-cols-3">
        <input className="rounded border px-3 py-2" placeholder="Nom *" required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
        <input className="rounded border px-3 py-2" placeholder="Secteur" value={form.secteur ?? ''} onChange={e => setForm({ ...form, secteur: e.target.value || null })} />
        <input className="rounded border px-3 py-2" placeholder="Chiffre d'affaires" type="number" value={form.chiffre_affaires ?? ''} onChange={e => setForm({ ...form, chiffre_affaires: e.target.value ? Number(e.target.value) : null })} />
        <input className="rounded border px-3 py-2" placeholder="Effectif" type="number" value={form.effectif ?? ''} onChange={e => setForm({ ...form, effectif: e.target.value ? Number(e.target.value) : null })} />
        <input className="rounded border px-3 py-2" placeholder="Adresse" value={form.adresse ?? ''} onChange={e => setForm({ ...form, adresse: e.target.value || null })} />
        <input className="rounded border px-3 py-2" placeholder="Site web" value={form.site_web ?? ''} onChange={e => setForm({ ...form, site_web: e.target.value || null })} />
        <select className="rounded border px-3 py-2" value={form.proprietaire_id ?? ''} onChange={e => setForm({ ...form, proprietaire_id: e.target.value || null })}>
          <option value="">Propriétaire…</option>
          {utilisateurs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">{editId ? 'Modifier' : 'Créer'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm) }} className="rounded border px-4 py-2 hover:bg-gray-100">Annuler</button>}
        </div>
      </form>

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Secteur</th>
                <th className="px-4 py-2">CA</th>
                <th className="px-4 py-2">Effectif</th>
                <th className="px-4 py-2">Propriétaire</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(ent => (
                <tr key={ent.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{ent.nom}</td>
                  <td className="px-4 py-2">{ent.secteur ?? '—'}</td>
                  <td className="px-4 py-2">{ent.chiffre_affaires != null ? `${(ent.chiffre_affaires / 1_000_000).toFixed(1)} M€` : '—'}</td>
                  <td className="px-4 py-2">{ent.effectif ?? '—'}</td>
                  <td className="px-4 py-2">{utilisateurs.find(u => u.id === ent.proprietaire_id)?.nom ?? '—'}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => startEdit(ent)} className="mr-2 text-blue-600 hover:underline">Modifier</button>
                    <button onClick={() => handleDelete(ent.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-4 text-center text-gray-400">Aucune entreprise</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================
// Onglet Contacts
// ============================================
function ContactsTab({ utilisateurs, entreprises }: { utilisateurs: Utilisateur[]; entreprises: Entreprise[] }) {
  const [rows, setRows] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const emptyForm: ContactInsert = { prenom: '', nom: '', fonction: null, email: null, telephone: null, est_principal: false, entreprise_id: null, proprietaire_id: null }
  const [form, setForm] = useState<ContactInsert>(emptyForm)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setRows(await contactsService.getContacts())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await contactsService.updateContact(editId, form)
        setEditId(null)
      } else {
        await contactsService.createContact(form)
      }
      setForm(emptyForm)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const startEdit = (c: Contact) => {
    setEditId(c.id)
    setForm({ prenom: c.prenom, nom: c.nom, fonction: c.fonction, email: c.email, telephone: c.telephone, est_principal: c.est_principal, entreprise_id: c.entreprise_id, proprietaire_id: c.proprietaire_id })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce contact ?')) return
    try {
      await contactsService.deleteContact(id)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-3 rounded border bg-white p-4 sm:grid-cols-3">
        <input className="rounded border px-3 py-2" placeholder="Prénom *" required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} />
        <input className="rounded border px-3 py-2" placeholder="Nom *" required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
        <input className="rounded border px-3 py-2" placeholder="Fonction" value={form.fonction ?? ''} onChange={e => setForm({ ...form, fonction: e.target.value || null })} />
        <input className="rounded border px-3 py-2" placeholder="Email" type="email" value={form.email ?? ''} onChange={e => setForm({ ...form, email: e.target.value || null })} />
        <input className="rounded border px-3 py-2" placeholder="Téléphone" value={form.telephone ?? ''} onChange={e => setForm({ ...form, telephone: e.target.value || null })} />
        <select className="rounded border px-3 py-2" value={form.entreprise_id ?? ''} onChange={e => setForm({ ...form, entreprise_id: e.target.value || null })}>
          <option value="">Entreprise…</option>
          {entreprises.map(ent => <option key={ent.id} value={ent.id}>{ent.nom}</option>)}
        </select>
        <select className="rounded border px-3 py-2" value={form.proprietaire_id ?? ''} onChange={e => setForm({ ...form, proprietaire_id: e.target.value || null })}>
          <option value="">Propriétaire…</option>
          {utilisateurs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
        </select>
        <label className="flex items-center gap-2 px-3 py-2">
          <input type="checkbox" checked={form.est_principal} onChange={e => setForm({ ...form, est_principal: e.target.checked })} />
          Contact principal
        </label>
        <div className="flex gap-2">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">{editId ? 'Modifier' : 'Créer'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm) }} className="rounded border px-4 py-2 hover:bg-gray-100">Annuler</button>}
        </div>
      </form>

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Fonction</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Téléphone</th>
                <th className="px-4 py-2">Entreprise</th>
                <th className="px-4 py-2">Principal</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{c.prenom} {c.nom}</td>
                  <td className="px-4 py-2">{c.fonction ?? '—'}</td>
                  <td className="px-4 py-2">{c.email ?? '—'}</td>
                  <td className="px-4 py-2">{c.telephone ?? '—'}</td>
                  <td className="px-4 py-2">{entreprises.find(ent => ent.id === c.entreprise_id)?.nom ?? <span className="italic text-gray-400">Non rattaché</span>}</td>
                  <td className="px-4 py-2">{c.est_principal ? <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Oui</span> : '—'}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => startEdit(c)} className="mr-2 text-blue-600 hover:underline">Modifier</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={7} className="px-4 py-4 text-center text-gray-400">Aucun contact</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================
// Onglet Opportunités
// ============================================
function OpportunitesTab({ utilisateurs, entreprises, contacts }: { utilisateurs: Utilisateur[]; entreprises: Entreprise[]; contacts: Contact[] }) {
  const [rows, setRows] = useState<Opportunite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const emptyForm: OpportuniteInsert = { titre: '', montant: null, statut: 'prospection', probabilite: null, date_cloture_prevue: null, date_cloture_reelle: null, entreprise_id: '', contact_principal_id: null, proprietaire_id: null }
  const [form, setForm] = useState<OpportuniteInsert>(emptyForm)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setRows(await opportunitesService.getOpportunites())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await opportunitesService.updateOpportunite(editId, form)
        setEditId(null)
      } else {
        await opportunitesService.createOpportunite(form)
      }
      setForm(emptyForm)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const startEdit = (o: Opportunite) => {
    setEditId(o.id)
    setForm({ titre: o.titre, montant: o.montant, statut: o.statut, probabilite: o.probabilite, date_cloture_prevue: o.date_cloture_prevue, date_cloture_reelle: o.date_cloture_reelle, entreprise_id: o.entreprise_id, contact_principal_id: o.contact_principal_id, proprietaire_id: o.proprietaire_id })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette opportunité ?')) return
    try {
      await opportunitesService.deleteOpportunite(id)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const contactsForEntreprise = contacts.filter(c => c.entreprise_id === form.entreprise_id)

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-3 rounded border bg-white p-4 sm:grid-cols-3">
        <input className="rounded border px-3 py-2" placeholder="Titre *" required value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} />
        <select className="rounded border px-3 py-2" required value={form.entreprise_id} onChange={e => setForm({ ...form, entreprise_id: e.target.value, contact_principal_id: null })}>
          <option value="">Entreprise *</option>
          {entreprises.map(ent => <option key={ent.id} value={ent.id}>{ent.nom}</option>)}
        </select>
        <select className="rounded border px-3 py-2" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value as StatutOpportunite })}>
          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="rounded border px-3 py-2" placeholder="Montant (€)" type="number" value={form.montant ?? ''} onChange={e => setForm({ ...form, montant: e.target.value ? Number(e.target.value) : null })} />
        <input className="rounded border px-3 py-2" placeholder="Probabilité (0-100)" type="number" min={0} max={100} value={form.probabilite ?? ''} onChange={e => setForm({ ...form, probabilite: e.target.value ? Number(e.target.value) : null })} />
        <select className="rounded border px-3 py-2" value={form.contact_principal_id ?? ''} onChange={e => setForm({ ...form, contact_principal_id: e.target.value || null })}>
          <option value="">Contact principal…</option>
          {contactsForEntreprise.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
        </select>
        <input className="rounded border px-3 py-2" placeholder="Date clôture prévue" type="date" value={form.date_cloture_prevue ?? ''} onChange={e => setForm({ ...form, date_cloture_prevue: e.target.value || null })} />
        <select className="rounded border px-3 py-2" value={form.proprietaire_id ?? ''} onChange={e => setForm({ ...form, proprietaire_id: e.target.value || null })}>
          <option value="">Propriétaire…</option>
          {utilisateurs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">{editId ? 'Modifier' : 'Créer'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm) }} className="rounded border px-4 py-2 hover:bg-gray-100">Annuler</button>}
        </div>
      </form>

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Titre</th>
                <th className="px-4 py-2">Entreprise</th>
                <th className="px-4 py-2">Montant</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Prob.</th>
                <th className="px-4 py-2">Date clôture</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(o => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{o.titre}</td>
                  <td className="px-4 py-2">{entreprises.find(ent => ent.id === o.entreprise_id)?.nom ?? '—'}</td>
                  <td className="px-4 py-2">{o.montant != null ? `${o.montant.toLocaleString('fr-FR')} €` : '—'}</td>
                  <td className="px-4 py-2"><span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{o.statut}</span></td>
                  <td className="px-4 py-2">{o.probabilite != null ? `${o.probabilite} %` : '—'}</td>
                  <td className="px-4 py-2">{o.date_cloture_reelle ?? o.date_cloture_prevue ?? '—'}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => startEdit(o)} className="mr-2 text-blue-600 hover:underline">Modifier</button>
                    <button onClick={() => handleDelete(o.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={7} className="px-4 py-4 text-center text-gray-400">Aucune opportunité</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================
// Onglet Activités
// ============================================
function ActivitesTab({ utilisateurs, entreprises, contacts, opportunites }: { utilisateurs: Utilisateur[]; entreprises: Entreprise[]; contacts: Contact[]; opportunites: Opportunite[] }) {
  const [rows, setRows] = useState<Activite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const emptyForm: ActiviteInsert = { type: 'appel', sujet: '', description: null, date_echeance: null, date_realisation: null, est_fait: false, entreprise_id: null, contact_id: null, opportunite_id: null, proprietaire_id: null }
  const [form, setForm] = useState<ActiviteInsert>(emptyForm)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setRows(await activitesService.getActivites())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.entreprise_id && !form.contact_id && !form.opportunite_id) {
      setError('Au moins un lien (entreprise, contact ou opportunité) est obligatoire.')
      return
    }
    try {
      if (editId) {
        await activitesService.updateActivite(editId, form)
        setEditId(null)
      } else {
        await activitesService.createActivite(form)
      }
      setForm(emptyForm)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const startEdit = (a: Activite) => {
    setEditId(a.id)
    setForm({ type: a.type, sujet: a.sujet, description: a.description, date_echeance: a.date_echeance, date_realisation: a.date_realisation, est_fait: a.est_fait, entreprise_id: a.entreprise_id, contact_id: a.contact_id, opportunite_id: a.opportunite_id, proprietaire_id: a.proprietaire_id })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette activité ?')) return
    try {
      await activitesService.deleteActivite(id)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const typeIcons: Record<TypeActivite, string> = { appel: 'Tel', email: 'Mail', reunion: 'Meet', note: 'Note', tache: 'Task' }

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-3 rounded border bg-white p-4 sm:grid-cols-3">
        <select className="rounded border px-3 py-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as TypeActivite })}>
          {TYPES_ACTIVITE.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input className="rounded border px-3 py-2 sm:col-span-2" placeholder="Sujet *" required value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} />
        <textarea className="rounded border px-3 py-2 sm:col-span-3" placeholder="Description" rows={2} value={form.description ?? ''} onChange={e => setForm({ ...form, description: e.target.value || null })} />
        <select className="rounded border px-3 py-2" value={form.entreprise_id ?? ''} onChange={e => setForm({ ...form, entreprise_id: e.target.value || null })}>
          <option value="">Entreprise…</option>
          {entreprises.map(ent => <option key={ent.id} value={ent.id}>{ent.nom}</option>)}
        </select>
        <select className="rounded border px-3 py-2" value={form.contact_id ?? ''} onChange={e => setForm({ ...form, contact_id: e.target.value || null })}>
          <option value="">Contact…</option>
          {contacts.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
        </select>
        <select className="rounded border px-3 py-2" value={form.opportunite_id ?? ''} onChange={e => setForm({ ...form, opportunite_id: e.target.value || null })}>
          <option value="">Opportunité…</option>
          {opportunites.map(o => <option key={o.id} value={o.id}>{o.titre}</option>)}
        </select>
        <input className="rounded border px-3 py-2" type="date" value={form.date_echeance ?? ''} onChange={e => setForm({ ...form, date_echeance: e.target.value || null })} />
        <select className="rounded border px-3 py-2" value={form.proprietaire_id ?? ''} onChange={e => setForm({ ...form, proprietaire_id: e.target.value || null })}>
          <option value="">Propriétaire…</option>
          {utilisateurs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
        </select>
        <label className="flex items-center gap-2 px-3 py-2">
          <input type="checkbox" checked={form.est_fait} onChange={e => setForm({ ...form, est_fait: e.target.checked })} />
          Fait
        </label>
        <div className="flex gap-2 sm:col-span-3">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">{editId ? 'Modifier' : 'Créer'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm) }} className="rounded border px-4 py-2 hover:bg-gray-100">Annuler</button>}
        </div>
      </form>

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Sujet</th>
                <th className="px-4 py-2">Entités liées</th>
                <th className="px-4 py-2">Échéance</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(a => {
                const liens: string[] = []
                if (a.entreprise_id) liens.push(entreprises.find(ent => ent.id === a.entreprise_id)?.nom ?? '?')
                if (a.contact_id) { const c = contacts.find(ct => ct.id === a.contact_id); if (c) liens.push(`${c.prenom} ${c.nom}`) }
                if (a.opportunite_id) liens.push(opportunites.find(o => o.id === a.opportunite_id)?.titre ?? '?')
                return (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2"><span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700">{typeIcons[a.type]}</span></td>
                    <td className="px-4 py-2 font-medium">{a.sujet}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{liens.join(' · ') || '—'}</td>
                    <td className="px-4 py-2">{a.date_echeance ?? '—'}</td>
                    <td className="px-4 py-2">{a.est_fait
                      ? <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Fait</span>
                      : <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">À faire</span>}
                    </td>
                    <td className="px-4 py-2">
                      <button onClick={() => startEdit(a)} className="mr-2 text-blue-600 hover:underline">Modifier</button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline">Supprimer</button>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-4 text-center text-gray-400">Aucune activité</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================
// Page principale TestCrud
// ============================================
export default function TestCrud() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Utilisateurs')
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [opportunites, setOpportunites] = useState<Opportunite[]>([])

  // Charger les données de référence pour les select
  useEffect(() => {
    utilisateursService.getUtilisateurs().then(setUtilisateurs).catch(() => {})
    entreprisesService.getEntreprises().then(setEntreprises).catch(() => {})
    contactsService.getContacts().then(setContacts).catch(() => {})
    opportunitesService.getOpportunites().then(setOpportunites).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Test CRUD</h1>

        {/* Onglets */}
        <div className="mb-6 flex gap-1 border-b">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenu de l'onglet actif */}
        {activeTab === 'Utilisateurs' && <UtilisateursTab />}
        {activeTab === 'Entreprises' && <EntreprisesTab utilisateurs={utilisateurs} />}
        {activeTab === 'Contacts' && <ContactsTab utilisateurs={utilisateurs} entreprises={entreprises} />}
        {activeTab === 'Opportunités' && <OpportunitesTab utilisateurs={utilisateurs} entreprises={entreprises} contacts={contacts} />}
        {activeTab === 'Activités' && <ActivitesTab utilisateurs={utilisateurs} entreprises={entreprises} contacts={contacts} opportunites={opportunites} />}
      </div>
    </div>
  )
}
