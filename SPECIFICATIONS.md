# CRM Sales — Cahier des charges complet
## 1. Contexte et objectifs
### Objectif du projet
Construire un CRM B2B orienté ventes, à usage personnel. Ce projet sert également de banc d'essai pour évaluer la programmation assistée par Claude Code comme outil de développement de MVP.
### Utilisateur cible
Un utilisateur unique (le commanditaire), avec possibilité d'ajouter un second utilisateur pour tester la notion de propriétaire des données.
---
## 2. Stack technique
| Couche | Technologie |
|--------|-------------|
| Front-end | React + TypeScript |
| Styling | Tailwind CSS |
| Back-end | Supabase (PostgreSQL managé) |
| Authentification | Supabase Auth (à implémenter en dernier) |
### Conventions de code
- TypeScript obligatoire
- Composants fonctionnels avec hooks
- Conventions Tailwind par défaut
---
## 3. Structure du projet
```
crm-sales/
├── src/
│   ├── components/
│   │   ├── ui/                    # Composants génériques réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/                # Structure générale de l'application
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── entreprises/           # Composants métier Entreprises
│   │   │   ├── EntrepriseList.tsx
│   │   │   ├── EntrepriseCard.tsx
│   │   │   ├── EntrepriseForm.tsx
│   │   │   └── EntrepriseDetail.tsx
│   │   ├── contacts/              # Composants métier Contacts
│   │   │   ├── ContactList.tsx
│   │   │   ├── ContactCard.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── ContactDetail.tsx
│   │   ├── opportunites/          # Composants métier Opportunités
│   │   │   ├── OpportuniteList.tsx
│   │   │   ├── OpportuniteCard.tsx
│   │   │   ├── OpportuniteForm.tsx
│   │   │   ├── OpportuniteDetail.tsx
│   │   │   └── PipelineBoard.tsx
│   │   └── activites/             # Composants métier Activités
│   │       ├── ActiviteList.tsx
│   │       ├── ActiviteForm.tsx
│   │       └── Timeline.tsx
│   ├── pages/                     # Vues principales (écrans)
│   │   ├── Dashboard.tsx
│   │   ├── EntreprisesPage.tsx
│   │   ├── ContactsPage.tsx
│   │   ├── OpportunitesPage.tsx
│   │   ├── PipelinePage.tsx
│   │   ├── ActivitesPage.tsx
│   │   └── TestCrud.tsx
│   ├── services/                  # Communication avec Supabase
│   │   ├── supabase.ts
│   │   ├── entreprises.ts
│   │   ├── contacts.ts
│   │   ├── opportunites.ts
│   │   ├── activites.ts
│   │   └── utilisateurs.ts
│   ├── types/                     # Définitions TypeScript
│   │   └── index.ts
│   ├── hooks/                     # Hooks React réutilisables
│   │   ├── useEntreprises.ts
│   │   ├── useContacts.ts
│   │   ├── useOpportunites.ts
│   │   └── useActivites.ts
│   ├── utils/                     # Fonctions utilitaires
│   │   └── helpers.ts
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── schema.sql                 # Script de création des tables
│   └── seed.sql                   # Script d'insertion des données de test
├── .env.example                   # Variables d'environnement (template)
├── .env                           # Variables d'environnement (non versionné)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```
---
## 4. Modèle de données
### 4.1 Entité Utilisateur
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | uuid | PK, auto-généré |
| email | text | unique, obligatoire |
| nom | text | obligatoire |
| role | enum | valeurs : admin, commercial |
| created_at | timestamp | auto |
### 4.2 Entité Entreprise
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | uuid | PK, auto-généré |
| nom | text | obligatoire |
| secteur | text | optionnel |
| chiffre_affaires | numeric | optionnel |
| effectif | integer | optionnel |
| adresse | text | optionnel |
| site_web | text | optionnel |
| proprietaire_id | uuid | FK → Utilisateur |
| created_at | timestamp | auto |
| updated_at | timestamp | auto |
### 4.3 Entité Contact
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | uuid | PK, auto-généré |
| prenom | text | obligatoire |
| nom | text | obligatoire |
| fonction | text | optionnel |
| email | text | optionnel |
| telephone | text | optionnel |
| est_principal | boolean | défaut : false |
| entreprise_id | uuid | FK → Entreprise, optionnel |
| proprietaire_id | uuid | FK → Utilisateur |
| created_at | timestamp | auto |
| updated_at | timestamp | auto |
### 4.4 Entité Opportunité
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | uuid | PK, auto-généré |
| titre | text | obligatoire |
| montant | numeric | optionnel |
| statut | enum | valeurs : prospection, qualification, proposition, negociation, gagne, perdu |
| probabilite | integer | optionnel (0-100) |
| date_cloture_prevue | date | optionnel |
| date_cloture_reelle | date | optionnel |
| entreprise_id | uuid | FK → Entreprise, obligatoire |
| contact_principal_id | uuid | FK → Contact, optionnel |
| proprietaire_id | uuid | FK → Utilisateur |
| created_at | timestamp | auto |
| updated_at | timestamp | auto |
### 4.5 Entité Activité
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | uuid | PK, auto-généré |
| type | enum | valeurs : appel, email, reunion, note, tache |
| sujet | text | obligatoire |
| description | text | optionnel |
| date_echeance | date | optionnel |
| date_realisation | date | optionnel |
| est_fait | boolean | défaut : false |
| entreprise_id | uuid | FK → Entreprise, optionnel |
| contact_id | uuid | FK → Contact, optionnel |
| opportunite_id | uuid | FK → Opportunité, optionnel |
| proprietaire_id | uuid | FK → Utilisateur |
| created_at | timestamp | auto |
| updated_at | timestamp | auto |
### 4.6 Schéma des relations
```
Utilisateur (1) ──────< (N) Entreprise
Utilisateur (1) ──────< (N) Contact
Utilisateur (1) ──────< (N) Opportunité
Utilisateur (1) ──────< (N) Activité
Entreprise (1) ──────< (N) Contact
Entreprise (1) ──────< (N) Opportunité
Entreprise (1) ──────< (N) Activité
Contact (1) ──────< (N) Opportunité (comme contact_principal)
Contact (1) ──────< (N) Activité
Opportunité (1) ──────< (N) Activité
```
---
## 5. Règles de gestion
### 5.1 Règles de suppression
**Entreprise**
- Suppression autorisée
- Les contacts liés deviennent orphelins (entreprise_id → null)
- Les opportunités liées sont supprimées en cascade
- Les activités liées uniquement à cette entreprise sont supprimées
- Les activités liées aussi à un contact ou une opportunité sont conservées
- Message de confirmation requis avant suppression
**Contact**
- Suppression interdite si le contact est contact_principal d'une opportunité
- Message d'erreur explicite indiquant les opportunités concernées
- Les activités liées uniquement à ce contact sont supprimées
**Opportunité**
- Suppression autorisée
- Les activités liées uniquement à cette opportunité sont supprimées
**Activité**
- Suppression autorisée sans contrainte
### 5.2 Règles de validation des formulaires
**Entreprise**
- nom : obligatoire
**Contact**
- prenom : obligatoire
- nom : obligatoire
- entreprise_id : optionnel
**Opportunité**
- titre : obligatoire
- entreprise_id : obligatoire
- statut : obligatoire, défaut "prospection"
**Activité**
- type : obligatoire
- sujet : obligatoire
- Au moins un lien obligatoire (entreprise_id, contact_id ou opportunite_id)
### 5.3 Règles de gestion du pipeline
- Passage au statut "gagne" ou "perdu" : date_cloture_reelle renseignée automatiquement avec la date du jour
- Retour à un statut antérieur (de "perdu" vers "negociation" par exemple) : date_cloture_reelle effacée
### 5.4 Règles du contact principal
**Par entreprise**
- Un seul contact peut être marqué est_principal = true par entreprise
- Désigner un nouveau contact principal retire automatiquement ce statut à l'ancien
**Lors d'un changement d'entreprise du contact**
- Le statut est_principal est retiré automatiquement
- Le rôle de contact_principal sur les opportunités de l'ancienne entreprise est retiré automatiquement (contact_principal_id → null sur ces opportunités)
---
## 6. Description des écrans
### 6.1 Dashboard
Page d'accueil après connexion.
**Contenu :**
- Compteurs : nombre d'opportunités en cours, montant total pondéré
- Liste des 10 prochaines activités à faire (triées par date_echeance)
- Liste des 5 dernières opportunités modifiées
- Liens rapides vers chaque section
### 6.2 Liste des entreprises
**Contenu :**
- Tableau avec colonnes : nom, secteur, effectif, nombre de contacts, nombre d'opportunités
- Barre de recherche filtrant par nom
- Bouton "Nouvelle entreprise"
- Clic sur une ligne → fiche entreprise
### 6.3 Fiche entreprise
**Contenu :**
- En-tête : nom, secteur, chiffre d'affaires, effectif, adresse, site web
- Boutons : modifier, supprimer
- Section "Contacts" : liste des contacts de cette entreprise, bouton ajouter
- Section "Opportunités" : liste des opportunités liées, bouton ajouter
- Section "Activités" : timeline des activités, bouton ajouter
### 6.4 Liste des contacts
**Contenu :**
- Tableau avec colonnes : nom, prénom, fonction, entreprise (lien ou "Non rattaché"), email, téléphone
- Barre de recherche filtrant par nom ou entreprise
- Bouton "Nouveau contact"
- Clic sur une ligne → fiche contact
### 6.5 Fiche contact
**Contenu :**
- En-tête : prénom, nom, fonction, email, téléphone, badge "Contact principal" si applicable
- Lien vers l'entreprise (cliquable)
- Boutons : modifier, supprimer
- Section "Opportunités" : liste des opportunités où ce contact est contact principal
- Section "Activités" : timeline des activités, bouton ajouter
### 6.6 Liste des opportunités
**Contenu :**
- Tableau avec colonnes : titre, entreprise (lien), montant, statut, probabilité, date clôture prévue
- Barre de recherche filtrant par titre ou entreprise
- Filtre par statut
- Bouton "Nouvelle opportunité"
- Clic sur une ligne → fiche opportunité
### 6.7 Fiche opportunité
**Contenu :**
- En-tête : titre, montant, statut (modifiable directement), probabilité, dates de clôture
- Liens vers entreprise et contact principal (cliquables)
- Boutons : modifier, supprimer
- Section "Activités" : timeline des activités, bouton ajouter
### 6.8 Pipeline (vue kanban)
**Contenu :**
- Une colonne par statut : Prospection, Qualification, Proposition, Négociation, Gagné, Perdu
- Chaque opportunité = une carte (titre, entreprise, montant)
- Glisser-déposer pour changer de statut
- Clic sur une carte → fiche opportunité
- En bas de chaque colonne : nombre d'opportunités et montant total
### 6.9 Liste des activités
**Contenu :**
- Tableau avec colonnes : type (icône), sujet, entités liées (liens), date échéance, statut (fait/à faire)
- Filtres : par type, par statut, par période
- Bouton "Nouvelle activité"
- Clic sur une ligne → ouverture en modale pour modification
### 6.10 Écran de test CRUD
Écran technique, non visible dans le menu principal.
**Contenu :**
- Un onglet par entité
- Pour chaque entité : tableau brut des enregistrements, formulaire de création, boutons modifier/supprimer
---
## 7. Données de test
### 7.1 Volumétrie
| Entité | Quantité |
|--------|----------|
| Utilisateurs | 2 |
| Entreprises | 15 |
| Contacts | 40 |
| Opportunités | 20 |
| Activités | 50 |
### 7.2 Répartition des entreprises par taille
| Catégorie | Quantité | Effectif | Chiffre d'affaires |
|-----------|----------|----------|-------------------|
| TPE | 1 | < 10 | < 2 M€ |
| PME | 8 | 10-249 | 2-50 M€ |
| ETI | 4 | 250-4999 | 50-1500 M€ |
| GE | 2 | ≥ 5000 | ≥ 1500 M€ |
### 7.3 Caractéristiques des données
**Entreprises**
- Secteurs variés : industrie, services, distribution, tech, santé
- Noms fictifs mais crédibles
- Certaines avec site web, d'autres non
**Contacts**
- 1 à 5 contacts par entreprise
- Un contact principal désigné pour chaque entreprise ayant plusieurs contacts
- Fonctions variées : DG, Directeur commercial, Responsable achats, Chef de projet, Assistante
- 3 contacts orphelins (sans entreprise)
**Opportunités**
- Répartition par statut : 4 prospection, 4 qualification, 4 proposition, 3 négociation, 3 gagnées, 2 perdues
- Montants de 5 000€ à 150 000€
- Probabilités cohérentes avec le statut
- Dates de clôture prévues variées (passé, présent, futur)
- Opportunités gagnées/perdues avec date_cloture_reelle renseignée
**Activités**
- Types variés : appels, emails, réunions, notes, tâches
- 60% marquées "fait", 40% "à faire"
- Certaines liées à plusieurs entités
- Sujets rédigés de manière réaliste
**Utilisateurs**
- Jean Martin (admin) : propriétaire de ~60% des données
- Sophie Durand (commercial) : propriétaire du reste
### 7.4 Script de seed
Le script seed.sql doit :
- Vider les tables existantes avant insertion (ordre inverse des dépendances)
- Insérer les données dans l'ordre des dépendances
- Être rejouable à volonté pour réinitialiser l'environnement
---
## 8. Backlog de développement
### Bloc 0 : Mise en place de l'environnement
**Tâche 0.1 — Créer le projet React**
- Initialiser un projet React avec Vite, TypeScript et Tailwind CSS
- Créer la structure de dossiers définie en section 3
- Validation : la commande `npm run dev` lance l'application, le navigateur affiche une page
**Tâche 0.2 — Configurer la connexion Supabase**
- Créer src/services/supabase.ts avec la configuration client
- Créer .env.example documentant VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
- Validation : les fichiers existent
**Tâche 0.3 — Créer le schéma de base de données**
- Produire supabase/schema.sql avec CREATE TABLE pour toutes les entités
- Respecter les types, contraintes et relations définis en section 4
- Validation : exécution sans erreur dans Supabase SQL Editor, tables visibles
**Tâche 0.4 — Créer le script de données de test**
- Produire supabase/seed.sql selon les spécifications de la section 7
- Validation : exécution sans erreur, données visibles dans Supabase
---
### Bloc 1 : Écran de test CRUD
**Tâche 1.1 — Créer les types TypeScript**
- Définir dans src/types/index.ts les interfaces pour chaque entité
- Validation : fichier sans erreur TypeScript
**Tâche 1.2 — Créer les services Supabase**
- Un fichier par entité dans src/services/
- Fonctions : getAll, getById, create, update, delete
- Validation : fichiers créés
**Tâche 1.3 — Créer l'écran de test CRUD**
- Page TestCrud.tsx avec onglets par entité
- Chaque onglet : tableau des données, formulaire création, boutons modifier/supprimer
- Validation : visualisation et manipulation des données de test
---
### Bloc 2 : Structure et navigation
**Tâche 2.1 — Créer le layout principal**
- Composants Layout.tsx, Sidebar.tsx, Header.tsx
- Sidebar avec liens : Dashboard, Entreprises, Contacts, Opportunités, Pipeline, Activités
- Validation : sidebar visible, zone de contenu à droite
**Tâche 2.2 — Configurer le routage**
- Installer React Router
- Configurer les routes pour chaque page principale
- Chaque page affiche son titre pour l'instant
- Validation : navigation fonctionnelle entre toutes les pages
**Tâche 2.3 — Créer le Dashboard minimal**
- Compteurs : nombre d'entreprises, contacts, opportunités en cours
- Données récupérées depuis Supabase
- Validation : chiffres corrects par rapport aux données de test
---
### Bloc 3 : Gestion des entreprises
**Tâche 3.1 — Créer la liste des entreprises**
- Tableau avec colonnes : nom, secteur, effectif, nb contacts, nb opportunités
- Barre de recherche par nom
- Bouton "Nouvelle entreprise"
- Validation : 15 entreprises affichées, recherche fonctionnelle
**Tâche 3.2 — Créer le formulaire entreprise**
- Modale avec champs : nom (obligatoire), secteur, chiffre_affaires, effectif, adresse, site_web
- Utilisable pour création et modification
- Validation : création et modification fonctionnelles
**Tâche 3.3 — Créer la fiche entreprise**
- Informations de l'entreprise
- Liste des contacts associés
- Liste des opportunités associées
- Timeline des activités
- Boutons modifier, supprimer
- Validation : navigation vers la fiche, données correctes
**Tâche 3.4 — Implémenter les règles de suppression entreprise**
- Contacts → orphelins
- Opportunités → supprimées
- Activités → selon règles
- Confirmation avant suppression
- Validation : comportements conformes aux règles de gestion
---
### Bloc 4 : Gestion des contacts
**Tâche 4.1 — Créer la liste des contacts**
- Tableau avec colonnes : nom, prénom, fonction, entreprise (lien ou "Non rattaché"), email, téléphone
- Recherche par nom ou entreprise
- Validation : 40 contacts affichés, orphelins visibles
**Tâche 4.2 — Créer le formulaire contact**
- Modale avec champs : prénom, nom (obligatoires), fonction, email, téléphone, entreprise (liste déroulante), est_principal
- Validation : création avec et sans entreprise
**Tâche 4.3 — Créer la fiche contact**
- Informations du contact
- Lien vers entreprise
- Opportunités où contact principal
- Timeline des activités
- Validation : navigation et données correctes
**Tâche 4.4 — Implémenter les règles de gestion contact**
- Un seul contact principal par entreprise
- Retrait automatique lors de changement d'entreprise
- Interdiction suppression si contact principal d'opportunité
- Validation : chaque règle testée
---
### Bloc 5 : Gestion des opportunités
**Tâche 5.1 — Créer la liste des opportunités**
- Tableau avec colonnes : titre, entreprise, montant, statut, probabilité, date clôture
- Recherche et filtre par statut
- Validation : 20 opportunités, filtres fonctionnels
**Tâche 5.2 — Créer le formulaire opportunité**
- Modale avec champs selon modèle
- Contact principal filtré par entreprise sélectionnée
- Validation : création avec contact principal filtré correctement
**Tâche 5.3 — Créer la fiche opportunité**
- Informations complètes
- Changement de statut direct
- Timeline des activités
- Validation : changement vers "gagné" remplit date_cloture_reelle
**Tâche 5.4 — Créer la vue Pipeline**
- Colonnes par statut
- Cartes avec titre, entreprise, montant
- Glisser-déposer fonctionnel
- Totaux par colonne
- Validation : déplacement d'une carte change le statut en base
---
### Bloc 6 : Gestion des activités
**Tâche 6.1 — Créer la liste des activités**
- Tableau avec type (icône), sujet, liens, date échéance, statut
- Filtres par type, statut, période
- Validation : 50 activités, filtres fonctionnels
**Tâche 6.2 — Créer le formulaire activité**
- Modale avec champs selon modèle
- Au moins un lien obligatoire
- Validation : impossible de créer sans lien
**Tâche 6.3 — Créer le composant Timeline**
- Composant réutilisable
- Ordre chronologique inverse
- Marquer comme fait directement
- Validation : timeline présente sur fiches entreprise, contact, opportunité
---
### Bloc 7 : Finalisation Dashboard
**Tâche 7.1 — Enrichir le Dashboard**
- Montant total pondéré des opportunités en cours
- 10 prochaines activités à faire
- 5 dernières opportunités modifiées
- Liens rapides
- Validation : données pertinentes, liens fonctionnels
---
### Bloc 8 : Authentification (optionnel)
**Tâche 8.1 — Mettre en place l'authentification**
- Configurer Supabase Auth
- Page de login
- Protection des routes
- Validation : accès impossible sans connexion
**Tâche 8.2 — Associer les données à l'utilisateur**
- proprietaire_id automatique à la création
- Filtrage par propriétaire
- Validation : chaque utilisateur voit ses données
---
## 9. Annexes
### 9.1 Glossaire
| Terme | Définition |
|-------|------------|
| Entreprise | Entité morale prospectée ou cliente |
| Contact | Personne physique, interlocuteur au sein d'une entreprise |
| Opportunité | Affaire commerciale en cours, avec un montant et un statut |
| Activité | Action réalisée ou à réaliser (appel, email, réunion, etc.) |
| Pipeline | Vue des opportunités organisées par étape du cycle de vente |
| Contact principal | Interlocuteur privilégié pour une entreprise ou une opportunité |
### 9.2 Statuts d'opportunité
| Statut | Description |
|--------|-------------|
| prospection | Premier contact, qualification du besoin non démarrée |
| qualification | Besoin identifié, en cours d'analyse |
| proposition | Offre commerciale envoyée |
| negociation | Discussion sur les termes, ajustements |
| gagne | Affaire conclue positivement |
| perdu | Affaire perdue ou abandonnée |
### 9.3 Types d'activité
| Type | Description |
|------|-------------|
| appel | Appel téléphonique |
| email | Email envoyé ou reçu |
| reunion | Rendez-vous physique ou visio |
| note | Note libre, compte-rendu |
| tache | Action à réaliser |
