-- ============================================================================
--  EduTrack — Diagnostic de connexion (LECTURE SEULE)
--  Ce script ne modifie RIEN : il affiche uniquement l'état des comptes.
--
--  Utilisation (Linux/macOS) :
--    psql -U postgres -d db_suivipedago -f scripts/diagnostic-connexion.sql
--
--  Utilisation (Windows, invité de commandes) :
--    psql -U postgres -d db_suivipedago -f scripts\diagnostic-connexion.sql
-- ============================================================================

\echo '=========================================================='
\echo '1) Base de donnees courante'
\echo '=========================================================='
SELECT current_database() AS base, current_user AS utilisateur, now() AS horodatage;

\echo ''
\echo '=========================================================='
\echo '2) Nombre total d utilisateurs (vide => data.sql serait recharge)'
\echo '=========================================================='
SELECT count(*) AS total_utilisateurs FROM public.utilisateur;

\echo ''
\echo '=========================================================='
\echo '3) Les 2 comptes concernes'
\echo '    - moussa.b.keita223@gmail.com  (ADMIN web)'
\echo '    - mousbykeita225@gmail.com     (ENSEIGNANT mobile)'
\echo '=========================================================='
SELECT
    id,
    email,
    role,
    actif,
    force_password_change,
    matricule,
    nom,
    prenom,
    LEFT(mot_de_passe, 29) AS hash_prefix
FROM public.utilisateur
WHERE email IN ('moussa.b.keita223@gmail.com', 'mousbykeita225@gmail.com')
ORDER BY id;

\echo ''
\echo '=========================================================='
\echo '4) Comparaison avec les hash attendus (dans data.sql)'
\echo '    OK => le hash en base est identique a data.sql'
\echo '    DIFFERENT => le mot de passe en base ne correspond plus'
\echo '=========================================================='
SELECT
    u.id,
    u.email,
    CASE
        WHEN u.mot_de_passe = '$2a$10$6ua0P89Y7iiu.Ammk17c0O4GjeyQyIKevnGBJyDrLTwlgmBWjgUNu'
             THEN 'OK'
        ELSE 'DIFFERENT'
    END AS admin_hash_data_sql,
    CASE
        WHEN u.mot_de_passe = '$2a$10$RnF66WXMYShqz1XlDY5KruZo94RQ97j6MQc3c6Y/bXwcs00J9Q5ey'
             THEN 'OK'
        ELSE 'DIFFERENT'
    END AS enseignant_hash_data_sql
FROM public.utilisateur u
WHERE u.email IN ('moussa.b.keita223@gmail.com', 'mousbykeita225@gmail.com')
ORDER BY u.id;

\echo ''
\echo '=========================================================='
\echo '5) Tous les comptes ADMINISTRATEUR (pour confirmer qu aucun'
\echo '   admin n a ete supprime)'
\echo '=========================================================='
SELECT id, email, matricule, actif
FROM public.utilisateur
WHERE role = 'ADMINISTRATEUR'
ORDER BY id;

\echo ''
\echo '=========================================================='
\echo '6) Tous les comptes ENSEIGNANT portant le nom KEITA'
\echo '=========================================================='
SELECT id, email, matricule, actif
FROM public.utilisateur
WHERE role = 'ENSEIGNANT' AND upper(nom) = 'KEITA'
ORDER BY id;

\echo ''
\echo '=========================================================='
\echo 'Fin du diagnostic. Aucune donnee n a ete modifiee.'
\echo '=========================================================='
