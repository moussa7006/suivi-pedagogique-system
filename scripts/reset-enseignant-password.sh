#!/bin/bash
# ============================================================
#  EduTrack - Reinitialisation du mot de passe enseignant
#  Utilise le compte admin pour reinitialiser le mot de passe
#
<<<<<<< HEAD
#  Usage: ./scripts/reset-enseignant-password.sh
#         ./scripts/reset-enseignant-password.sh ayabourama4@gmail.com "NouveauMdp123!"
#
#  Par defaut, cible ayabourama4@gmail.com
=======
#  Usage: ./scripts/reset-enseignant-password.sh <email-enseignant> "NouveauMdp123!"
#         ./scripts/reset-enseignant-password.sh ayabourama4@gmail.com "NouveauMdp123!"
#
#  Les identifiants admin se configurent via les variables d'environnement
#  ADMIN_EMAIL et ADMIN_PASSWORD (aucun mot de passe par defaut).
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
# ============================================================
set -e

BACKEND_URL="${BACKEND_URL:-http://localhost:8099}"
<<<<<<< HEAD
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@edutrack.local}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin1234!}"

ENSEIGNANT_EMAIL="${1:-ayabourama4@gmail.com}"
NEW_PASSWORD="${2:-Boura_12345678911!}"
=======
ADMIN_EMAIL="${ADMIN_EMAIL:-}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

ENSEIGNANT_EMAIL="${1:-}"
NEW_PASSWORD="${2:-}"

if [ -z "$ENSEIGNANT_EMAIL" ] || [ -z "$NEW_PASSWORD" ]; then
  echo "Usage: $0 <email-enseignant> \"NouveauMotDePasse\"" >&2
  echo "Exemple: $0 enseignant@example.com \"NouveauMdp123!\"" >&2
  exit 2
fi
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d

echo "============================================"
echo "  EduTrack - Reset mot de passe enseignant"
echo "============================================"
echo ""
echo "Backend:        $BACKEND_URL"
echo "Admin:          $ADMIN_EMAIL"
echo "Enseignant:     $ENSEIGNANT_EMAIL"
echo "Nouveau mdp:    $NEW_PASSWORD"
echo ""

# Etape 1 : Login admin
echo ">>> Etape 1: Connexion admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"motDePasse\":\"$ADMIN_PASSWORD\"}")

ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "ERREUR: Impossible de se connecter en tant qu'admin."
  echo "Reponse: $LOGIN_RESPONSE"
  echo ""
  echo "Verifiez que:"
  echo "  1. Le backend est demarre sur $BACKEND_URL"
  echo "  2. Le compte admin $ADMIN_EMAIL existe"
  echo "  3. Le mot de passe admin est correct"
  exit 1
fi

echo "    Token admin obtenu."

# Etape 2 : Reset du mot de passe
echo ""
echo ">>> Etape 2: Reinitialisation du mot de passe de $ENSEIGNANT_EMAIL..."
RESET_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/admin/reset-user-password" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"email\":\"$ENSEIGNANT_EMAIL\",\"newPassword\":\"$NEW_PASSWORD\"}")

echo "    Reponse: $RESET_RESPONSE"

# Etape 3 : Test de connexion enseignant
echo ""
echo ">>> Etape 3: Test de connexion enseignant..."
TEST_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ENSEIGNANT_EMAIL\",\"motDePasse\":\"$NEW_PASSWORD\"}")

TEST_TOKEN=$(echo "$TEST_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TEST_TOKEN" ]; then
  echo "    SUCCES ! Connexion enseignant reussie."
  echo "    Role: $(echo "$TEST_RESPONSE" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)"
  echo ""
  echo "============================================"
  echo "  RESET REUSSI !"
  echo "============================================"
  echo ""
  echo "  Email:    $ENSEIGNANT_EMAIL"
  echo "  Password: $NEW_PASSWORD"
  echo ""
else
  echo "    ECHEC de connexion enseignant."
  echo "    Reponse: $TEST_RESPONSE"
  echo ""
  echo "    Cela peut arriver si:"
  echo "    - L'utilisateur $ENSEIGNANT_EMAIL n'existe pas"
  echo "    - Le mot de passe ne respecte pas la politique (14+ chars, maj, min, chiffre, symbole)"
  exit 1
fi
