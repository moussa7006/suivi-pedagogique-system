-- ============================================================================
--  EduTrack — Correction de connexion (ciblée et réversible)
--
--  Ce script répare UNIQUEMENT les 2 comptes signalés, en les resynchronisant
--  avec data.sql (source de vérité). Il ne touche à AUCUN autre compte :
--    - admin@edutrack.local  -> INTACT
--    - tous les autres users -> INTACTS
--
--  Actions :
--    1) moussa.b.keita223@gmail.com (ADMIN web) :
--         - restaure le matricule INTEC-ADM-9194 (au lieu de 2026-ADM-001)
--         - restaure le mot de passe  -> Admin123456789!
--    2) mousbykeita225@gmail.com (ENSEIGNANT mobile) :
--         - crée le compte s'il est absent (il n'existait pas en base)
--         - hash du mot de passe repris tel quel depuis data.sql
-- ============================================================================

BEGIN;

-- 1) Admin web : restaurer matricule + mot de passe d'origine
UPDATE public.utilisateur
SET matricule    = 'INTEC-ADM-9194',
    mot_de_passe = '$2a$10$6ua0P89Y7iiu.Ammk17c0O4GjeyQyIKevnGBJyDrLTwlgmBWjgUNu'
WHERE email = 'moussa.b.keita223@gmail.com';

-- 2) Enseignant mobile : créer le compte s'il n'existe pas encore
INSERT INTO public.utilisateur
    (actif, adresse, email, force_password_change, matricule, mot_de_passe,
     nom, prenom, role, telephone)
SELECT
    true, 'Bamako', 'mousbykeita225@gmail.com', false, 'INTEC-ENS-4471',
    '$2a$10$RnF66WXMYShqz1XlDY5KruZo94RQ97j6MQc3c6Y/bXwcs00J9Q5ey',
    'KEITA', 'Ballasky', 'ENSEIGNANT', '51463394'
WHERE NOT EXISTS (
    SELECT 1 FROM public.utilisateur WHERE email = 'mousbykeita225@gmail.com'
);

-- 3) Ligne enfant ENSEIGNANT (héritage JOINED) pour ce compte
INSERT INTO public.enseignant (id, date_embauche, grade, specialite)
SELECT u.id, '2026-06-14', 'Professeur', 'Comptabilite'
FROM public.utilisateur u
WHERE u.email = 'mousbykeita225@gmail.com'
  AND NOT EXISTS (
      SELECT 1 FROM public.enseignant e WHERE e.id = u.id
  );

COMMIT;

-- Vérification (lecture seule)
SELECT id, email, matricule, role, actif, LEFT(mot_de_passe, 29) AS hash_prefix
FROM public.utilisateur
WHERE email IN ('moussa.b.keita223@gmail.com', 'mousbykeita225@gmail.com')
ORDER BY id;
