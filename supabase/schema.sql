-- ============================================
-- CRM Sales — Schéma de base de données
-- ============================================

-- Nettoyage : suppression dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS activites CASCADE;
DROP TABLE IF EXISTS opportunites CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS entreprises CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- Types énumérés
DROP TYPE IF EXISTS role_utilisateur CASCADE;
DROP TYPE IF EXISTS statut_opportunite CASCADE;
DROP TYPE IF EXISTS type_activite CASCADE;

CREATE TYPE role_utilisateur AS ENUM ('admin', 'commercial');

CREATE TYPE statut_opportunite AS ENUM (
  'prospection',
  'qualification',
  'proposition',
  'negociation',
  'gagne',
  'perdu'
);

CREATE TYPE type_activite AS ENUM (
  'appel',
  'email',
  'reunion',
  'note',
  'tache'
);

-- ============================================
-- Table : utilisateurs
-- ============================================
CREATE TABLE utilisateurs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL UNIQUE,
  nom        text NOT NULL,
  role       role_utilisateur NOT NULL DEFAULT 'commercial',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- Table : entreprises
-- ============================================
CREATE TABLE entreprises (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom              text NOT NULL,
  secteur          text,
  chiffre_affaires numeric,
  effectif         integer,
  adresse          text,
  site_web         text,
  proprietaire_id  uuid REFERENCES utilisateurs(id),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- Table : contacts
-- ============================================
CREATE TABLE contacts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom          text NOT NULL,
  nom             text NOT NULL,
  fonction        text,
  email           text,
  telephone       text,
  est_principal   boolean NOT NULL DEFAULT false,
  entreprise_id   uuid REFERENCES entreprises(id) ON DELETE SET NULL,
  proprietaire_id uuid REFERENCES utilisateurs(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- Table : opportunites
-- ============================================
CREATE TABLE opportunites (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre                text NOT NULL,
  montant              numeric,
  statut               statut_opportunite NOT NULL DEFAULT 'prospection',
  probabilite          integer CHECK (probabilite >= 0 AND probabilite <= 100),
  date_cloture_prevue  date,
  date_cloture_reelle  date,
  entreprise_id        uuid NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  contact_principal_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  proprietaire_id      uuid REFERENCES utilisateurs(id),
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- Table : activites
-- ============================================
CREATE TABLE activites (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type             type_activite NOT NULL,
  sujet            text NOT NULL,
  description      text,
  date_echeance    date,
  date_realisation date,
  est_fait         boolean NOT NULL DEFAULT false,
  entreprise_id    uuid REFERENCES entreprises(id) ON DELETE SET NULL,
  contact_id       uuid REFERENCES contacts(id) ON DELETE SET NULL,
  opportunite_id   uuid REFERENCES opportunites(id) ON DELETE SET NULL,
  proprietaire_id  uuid REFERENCES utilisateurs(id),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT activite_au_moins_un_lien CHECK (
    entreprise_id IS NOT NULL
    OR contact_id IS NOT NULL
    OR opportunite_id IS NOT NULL
  )
);

-- ============================================
-- Index pour les clés étrangères et recherches fréquentes
-- ============================================
CREATE INDEX idx_entreprises_proprietaire ON entreprises(proprietaire_id);
CREATE INDEX idx_contacts_entreprise      ON contacts(entreprise_id);
CREATE INDEX idx_contacts_proprietaire    ON contacts(proprietaire_id);
CREATE INDEX idx_opportunites_entreprise  ON opportunites(entreprise_id);
CREATE INDEX idx_opportunites_contact     ON opportunites(contact_principal_id);
CREATE INDEX idx_opportunites_proprietaire ON opportunites(proprietaire_id);
CREATE INDEX idx_opportunites_statut      ON opportunites(statut);
CREATE INDEX idx_activites_entreprise     ON activites(entreprise_id);
CREATE INDEX idx_activites_contact        ON activites(contact_id);
CREATE INDEX idx_activites_opportunite    ON activites(opportunite_id);
CREATE INDEX idx_activites_proprietaire   ON activites(proprietaire_id);
CREATE INDEX idx_activites_date_echeance  ON activites(date_echeance);

-- ============================================
-- Trigger : mise à jour automatique de updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_entreprises_updated_at
  BEFORE UPDATE ON entreprises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_opportunites_updated_at
  BEFORE UPDATE ON opportunites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_activites_updated_at
  BEFORE UPDATE ON activites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
