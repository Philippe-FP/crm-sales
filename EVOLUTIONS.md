# CRM Sales — Évolutions v0.5 à v0.8

## Contexte

Ce document décrit les évolutions à apporter au CRM Sales après la version initiale (v0.1 à v0.4).
Il sert de référence pour Claude Code lors de l'implémentation.

---

## Version 0.5 — Corrections page Opportunités

### Tâche 9.5 — Correction bug en-têtes et ajout colonne montant pondéré

**Page concernée :** Liste des Opportunités (`/opportunites`)

**Modifications :**

1. **Correction bug en-têtes de colonnes**
   - Le texte `&UDARR;` s'affiche en clair au lieu d'être interprété
   - Remplacer par le caractère Unicode ↕ ou supprimer complètement si non nécessaire

2. **Ajout colonne "Montant pondéré"**
   - Ajouter une colonne après "Montant"
   - Calcul : `montant × (probabilite / 100)`
   - Format : nombre avec séparateur de milliers et symbole €

**Critère de validation :**
- Les en-têtes de colonnes s'affichent correctement (pas de `&UDARR;` visible)
- La colonne "Montant pondéré" est visible avec les valeurs calculées

**Versioning :**
- Mettre à jour le numéro de version dans la sidebar : "CRM Sales v0.5"
- Créer un tag Git `v0.5` avec le message "Correction en-têtes opportunités + colonne montant pondéré"

---

## Version 0.6 — Refonte du Dashboard

### Tâche 9.2 — Simplification des pavés et ajout des totaux

**Page concernée :** Dashboard (`/` ou `/dashboard`)

**Modifications :**

1. **Supprimer les pavés suivants :**
   - Entreprises (compteur)
   - Contacts (compteur)
   - Activités (compteur)

2. **Conserver :**
   - Opportunités en cours (compteur)

3. **Ajouter deux nouveaux pavés :**
   - "Montant total" : somme des montants des opportunités en cours (statut ≠ gagne et ≠ perdu)
   - "Montant pondéré" : somme des (montant × probabilite / 100) des opportunités en cours

**Critère de validation :**
- Le dashboard affiche 3 pavés : Opportunités en cours, Montant total, Montant pondéré

---

### Tâche 9.3 — Pavés par horizon de clôture (M, M+1, M+2)

**Page concernée :** Dashboard

**Modifications :**

1. **Remplacer le pavé "Dernières opportunités"** par trois pavés empilés verticalement :
   - "Clôtures en [Mois courant]" (ex: "Clôtures en Mars")
   - "Clôtures en [Mois +1]" (ex: "Clôtures en Avril")
   - "Clôtures en [Mois +2]" (ex: "Clôtures en Mai")

2. **Pour chaque pavé :**
   - Filtrer les opportunités dont `date_cloture_prevue` tombe dans le mois concerné
   - Exclure les opportunités avec statut "gagne" ou "perdu"
   - Pour chaque opportunité, afficher :
     - Titre de l'opportunité
     - Montant brut (formaté avec € et séparateur milliers)
     - Montant pondéré (formaté avec € et séparateur milliers)
   - En bas du pavé : ligne de total avec montant brut total et montant pondéré total

3. **Cas particulier :**
   - Si aucune opportunité dans un mois, afficher "Aucune opportunité prévue"

**Critère de validation :**
- Les trois pavés M, M+1, M+2 s'affichent avec le bon mois en titre
- Les opportunités sont correctement filtrées par date de clôture prévue
- Les totaux sont calculés et affichés

---

### Tâche 9.4 — Nom de l'entreprise sur les opportunités du dashboard

**Page concernée :** Dashboard (pavés M, M+1, M+2)

**Modification :**

- Afficher le nom de l'opportunité suivi du nom de l'entreprise entre parenthèses
- Format : "Titre opportunité (Nom entreprise)"
- Exemple : "Accompagnement IA (AC Négoce)"

**Critère de validation :**
- Chaque opportunité dans les pavés affiche le nom de l'entreprise associée

**Versioning (après 9.2 + 9.3 + 9.4) :**
- Mettre à jour le numéro de version dans la sidebar : "CRM Sales v0.6"
- Créer un tag Git `v0.6` avec le message "Refonte dashboard : pavés M/M+1/M+2, totaux, nom entreprise"

---

## Version 0.7 — Améliorations page Pipeline

### Tâche 9.6 — Affichage montant brut et pondéré

**Page concernée :** Pipeline (`/pipeline`)

**Modifications :**

1. **Sur chaque carte d'opportunité :**
   - Afficher les deux montants séparés par "/"
   - Format : "20 000€ / 10 000€" (brut / pondéré)

2. **Sur chaque en-tête de colonne (statut) :**
   - Afficher le total brut et le total pondéré de la colonne
   - Format : "150 000€ / 75 000€"

**Critère de validation :**
- Les cartes affichent montant brut / montant pondéré
- Les en-têtes de colonnes affichent les totaux brut / pondéré

**Versioning :**
- Mettre à jour le numéro de version dans la sidebar : "CRM Sales v0.7"
- Créer un tag Git `v0.7` avec le message "Pipeline : affichage montants brut et pondéré"

---

## Version 0.8 — Sidebar responsive (optionnel)

### Tâche 9.1 — Sidebar responsive avec hamburger

**Composants concernés :** Layout, Sidebar

**Modifications :**

1. **Comportement responsive unique :**
   - Sur écran < 768px (mobile/tablette) :
     - Sidebar masquée par défaut
     - Header fixe en haut avec titre "CRM Sales" et bouton hamburger (☰)
     - Clic sur hamburger : la sidebar apparaît en overlay (par-dessus le contenu)
     - Clic sur un lien de navigation : la sidebar se ferme et la page s'affiche
     - Clic à l'extérieur de la sidebar : la sidebar se ferme
   - Sur écran ≥ 768px (desktop) :
     - Sidebar visible en permanence (comportement actuel)
     - Pas de hamburger visible

2. **Une seule UI, comportement adaptatif :**
   - Utiliser les media queries CSS et/ou Tailwind pour le responsive
   - Un seul composant Sidebar, pas de duplication

**Critère de validation :**
- Sur mobile : le menu est accessible via hamburger, se ferme après navigation
- Sur desktop : comportement inchangé (sidebar toujours visible)
- Pas de régression sur les autres pages

**Versioning :**
- Mettre à jour le numéro de version dans la sidebar : "CRM Sales v0.8"
- Créer un tag Git `v0.8` avec le message "Sidebar responsive avec hamburger"

---

## Récapitulatif

| Version | Tâche(s) | Description |
|---------|----------|-------------|
| v0.5 | 9.5 | Correction en-têtes + colonne montant pondéré |
| v0.6 | 9.2, 9.3, 9.4 | Refonte dashboard complète |
| v0.7 | 9.6 | Pipeline : montants brut/pondéré |
| v0.8 | 9.1 | Sidebar responsive (optionnel) |

---

## Instructions pour Claude Code

Avant chaque tâche, lire ce fichier EVOLUTIONS.md pour comprendre le contexte.

Après chaque version :
1. Mettre à jour le texte de version dans le composant Sidebar
2. Commit avec message descriptif
3. Créer le tag Git correspondant
4. Push le code et les tags vers GitHub
