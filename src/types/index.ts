// ============================================
// CRM Sales — Types TypeScript
// ============================================

// --- Enums ---

export type RoleUtilisateur = 'admin' | 'commercial'

export type StatutOpportunite =
  | 'prospection'
  | 'qualification'
  | 'proposition'
  | 'negociation'
  | 'gagne'
  | 'perdu'

export type TypeActivite = 'appel' | 'email' | 'reunion' | 'note' | 'tache'

// --- Entités ---

export interface Utilisateur {
  id: string
  email: string
  nom: string
  role: RoleUtilisateur
  created_at: string
}

export interface Entreprise {
  id: string
  nom: string
  secteur: string | null
  chiffre_affaires: number | null
  effectif: number | null
  adresse: string | null
  site_web: string | null
  proprietaire_id: string | null
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  prenom: string
  nom: string
  fonction: string | null
  email: string | null
  telephone: string | null
  est_principal: boolean
  entreprise_id: string | null
  proprietaire_id: string | null
  created_at: string
  updated_at: string
}

export interface Opportunite {
  id: string
  titre: string
  montant: number | null
  statut: StatutOpportunite
  probabilite: number | null
  date_cloture_prevue: string | null
  date_cloture_reelle: string | null
  entreprise_id: string
  contact_principal_id: string | null
  proprietaire_id: string | null
  created_at: string
  updated_at: string
}

export interface Activite {
  id: string
  type: TypeActivite
  sujet: string
  description: string | null
  date_echeance: string | null
  date_realisation: string | null
  est_fait: boolean
  entreprise_id: string | null
  contact_id: string | null
  opportunite_id: string | null
  proprietaire_id: string | null
  created_at: string
  updated_at: string
}

// --- Types pour les formulaires (champs sans id ni timestamps) ---

export type EntrepriseInsert = Omit<Entreprise, 'id' | 'created_at' | 'updated_at'>
export type EntrepriseUpdate = Partial<EntrepriseInsert>

export type ContactInsert = Omit<Contact, 'id' | 'created_at' | 'updated_at'>
export type ContactUpdate = Partial<ContactInsert>

export type OpportuniteInsert = Omit<Opportunite, 'id' | 'created_at' | 'updated_at'>
export type OpportuniteUpdate = Partial<OpportuniteInsert>

export type ActiviteInsert = Omit<Activite, 'id' | 'created_at' | 'updated_at'>
export type ActiviteUpdate = Partial<ActiviteInsert>

export type UtilisateurInsert = Omit<Utilisateur, 'id' | 'created_at'>
export type UtilisateurUpdate = Partial<UtilisateurInsert>
