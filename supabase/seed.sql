-- ============================================
-- CRM Sales — Données de test (seed)
-- Rejouable : vide les tables avant insertion
-- ============================================

-- Nettoyage dans l'ordre inverse des dépendances
DELETE FROM activites;
DELETE FROM opportunites;
DELETE FROM contacts;
DELETE FROM entreprises;
DELETE FROM utilisateurs;

-- ============================================
-- Utilisateurs (2)
-- Jean Martin  → admin,  ~60 % des données
-- Sophie Durand → commercial, ~40 %
-- ============================================
INSERT INTO utilisateurs (id, email, nom, role) VALUES
  ('10000000-0000-0000-0000-000000000001', 'jean.martin@crm-sales.fr',   'Jean Martin',   'admin'),
  ('10000000-0000-0000-0000-000000000002', 'sophie.durand@crm-sales.fr', 'Sophie Durand', 'commercial');

-- ============================================
-- Entreprises (15)
-- 1 TPE · 8 PME · 4 ETI · 2 GE
-- ============================================
INSERT INTO entreprises (id, nom, secteur, chiffre_affaires, effectif, adresse, site_web, proprietaire_id) VALUES
  -- TPE (1)
  ('20000000-0000-0000-0000-000000000001', 'Atelier Duval',                    'Services',      800000,    5,    '12 rue des Artisans, 69003 Lyon',                NULL,                                '10000000-0000-0000-0000-000000000001'),
  -- PME (8)
  ('20000000-0000-0000-0000-000000000002', 'Nextera Solutions',                'Tech',          8000000,   45,   '8 avenue de l''Innovation, 75011 Paris',          'https://nextera-solutions.fr',      '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000003', 'Groupe Mercier Distribution',      'Distribution',  35000000,  120,  '45 boulevard du Commerce, 33000 Bordeaux',        'https://groupe-mercier.fr',         '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000004', 'Biotech Santé',                    'Santé',         15000000,  85,   '22 rue Pasteur, 67000 Strasbourg',                'https://biotech-sante.fr',          '10000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000005', 'Fonderies de l''Est',              'Industrie',     42000000,  200,  '1 zone industrielle des Forges, 57000 Metz',      NULL,                                '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000006', 'LogiTrans Express',                'Services',      12000000,  65,   '90 rue de la Logistique, 13008 Marseille',         'https://logitrans-express.fr',      '10000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000007', 'Média Plus Communication',         'Services',      5000000,   30,   '15 rue de la Presse, 31000 Toulouse',              'https://mediaplus-com.fr',          '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000008', 'Pharmacie Centrale Distribution',  'Santé',         28000000,  150,  '5 avenue de la Santé, 44000 Nantes',               NULL,                                '10000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000009', 'Énergie Verte Conseil',            'Services',      4000000,   25,   '3 impasse des Énergies, 38000 Grenoble',           'https://energie-verte-conseil.fr',  '10000000-0000-0000-0000-000000000001'),
  -- ETI (4)
  ('20000000-0000-0000-0000-000000000010', 'Industrielle du Rhône',            'Industrie',     350000000, 1200, '100 route de l''Industrie, 69200 Vénissieux',      'https://industrielle-rhone.fr',     '10000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000011', 'TechVision France',                'Tech',          180000000, 800,  '25 parvis de la Défense, 92800 Puteaux',           'https://techvision.fr',             '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000012', 'Santé Plus Groupe',                'Santé',         620000000, 2500, '50 avenue Lacassagne, 69003 Lyon',                 'https://sante-plus-groupe.fr',      '10000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000013', 'Distribution Nationale SA',        'Distribution',  950000000, 3500, '200 avenue de France, 75013 Paris',                'https://distribution-nationale.fr', '10000000-0000-0000-0000-000000000001'),
  -- GE (2)
  ('20000000-0000-0000-0000-000000000014', 'Aéronautique Française SA',        'Industrie',     3500000000,12000,'1 boulevard Aéronautique, 31700 Blagnac',          'https://aeronautique-fr.com',       '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000015', 'Global Services International',    'Services',      2200000000,8000, '10 place des Vosges, 75004 Paris',                 'https://global-services-intl.com',  '10000000-0000-0000-0000-000000000002');

-- ============================================
-- Contacts (40)
-- 37 rattachés + 3 orphelins
-- est_principal = true pour 1 contact par entreprise multi-contacts
-- ============================================
INSERT INTO contacts (id, prenom, nom, fonction, email, telephone, est_principal, entreprise_id, proprietaire_id) VALUES
  -- e01 Atelier Duval (1 contact)
  ('30000000-0000-0000-0000-000000000001', 'Pierre',    'Duval',      'Gérant',                   'p.duval@atelier-duval.fr',          '04 72 10 00 01', false, '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
  -- e02 Nextera Solutions (3 contacts)
  ('30000000-0000-0000-0000-000000000002', 'Marc',      'Lefèvre',    'Directeur général',        'm.lefevre@nextera-solutions.fr',    '01 44 10 00 01', true,  '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000003', 'Julie',     'Bernard',    'Directrice commerciale',   'j.bernard@nextera-solutions.fr',    '01 44 10 00 02', false, '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000004', 'Thomas',    'Roux',       'Chef de projet',           't.roux@nextera-solutions.fr',       '01 44 10 00 03', false, '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'),
  -- e03 Groupe Mercier Distribution (4 contacts)
  ('30000000-0000-0000-0000-000000000005', 'Isabelle',  'Mercier',    'Directrice générale',      'i.mercier@groupe-mercier.fr',       '05 56 10 00 01', true,  '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000006', 'Frédéric',  'Blanc',      'Directeur commercial',     'f.blanc@groupe-mercier.fr',         '05 56 10 00 02', false, '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000007', 'Nathalie',  'Girard',     'Responsable achats',       'n.girard@groupe-mercier.fr',        '05 56 10 00 03', false, '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000008', 'Élodie',    'Perrin',     'Assistante de direction',  'e.perrin@groupe-mercier.fr',        '05 56 10 00 04', false, '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
  -- e04 Biotech Santé (3 contacts)
  ('30000000-0000-0000-0000-000000000009', 'Laurent',   'Moreau',     'Directeur général',        'l.moreau@biotech-sante.fr',         '03 88 10 00 01', true,  '20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000010', 'Céline',    'Dubois',     'Responsable achats',       'c.dubois@biotech-sante.fr',         '03 88 10 00 02', false, '20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000011', 'Antoine',   'Lambert',    'Chef de projet',           'a.lambert@biotech-sante.fr',        '03 88 10 00 03', false, '20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002'),
  -- e05 Fonderies de l'Est (3 contacts)
  ('30000000-0000-0000-0000-000000000012', 'Michel',    'Fontaine',   'Directeur général',        'm.fontaine@fonderies-est.fr',       '03 87 10 00 01', true,  '20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000013', 'Sandrine',  'Chevalier',  'Directrice commerciale',   's.chevalier@fonderies-est.fr',      '03 87 10 00 02', false, '20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000014', 'David',     'Robin',      'Responsable production',   'd.robin@fonderies-est.fr',          '03 87 10 00 03', false, '20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
  -- e06 LogiTrans Express (2 contacts)
  ('30000000-0000-0000-0000-000000000015', 'Valérie',   'Gauthier',   'Directrice générale',      'v.gauthier@logitrans-express.fr',   '04 91 10 00 01', true,  '20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000016', 'Christophe','Lemaire',    'Responsable achats',       'c.lemaire@logitrans-express.fr',    '04 91 10 00 02', false, '20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002'),
  -- e07 Média Plus Communication (2 contacts)
  ('30000000-0000-0000-0000-000000000017', 'Stéphane',  'Bonnet',     'Directeur général',        's.bonnet@mediaplus-com.fr',         '05 61 10 00 01', true,  '20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000018', 'Aurélie',   'Renaud',     'Chef de projet',           'a.renaud@mediaplus-com.fr',         '05 61 10 00 02', false, '20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001'),
  -- e08 Pharmacie Centrale Distribution (3 contacts)
  ('30000000-0000-0000-0000-000000000019', 'François',  'Picard',     'Directeur général',        'f.picard@pharma-centrale.fr',       '02 40 10 00 01', true,  '20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000020', 'Caroline',  'Leroy',      'Directrice commerciale',   'c.leroy@pharma-centrale.fr',        '02 40 10 00 02', false, '20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000021', 'Rémi',      'Fournier',   'Responsable logistique',   'r.fournier@pharma-centrale.fr',     '02 40 10 00 03', false, '20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002'),
  -- e09 Énergie Verte Conseil (2 contacts)
  ('30000000-0000-0000-0000-000000000022', 'Anne',      'Rousseau',   'Directrice générale',      'a.rousseau@energie-verte.fr',       '04 76 10 00 01', true,  '20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000023', 'Vincent',   'Masson',     'Consultant senior',        'v.masson@energie-verte.fr',         '04 76 10 00 02', false, '20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001'),
  -- e10 Industrielle du Rhône (4 contacts)
  ('30000000-0000-0000-0000-000000000024', 'Philippe',  'André',      'Directeur général',        'p.andre@industrielle-rhone.fr',     '04 72 20 00 01', true,  '20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000025', 'Catherine', 'Simon',      'Directrice commerciale',   'c.simon@industrielle-rhone.fr',     '04 72 20 00 02', false, '20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000026', 'Olivier',   'Laurent',    'Responsable achats',       'o.laurent@industrielle-rhone.fr',   '04 72 20 00 03', false, '20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000027', 'Émilie',    'Garcia',     'Assistante de direction',  'e.garcia@industrielle-rhone.fr',    '04 72 20 00 04', false, '20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002'),
  -- e11 TechVision France (3 contacts)
  ('30000000-0000-0000-0000-000000000028', 'Julien',    'Martinez',   'Directeur général',        'j.martinez@techvision.fr',          '01 47 10 00 01', true,  '20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000029', 'Marie',     'Petit',      'Directrice des opérations','m.petit@techvision.fr',             '01 47 10 00 02', false, '20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000030', 'Damien',    'Dumont',     'Chef de projet technique', 'd.dumont@techvision.fr',            '01 47 10 00 03', false, '20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001'),
  -- e12 Santé Plus Groupe (2 contacts)
  ('30000000-0000-0000-0000-000000000031', 'Hélène',    'Faure',      'Directrice générale',      'h.faure@sante-plus-groupe.fr',      '04 72 30 00 01', true,  '20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000032', 'Benoît',    'Nicolas',    'Responsable achats',       'b.nicolas@sante-plus-groupe.fr',    '04 72 30 00 02', false, '20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002'),
  -- e13 Distribution Nationale SA (3 contacts)
  ('30000000-0000-0000-0000-000000000033', 'Claire',    'Henry',      'Directrice commerciale',   'c.henry@distribution-nationale.fr', '01 53 10 00 01', true,  '20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000034', 'Arnaud',    'Muller',     'Responsable achats',       'a.muller@distribution-nationale.fr','01 53 10 00 02', false, '20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000035', 'Sophie',    'Joly',       'Chef de projet supply',    's.joly@distribution-nationale.fr',  '01 53 10 00 03', false, '20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001'),
  -- e14 Aéronautique Française SA (1 contact)
  ('30000000-0000-0000-0000-000000000036', 'Gérard',    'Boyer',      'Directeur des achats',     'g.boyer@aeronautique-fr.com',       '05 61 20 00 01', false, '20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000001'),
  -- e15 Global Services International (1 contact)
  ('30000000-0000-0000-0000-000000000037', 'Virginie',  'Lemoine',    'Directrice commerciale',   'v.lemoine@global-services-intl.com','01 42 10 00 01', false, '20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000002'),
  -- Contacts orphelins (3)
  ('30000000-0000-0000-0000-000000000038', 'Patrick',   'Marchand',   'Consultant indépendant',   'p.marchand@gmail.com',              '06 12 34 56 78', false, NULL, '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000039', 'Laure',     'Dupont',     'Directrice marketing',     'l.dupont@outlook.fr',               '06 23 45 67 89', false, NULL, '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000040', 'Mathieu',   'Caron',      'Chef de projet freelance', 'mathieu.caron@free.fr',             '06 34 56 78 90', false, NULL, '10000000-0000-0000-0000-000000000001');

-- ============================================
-- Opportunités (20)
-- 4 prospection · 4 qualification · 4 proposition
-- 3 négociation · 3 gagnées · 2 perdues
-- ============================================
INSERT INTO opportunites (id, titre, montant, statut, probabilite, date_cloture_prevue, date_cloture_reelle, entreprise_id, contact_principal_id, proprietaire_id) VALUES
  -- Prospection (4)
  ('40000000-0000-0000-0000-000000000001', 'Audit informatique annuel',              15000,  'prospection',  15,  '2026-06-30', NULL,          '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000002', 'Fourniture matériel entrepôt',           45000,  'prospection',  10,  '2026-07-15', NULL,          '20000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000003', 'Conseil en stratégie digitale',           8000,  'prospection',  20,  '2026-05-31', NULL,          '20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000004', 'Formation sécurité industrielle',        25000,  'prospection',  15,  '2026-08-30', NULL,          '20000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000002'),
  -- Qualification (4)
  ('40000000-0000-0000-0000-000000000005', 'Refonte site web corporate',             35000,  'qualification', 30, '2026-05-15', NULL,          '20000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000006', 'Maintenance préventive équipements',     18000,  'qualification', 35, '2026-04-30', NULL,          '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000007', 'Solution de gestion RH',                65000,  'qualification', 25, '2026-06-30', NULL,          '20000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000008', 'Optimisation logistique transport',      22000,  'qualification', 40, '2026-04-15', NULL,          '20000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000001'),
  -- Proposition (4)
  ('40000000-0000-0000-0000-000000000009', 'Déploiement ERP complet',               95000,  'proposition',  55,  '2026-04-30', NULL,          '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000010', 'Infogérance serveurs et réseau',        42000,  'proposition',  60,  '2026-03-31', NULL,          '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000011', 'Migration cloud infrastructure',       150000,  'proposition',  50,  '2026-06-15', NULL,          '20000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000036', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000012', 'Contrat de support annuel',             28000,  'proposition',  65,  '2026-03-15', NULL,          '20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000002'),
  -- Négociation (3)
  ('40000000-0000-0000-0000-000000000013', 'Licence logicielle groupe',            120000,  'negociation',  75,  '2026-03-31', NULL,          '20000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000037', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000014', 'Équipement réseau usine',               55000,  'negociation',  80,  '2026-03-15', NULL,          '20000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000015', 'Consulting transformation digitale',    78000,  'negociation',  70,  '2026-04-15', NULL,          '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001'),
  -- Gagnées (3)
  ('40000000-0000-0000-0000-000000000016', 'Installation système de sécurité',      32000,  'gagne',        100, '2026-01-31', '2026-01-28', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000017', 'Audit conformité réglementaire',        18000,  'gagne',        100, '2025-12-31', '2025-12-18', '20000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000018', 'Formation équipe commerciale',          12000,  'gagne',        100, '2026-02-15', '2026-02-10', '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001'),
  -- Perdues (2)
  ('40000000-0000-0000-0000-000000000019', 'Projet refonte SI complète',            85000,  'perdu',          0, '2026-01-15', '2026-01-10', '20000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000029', '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000020', 'Contrat maintenance annuel',             5000,  'perdu',          0, '2025-11-30', '2025-11-25', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001');

-- ============================================
-- Activités (50)
-- 30 faites (est_fait = true) · 20 à faire
-- Types variés, certaines liées à plusieurs entités
-- ============================================
INSERT INTO activites (id, type, sujet, description, date_echeance, date_realisation, est_fait, entreprise_id, contact_id, opportunite_id, proprietaire_id) VALUES
  -- === Activités FAITES (30) ===
  -- 1-5 : Appels réalisés
  ('50000000-0000-0000-0000-000000000001', 'appel',   'Appel de découverte Nextera',                  'Premier échange avec Marc Lefèvre pour comprendre leurs besoins IT.',                    '2025-11-15', '2025-11-15', true,  '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000002', 'appel',   'Relance Fonderies de l''Est',                  'Point avec Michel Fontaine sur la maintenance préventive.',                              '2025-12-05', '2025-12-05', true,  '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000003', 'appel',   'Appel qualification Santé Plus',               'Échange avec Hélène Faure sur le projet RH.',                                           '2025-12-10', '2025-12-10', true,  '20000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000031', '40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000004', 'appel',   'Point hebdomadaire LogiTrans',                 'Suivi du projet d''optimisation logistique.',                                            '2026-01-10', '2026-01-10', true,  '20000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000005', 'appel',   'Appel négociation Global Services',            'Discussion sur les termes de la licence logicielle.',                                    '2026-01-20', '2026-01-20', true,  '20000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000037', '40000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001'),
  -- 6-11 : Emails envoyés
  ('50000000-0000-0000-0000-000000000006', 'email',   'Envoi proposition ERP Groupe Mercier',         'Proposition commerciale détaillée pour le déploiement ERP.',                             '2026-01-08', '2026-01-08', true,  '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000007', 'email',   'Envoi devis infogérance Biotech',              'Devis détaillé pour l''infogérance serveurs.',                                           '2025-12-20', '2025-12-20', true,  '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000008', 'email',   'Confirmation commande Nextera',                'Confirmation de la commande installation sécurité.',                                     '2026-01-25', '2026-01-25', true,  '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000009', 'email',   'Compte rendu audit Santé Plus',                'Envoi du rapport d''audit conformité.',                                                  '2025-12-19', '2025-12-19', true,  '20000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000031', '40000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000010', 'email',   'Envoi documentation technique TechVision',     'Documentation sur les solutions web proposées.',                                         '2026-01-05', '2026-01-05', true,  '20000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000028', '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000011', 'email',   'Relance proposition Pharmacie Centrale',       'Relance suite à l''envoi de la proposition de support.',                                 '2026-02-01', '2026-02-01', true,  '20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002'),
  -- 12-17 : Réunions réalisées
  ('50000000-0000-0000-0000-000000000012', 'reunion', 'Réunion cadrage ERP Groupe Mercier',           'Réunion de cadrage du projet ERP avec l''équipe Mercier.',                               '2025-12-15', '2025-12-15', true,  '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000013', 'reunion', 'Démonstration produit TechVision',             'Démo de la solution de refonte web.',                                                    '2026-01-12', '2026-01-12', true,  '20000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000028', '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000014', 'reunion', 'Présentation offre Aéronautique FR',           'Présentation de l''offre migration cloud.',                                              '2026-01-18', '2026-01-18', true,  '20000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000036', '40000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000015', 'reunion', 'Réunion négociation Industrielle du Rhône',    'Négociation des conditions tarifaires équipement réseau.',                               '2026-02-03', '2026-02-03', true,  '20000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000025', '40000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000016', 'reunion', 'Atelier de formation Fonderies de l''Est',     'Session de formation de l''équipe commerciale.',                                         '2026-02-08', '2026-02-08', true,  '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000017', 'reunion', 'Réunion bilan Atelier Duval',                  'Bilan de fin de contrat maintenance.',                                                   '2025-11-20', '2025-11-20', true,  '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000001'),
  -- 18-23 : Notes
  ('50000000-0000-0000-0000-000000000018', 'note',    'CR réunion Groupe Mercier — cadrage ERP',      'Points clés : périmètre validé, planning à affiner, budget en ligne.',                   NULL,         '2025-12-15', true,  '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000019', 'note',    'Analyse concurrence TechVision',               'TechVision compare notre offre avec deux concurrents. Atout : support local.',           NULL,         '2026-01-14', true,  '20000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000028', '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000020', 'note',    'Retour négatif projet SI TechVision',          'Projet perdu au profit d''un concurrent. Raison : délai trop long.',                     NULL,         '2026-01-10', true,  '20000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000029', '40000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000021', 'note',    'Veille sectorielle santé',                     'Nouvelles réglementations impactant Biotech Santé et Santé Plus.',                       NULL,         '2026-01-22', true,  '20000000-0000-0000-0000-000000000004', NULL,                                   NULL,                                   '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000022', 'note',    'Feedback formation Fonderies',                 'Retours très positifs de l''équipe. Demande de module avancé.',                          NULL,         '2026-02-10', true,  '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000023', 'note',    'Piste contact orphelin Patrick Marchand',      'Rencontré lors d''un salon. Potentiel prescripteur pour le secteur industrie.',           NULL,         '2026-01-30', true,  NULL,                                   '30000000-0000-0000-0000-000000000038', NULL,                                   '10000000-0000-0000-0000-000000000001'),
  -- 24-30 : Tâches réalisées
  ('50000000-0000-0000-0000-000000000024', 'tache',   'Préparer proposition Aéronautique FR',         'Rédiger la proposition technique et commerciale pour la migration cloud.',               '2026-01-15', '2026-01-14', true,  '20000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000036', '40000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000025', 'tache',   'Vérifier références LogiTrans',                'Vérifier nos références transport/logistique pour le dossier.',                          '2026-01-08', '2026-01-07', true,  '20000000-0000-0000-0000-000000000006', NULL,                                   '40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000026', 'tache',   'Mettre à jour fiche Pharmacie Centrale',       'Actualiser les informations de contact et organigramme.',                                '2026-01-20', '2026-01-18', true,  '20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000019', NULL,                                   '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000027', 'tache',   'Envoyer contrat signé Nextera',                'Transmettre le contrat signé pour l''installation sécurité.',                            '2026-01-30', '2026-01-28', true,  '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000028', 'tache',   'Planifier audit Santé Plus',                   'Organiser les dates d''audit conformité.',                                               '2025-11-25', '2025-11-24', true,  '20000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000031', '40000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000029', 'tache',   'Préparer démo produit Média Plus',             'Préparer la démonstration de la solution de stratégie digitale.',                        '2026-02-05', '2026-02-04', true,  '20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000030', 'tache',   'Clôturer dossier Atelier Duval',               'Archiver le dossier du contrat maintenance perdu.',                                     '2025-12-15', '2025-12-12', true,  '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000001'),

  -- === Activités À FAIRE (20) ===
  -- 31-35 : Appels à passer
  ('50000000-0000-0000-0000-000000000031', 'appel',   'Relancer Virginie Lemoine — licence',          'Relancer sur la décision finale concernant la licence groupe.',                          '2026-02-20', NULL,         false, '20000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000037', '40000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000032', 'appel',   'Qualifier besoin Distribution Nationale',      'Premier appel pour qualifier le besoin en matériel.',                                    '2026-02-21', NULL,         false, '20000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000033', '40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000033', 'appel',   'Suivi post-formation Fonderies',               'Appeler Sandrine Chevalier pour le suivi post-formation.',                               '2026-02-24', NULL,         false, '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000013', NULL,                                   '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000034', 'appel',   'Appel découverte Énergie Verte',               'Contacter Anne Rousseau pour évaluer un besoin en consulting.',                          '2026-02-25', NULL,         false, '20000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000022', NULL,                                   '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000035', 'appel',   'Relancer Biotech Santé — infogérance',         'Relancer Laurent Moreau sur la décision infogérance.',                                   '2026-02-19', NULL,         false, '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002'),
  -- 36-38 : Emails à envoyer
  ('50000000-0000-0000-0000-000000000036', 'email',   'Envoyer proposition révisée Industrielle',     'Proposition mise à jour avec les nouvelles conditions tarifaires.',                      '2026-02-18', NULL,         false, '20000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000025', '40000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000037', 'email',   'Envoyer documentation migration cloud',        'Envoyer la documentation technique détaillée à Gérard Boyer.',                          '2026-02-22', NULL,         false, '20000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000036', '40000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000038', 'email',   'Envoyer CR réunion Groupe Mercier',            'Envoyer le compte rendu de la dernière réunion de suivi.',                               '2026-02-19', NULL,         false, '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000001'),
  -- 39-42 : Réunions à venir
  ('50000000-0000-0000-0000-000000000039', 'reunion', 'Soutenance proposition ERP Mercier',           'Présentation finale de la proposition ERP au comité de direction.',                      '2026-02-26', NULL,         false, '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000040', 'reunion', 'Atelier technique TechVision — refonte web',   'Atelier de spécification technique avec l''équipe TechVision.',                          '2026-03-02', NULL,         false, '20000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000028', '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000041', 'reunion', 'Signature contrat Global Services',            'Réunion pour la signature du contrat licence logicielle.',                               '2026-03-05', NULL,         false, '20000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000037', '40000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000042', 'reunion', 'Revue de projet Industrielle du Rhône',        'Point d''avancement sur le projet équipement réseau.',                                   '2026-02-28', NULL,         false, '20000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000024', '40000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000002'),
  -- 43-45 : Notes à rédiger
  ('50000000-0000-0000-0000-000000000043', 'note',    'Préparer stratégie Aéronautique FR',           'Rédiger la stratégie d''approche pour la phase de négociation cloud.',                   '2026-02-23', NULL,         false, '20000000-0000-0000-0000-000000000014', NULL,                                   '40000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000044', 'note',    'Synthèse besoins RH Santé Plus',               'Consolider les besoins exprimés par Hélène Faure.',                                     '2026-02-20', NULL,         false, '20000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000031', '40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000045', 'note',    'Analyse rentabilité contrat Pharmacie',        'Calculer la rentabilité du contrat support avant validation.',                           '2026-02-21', NULL,         false, '20000000-0000-0000-0000-000000000008', NULL,                                   '40000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002'),
  -- 46-50 : Tâches à réaliser
  ('50000000-0000-0000-0000-000000000046', 'tache',   'Préparer contrat licence Global Services',     'Rédiger le contrat de licence logicielle pour signature.',                               '2026-02-28', NULL,         false, '20000000-0000-0000-0000-000000000015', NULL,                                   '40000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000047', 'tache',   'Mettre à jour tarifs LogiTrans',               'Actualiser la grille tarifaire pour la proposition logistique.',                         '2026-02-22', NULL,         false, '20000000-0000-0000-0000-000000000006', NULL,                                   '40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000048', 'tache',   'Organiser visite site Fonderies',              'Planifier une visite du site industriel à Metz.',                                       '2026-03-05', NULL,         false, '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000012', NULL,                                   '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000049', 'tache',   'Demander références Biotech Santé',            'Demander au client des références pour le secteur santé.',                               '2026-02-25', NULL,         false, '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000050', 'tache',   'Relancer contact orphelin Laure Dupont',       'Reprendre contact avec Laure Dupont rencontrée au salon marketing.',                    '2026-03-01', NULL,         false, NULL,                                   '30000000-0000-0000-0000-000000000039', NULL,                                   '10000000-0000-0000-0000-000000000002');
