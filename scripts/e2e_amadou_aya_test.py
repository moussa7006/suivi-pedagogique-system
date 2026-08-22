#!/usr/bin/env python3
"""Test E2E complet - Enseignant "Amadou Aya" (cote mobile + verification admin).

Etapes :
  1. Connexion admin (essai de plusieurs identifiants)
  2. Recherche de l'enseignant "Amadou Aya" deja cree
  3. Reinitialisation de son mot de passe (test non bloquant, forcePasswordChange=false)
  4. Creation du referentiel + emploi du temps + seance du jour assignee a l'enseignant
  5. Generation du QR code de la seance
  6. Flux MOBILE enseignant :
       - login, profil (auth/me)
       - planning (emploi-du-temps)
       - seances du jour
       - scan QR / emargement
       - cahier de textes / fiche de progression
       - list fiches, historique emargements
       - mes-honoraires
  7. Verification ADMIN : emargements, fiches, calcul/valider/payer honoraires
  8. (optionnel) changement de mot de passe enseignant
"""
from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request
from datetime import date, datetime, timedelta

API = "http://localhost:8099/api"

# Identifiants admin candidats (on garde le premier qui marche).
ADMIN_CANDIDATES = [
    ("admin@edutrack.local", "ChangeMe123456!"),
    ("admin@edutrack.local", "Admin1234!"),
    ("moussa.b.keita223@gmail.com", "Admin123456789!"),
    ("moussa.b.keita223@gmail.com", "admin123"),
]
TEACHER_KEYWORDS = ("amadou", "aya")
# Mot de passe de test conforme a la politique (>=14 car, maj, min, chiffre, symbole).
TEACHER_PASSWORD = "EduTrackTest1234!"
TEACHER_PASSWORD_NEXT = "EduTrackTest1235!"

GEO_LAT = 12.6392
GEO_LON = -8.0029

results: list[tuple[str, bool, str]] = []


# --------------------------------------------------------------------------- #
#  Utilitaires HTTP
# --------------------------------------------------------------------------- #
def request(method: str, url: str, token: str | None = None,
            payload: dict | None = None, expected: set[int] | None = None,
            timeout: int = 30):
    data = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8")
            parsed = None
            if body:
                try:
                    parsed = json.loads(body)
                except json.JSONDecodeError:
                    parsed = body
            if expected and resp.status not in expected:
                raise RuntimeError(f"HTTP {resp.status}: {str(body)[:500]}")
            return resp.status, parsed
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        if expected and exc.code in expected:
            try:
                return exc.code, json.loads(raw) if raw else None
            except json.JSONDecodeError:
                return exc.code, raw
        raise RuntimeError(f"HTTP {exc.code}: {raw[:800]}")


def api_request(method: str, path: str, token: str | None = None,
                payload: dict | None = None, expected: set[int] | None = None):
    return request(method, f"{API}{path}", token, payload, expected)


def log(name: str, ok: bool, detail: str = "") -> None:
    results.append((name, ok, detail))
    status = "OK  " if ok else "FAIL"
    print(f"[{status}] {name}{(' -> ' + detail) if detail else ''}")


def step(name: str, fn):
    try:
        detail = fn()
        log(name, True, detail if isinstance(detail, str) else "")
    except Exception as exc:  # noqa: BLE001
        log(name, False, str(exc)[:300])


def now_times() -> tuple[str, str, str, str, int, int]:
    """Renvoie les horaires encadres autour de l'instant present."""
    n = datetime.now()
    start = (n - timedelta(minutes=5)).replace(microsecond=0)
    end = (n + timedelta(hours=2)).replace(microsecond=0)
    return (
        start.strftime("%H:%M:%S"),
        end.strftime("%H:%M:%S"),
        start.strftime("%H:%M"),
        end.strftime("%H:%M"),
        n.year,
        n.month,
    )


# --------------------------------------------------------------------------- #
#  Etat global
# --------------------------------------------------------------------------- #
admin_token: str | None = None
admin_email: str | None = None
teacher: dict | None = None
teacher_token: str | None = None
seance_id: int | None = None
qr_token: str | None = None
emargement_id: int | None = None
fiche_id: int | None = None
calcul_id: int | None = None


# --------------------------------------------------------------------------- #
#  PHASE 1 - Connexion admin + recherche enseignant
# --------------------------------------------------------------------------- #
def login_admin():
    global admin_token, admin_email
    last_err = ""
    for email, password in ADMIN_CANDIDATES:
        try:
            _, body = api_request(
                "POST", "/auth/login",
                payload={"email": email, "motDePasse": password},
                expected={200},
            )
            if isinstance(body, dict) and body.get("token"):
                admin_token = body["token"]
                admin_email = email
                return f"{email} (role={body.get('role')})"
        except RuntimeError as exc:
            last_err = str(exc)
    raise RuntimeError(f"Aucun identifiant admin n'a fonctionne. Derniere erreur: {last_err}")


def find_teacher():
    global teacher
    _, body = api_request("GET", "/utilisateurs/lister-tous", admin_token, expected={200})
    users = body if isinstance(body, list) else []
    matches = []
    for u in users:
        nom = (u.get("nom") or "").lower()
        prenom = (u.get("prenom") or "").lower()
        full = f"{nom} {prenom}"
        if any(kw in full for kw in TEACHER_KEYWORDS) and u.get("role") == "ENSEIGNANT":
            matches.append(u)
    if not matches:
        raise RuntimeError(
            f"Aucun enseignant contenant {TEACHER_KEYWORDS} trouve "
            f"({len(users)} utilisateur(s) au total)"
        )
    teacher = matches[0]
    return (
        f"id={teacher.get('id')}, nom={teacher.get('nom')} {teacher.get('prenom')}, "
        f"email={teacher.get('email')}"
    )


def reset_teacher_password():
    email = teacher["email"]
    api_request(
        "POST", "/auth/admin/reset-user-password", admin_token,
        payload={"email": email, "newPassword": TEACHER_PASSWORD},
        expected={200},
    )
    return f"mot de passe reinitialise pour {email}"


# --------------------------------------------------------------------------- #
#  PHASE 2 - Referentiel + seance + QR
# --------------------------------------------------------------------------- #
created: dict[str, dict] = {}


def create_referentials():
    run_id = datetime.now().strftime("%Y%m%d%H%M%S")
    _, d = api_request("POST", "/departements", admin_token,
                       {"libelle": f"Dept E2E {run_id}"}, expected={200, 201})
    created["departement"] = d
    _, f = api_request("POST", "/filieres", admin_token,
                       {"libelle": f"Filiere E2E {run_id}",
                        "departementId": d["id"]}, expected={200, 201})
    created["filiere"] = f
    _, n = api_request("POST", "/niveau-enseignement", admin_token,
                       {"libelle": f"Licence E2E {run_id}",
                        "prixHoraire": 5000.0}, expected={200, 201})
    created["niveau"] = n
    # On reutilise l'annee universitaire existante (active) plutot que d'en
    # creer une nouvelle : la creation echoue si l'intervalle chevauche une
    # annee deja enregistree (ex. 2025-2026 du DataSeeder).
    _, annees = api_request("GET", "/annee-universitaire", admin_token,
                            expected={200})
    annee = next((a for a in annees
                  if a.get("active") is True), None)
    if annee is None and annees:
        annee = annees[0]
    if not annee:
        raise RuntimeError("Aucune annee universitaire existante a reutiliser")
    created["annee"] = annee
    _, c = api_request("POST", "/classes", admin_token,
                       {"libelle": f"Classe E2E {run_id}",
                        "filiereId": f["id"],
                        "niveauEnseignementId": n["id"],
                        "anneeUniversitaireId": created["annee"]["id"]}, expected={200, 201})
    created["classe"] = c
    c_id = c["id"]
    _, m = api_request("POST", "/matieres", admin_token,
                       {"code": f"E2E{run_id[-6:]}",
                        "libelle": f"Matiere E2E {run_id}",
                        "volumeHoraireTotal": 40,
                        "departementId": d["id"]}, expected={200, 201})
    created["matiere"] = m
    _, s = api_request("POST", "/salles", admin_token,
                       {"nom": f"Salle E2E {run_id[-6:]}",
                        "batiment": "Bloc E2E", "capacite": 40,
                        "equipement": "Projecteur, Wi-Fi",
                        "adresseIp": f"192.168.{int(run_id[-4:-2])}.{int(run_id[-2:])}"},
                       expected={200, 201})
    created["salle"] = s
    return (
        f"dept={d['id']} filiere={f['id']} niveau={n['id']} (prixHoraire=5000) "
        f"annee={created['annee']['id']} (reuse) classe={c_id} "
        f"matiere={m['id']} salle={s['id']}"
    )


def normalize_date(value) -> str:
    """Normalise dateCours (string 'YYYY-MM-DD' ou tableau [Y,M,D]) en 'YYYY-MM-DD'."""
    if isinstance(value, str):
        return value[:10]
    if isinstance(value, list) and len(value) >= 3:
        y, m, d = value[0], value[1], value[2]
        return f"{int(y):04d}-{int(m):02d}-{int(d):02d}"
    return ""


def create_emploi_and_seance():
    global seance_id
    start_full, end_full, start_m, end_m, _, _ = now_times()
    today_iso = str(date.today())
    tid = teacher["id"]

    # 1. Reutiliser une seance existante du jour pour cet enseignant, sans
    #    emargement (propre). Evite les chevauchements lors des relances.
    _, all_seances = api_request("GET", "/seances", admin_token, expected={200})
    reusable = [
        s for s in all_seances
        if s.get("enseignantId") == tid
        and normalize_date(s.get("dateCours")) == today_iso
        and not s.get("emargementId")
    ]
    if reusable:
        target = reusable[0]
        seance_id = target["id"]
        api_request("PUT", f"/seances/{seance_id}", admin_token, {
            "dateCours": today_iso,
            "heureDebutReelle": start_full,
            "heureFinReelle": end_full,
            "statut": "PREVUE",
            "salleId": target.get("salleId"),
            "emploiDuTempsId": target.get("emploiDuTempsId"),
            "enseignantId": tid,
            "classeId": target.get("classeId"),
        }, expected={200})
        return (f"seance reutilisee id={seance_id} "
                f"(horaires recalés {start_full}-{end_full})")

    # 2. Sinon, creer un emploi du temps + seance.
    _, edt = api_request("POST", "/emploi-du-temps", admin_token, {
        "titre": f"Cours E2E Amadou Aya {datetime.now().strftime('%H%M%S')}",
        "typeRecurrence": "UNIQUE",
        "dateDebutValidite": today_iso,
        "dateFinValidite": today_iso,
        "dateSpecifique": today_iso,
        "heureDebut": start_m,
        "heureFin": end_m,
        "salleId": created["salle"]["id"],
        "enseignantId": tid,
        "classeId": created["classe"]["id"],
        "matiereId": created["matiere"]["id"],
        "anneeUniversitaireId": created["annee"]["id"],
    }, expected={200, 201})
    created["emploi"] = edt

    # La creation de l'emploi genere peut-etre une seance ; sinon on en cree une.
    _, seances = api_request("GET", "/seances", admin_token, expected={200})
    mine = [s for s in seances
            if s.get("emploiDuTempsId") == edt["id"] and s.get("enseignantId") == tid]
    if mine:
        seance_id = mine[0]["id"]
        api_request("PUT", f"/seances/{seance_id}", admin_token, {
            "dateCours": today_iso,
            "heureDebutReelle": start_full,
            "heureFinReelle": end_full,
            "statut": "PREVUE",
            "salleId": created["salle"]["id"],
            "emploiDuTempsId": edt["id"],
            "enseignantId": tid,
            "classeId": created["classe"]["id"],
        }, expected={200})
        src = "auto-generee par l'emploi du temps"
    else:
        _, seance = api_request("POST", "/seances", admin_token, {
            "dateCours": today_iso,
            "heureDebutReelle": start_full,
            "heureFinReelle": end_full,
            "statut": "PREVUE",
            "salleId": created["salle"]["id"],
            "emploiDuTempsId": edt["id"],
            "enseignantId": tid,
            "classeId": created["classe"]["id"],
        }, expected={200, 201})
        seance_id = seance["id"]
        src = "creee manuellement"
    return f"emploi={edt['id']} seance={seance_id} ({src}) horaire={start_full}-{end_full}"


def generate_qr():
    global qr_token
    _, body = api_request("POST", f"/seances/{seance_id}/qr-code",
                          admin_token, payload={}, expected={200, 201})
    qr_token = body.get("qrCodeToken")
    if not qr_token:
        raise RuntimeError(f"QR token absent: {body}")
    return f"token QR={qr_token[:24]}..."


# --------------------------------------------------------------------------- #
#  PHASE 3 - Flux MOBILE enseignant
# --------------------------------------------------------------------------- #
def teacher_login():
    global teacher_token
    _, body = api_request("POST", "/auth/login", payload={
        "email": teacher["email"], "motDePasse": TEACHER_PASSWORD,
    }, expected={200})
    teacher_token = body.get("token")
    if not teacher_token:
        raise RuntimeError("Token enseignant absent")
    return f"connecte: {body.get('prenom')} {body.get('nom')} (role={body.get('role')})"


def teacher_profile():
    _, body = api_request("GET", "/auth/me", teacher_token, expected={200})
    return (
        f"id={body.get('id')} specialite={body.get('specialite')} "
        f"grade={body.get('grade')}"
    )


def teacher_planning():
    _, body = api_request("GET", "/emploi-du-temps", teacher_token, expected={200})
    n = len(body) if isinstance(body, list) else 0
    has_mine = any(e.get("enseignantId") == teacher["id"] for e in body) if n else False
    if not has_mine:
        raise RuntimeError("L'emploi du temps de l'enseignant n'apparait pas")
    return f"{n} emploi(s) du temps dont le sien"


def teacher_seances():
    _, body = api_request("GET", "/seances", teacher_token, expected={200})
    n = len(body) if isinstance(body, list) else 0
    mine = [s for s in body if s.get("enseignantId") == teacher["id"]] if n else []
    found = next((s for s in mine if s.get("id") == seance_id), None)
    if not found:
        raise RuntimeError(f"Seance {seance_id} introuvable chez l'enseignant")
    if not found.get("qrCodeToken"):
        raise RuntimeError("Token QR absent de la seance vue par l'enseignant")
    return f"{n} seances, {len(mine)} a lui, seance cible={seance_id} avec QR"


def teacher_scan():
    global emargement_id
    _, body = api_request("POST", "/emargements/scan", teacher_token, payload={
        "seanceId": seance_id,
        "tokenQRCode": qr_token,
        "latitude": GEO_LAT,
        "longitude": GEO_LON,
        "adresseApproximative": "Test E2E Amadou Aya",
    }, expected={200, 201})
    emargement_id = body.get("emargementId")
    statut = body.get("statut")
    if statut != "EN_ATTENTE_FICHE":
        raise RuntimeError(f"Statut inattendu apres scan: {statut}")
    return f"emargementId={emargement_id} statut={statut}"


def teacher_create_fiche():
    global fiche_id
    _, body = api_request("POST", f"/fiche-progression/{seance_id}",
                          teacher_token, payload={
        "dateSaisie": str(date.today()),
        "contenuDetaille": "Cours E2E : structures de donnees avancees et algorithmes.",
        "objectifs": "Maitriser les listes chainees et les arbres de recherche.",
        "travaux": "Exercices pratiques sur les arbres binaires de recherche.",
    }, expected={200, 201})
    fiche_id = body.get("id")
    if not fiche_id:
        raise RuntimeError(f"Fiche sans id: {body}")
    return (f"fiche id={fiche_id} estValideAdmin={body.get('estValideAdmin')} "
            f"matiere={body.get('matiereLibelle')}")


def teacher_list_fiches():
    _, body = api_request("GET", "/fiche-progression", teacher_token, expected={200})
    n = len(body) if isinstance(body, list) else 0
    if not any(f.get("id") == fiche_id for f in body):
        raise RuntimeError("La fiche creee n'apparait pas dans la liste enseignant")
    return f"{n} fiche(s), la sienne est presente"


def teacher_historique():
    _, body = api_request("GET", "/emargements", teacher_token, expected={200})
    n = len(body) if isinstance(body, list) else 0
    mine = [e for e in body if e.get("enseignantNomPrenom")]
    if not any(e.get("id") == emargement_id for e in body):
        raise RuntimeError("L'emargement cree n'apparait pas dans l'historique enseignant")
    statut = next((e.get("statut") for e in body if e.get("id") == emargement_id), None)
    return f"{n} emargement(s), statut du scan={statut}"


def teacher_honoraires():
    _, body = api_request("GET", "/honoraires/mes-honoraires", teacher_token,
                          expected={200})
    n = len(body) if isinstance(body, list) else 0
    # La preview mensuelle doit fonctionner meme avant calcul admin (seance payable).
    year, month = date.today().year, date.today().month
    try:
        _, preview = api_request(
            "GET",
            f"/honoraires/mes-honoraires/mois?annee={year}&mois={month}",
            teacher_token, expected={200},
        )
        prev_info = (f"preview mois={preview.get('mois')} "
                     f"heures={preview.get('totalHeures')} "
                     f"montant={preview.get('montantBrut')} "
                     f"statut={preview.get('statut')}")
    except RuntimeError as exc:
        prev_info = f"preview indisponible: {str(exc)[:120]}"
    return f"{n} calcul(s) enregistre(s); {prev_info}"


# --------------------------------------------------------------------------- #
#  PHASE 4 - Verification ADMIN
# --------------------------------------------------------------------------- #
def admin_verify_emargement():
    _, body = api_request("GET", "/emargements", admin_token, expected={200})
    found = next((e for e in body if e.get("id") == emargement_id), None) if body else None
    if not found:
        raise RuntimeError("Emargement introuvable cote admin")
    statut = found.get("statut")
    if statut != "VALIDE":
        raise RuntimeError(f"Statut emargement attendu=VALIDE, trouve={statut}")
    return f"emargementId={emargement_id} statut={statut} prof={found.get('enseignantNomPrenom')}"


def admin_verify_fiche():
    _, body = api_request("GET", "/fiche-progression", admin_token, expected={200})
    found = next((f for f in body if f.get("id") == fiche_id), None) if body else None
    if not found:
        raise RuntimeError("Fiche introuvable cote admin")
    if found.get("estValideAdmin") is not True:
        raise RuntimeError("La fiche n'est pas validee admin")
    return (f"ficheId={fiche_id} estValideAdmin=True "
            f"enseignant={found.get('enseignantNomPrenom')} "
            f"matiere={found.get('matiereLibelle')}")


def admin_compute_honoraires():
    global calcul_id
    year, month = date.today().year, date.today().month
    _, body = api_request("POST", "/honoraires/calculer", admin_token, payload={
        "enseignantId": teacher["id"], "annee": year, "mois": month,
    }, expected={200, 201})
    calcul_id = body.get("id")
    return (f"calculId={calcul_id} heures={body.get('totalHeures')} "
            f"montant={body.get('montantBrut')} statut={body.get('statut')}")


def admin_list_teacher_honoraires():
    _, body = api_request("GET", f"/honoraires/enseignant/{teacher['id']}",
                          admin_token, expected={200})
    n = len(body) if isinstance(body, list) else 0
    if calcul_id and not any(c.get("id") == calcul_id for c in body):
        raise RuntimeError("Le calcul cree n'apparait pas cote enseignant (admin view)")
    return f"{n} calcul(s) pour l'enseignant, calcul cible present"


def admin_validate_and_pay_honoraires():
    # Validation
    _, v = api_request("PATCH", f"/honoraires/{calcul_id}/valider",
                       admin_token, expected={200})
    if v.get("statut") != "VALIDE":
        raise RuntimeError(f"Validation echouee: {v.get('statut')}")
    # Paiement
    _, p = api_request("PATCH", f"/honoraires/{calcul_id}/payer",
                       admin_token, expected={200})
    if p.get("statut") != "PAYE":
        raise RuntimeError(f"Paiement echoue: {p.get('statut')}")
    return f"calculId={calcul_id} VALIDE -> PAYE"


def admin_verify_teacher_listed():
    _, body = api_request("GET", "/utilisateurs/lister-tous", admin_token, expected={200})
    if not any(u.get("id") == teacher["id"] for u in body):
        raise RuntimeError("L'enseignant n'apparait pas dans la liste des utilisateurs")
    return f"enseignant id={teacher['id']} present dans la liste ({len(body)} users)"


# --------------------------------------------------------------------------- #
#  PHASE 5 - Changement de mot de passe enseignant (derniere action mobile)
# --------------------------------------------------------------------------- #
def teacher_change_password():
    _, body = api_request("POST", "/auth/change-password", teacher_token, payload={
        "currentPassword": TEACHER_PASSWORD,
        "newPassword": TEACHER_PASSWORD_NEXT,
    }, expected={200})
    return f"mot de passe modifie -> nouveau: {TEACHER_PASSWORD_NEXT}"


# --------------------------------------------------------------------------- #
#  Main
# --------------------------------------------------------------------------- #
def main() -> int:
    print("=" * 72)
    print("  TEST E2E - Enseignant Amadou Aya (mobile + admin)")
    print("=" * 72)

    print("\n--- PHASE 1 : Connexion admin + recherche enseignant ---")
    step("Connexion administrateur", login_admin)
    step("Recherche enseignant Amadou Aya", find_teacher)
    step("Reinitialisation mot de passe enseignant", reset_teacher_password)

    print("\n--- PHASE 2 : Referentiel + emploi du temps + seance + QR ---")
    step("Creation referentiel academique", create_referentials)
    step("Creation emploi du temps + seance du jour", create_emploi_and_seance)
    step("Generation QR code de la seance", generate_qr)

    print("\n--- PHASE 3 : Flux MOBILE enseignant ---")
    step("Login enseignant", teacher_login)
    step("Profil (auth/me)", teacher_profile)
    step("Planning (emploi-du-temps)", teacher_planning)
    step("Seances du jour", teacher_seances)
    step("Scan QR / emargement", teacher_scan)
    step("Cahier de textes (fiche de progression)", teacher_create_fiche)
    step("Liste fiches de progression", teacher_list_fiches)
    step("Historique emargements", teacher_historique)
    step("Mes honoraires", teacher_honoraires)

    print("\n--- PHASE 4 : Verification ADMIN ---")
    step("Emargement valide cote admin", admin_verify_emargement)
    step("Fiche de progression validee cote admin", admin_verify_fiche)
    step("Calcul des honoraires", admin_compute_honoraires)
    step("Honoraires enseignant (vue admin)", admin_list_teacher_honoraires)
    step("Validation + paiement honoraires", admin_validate_and_pay_honoraires)
    step("Enseignant present dans liste utilisateurs", admin_verify_teacher_listed)

    print("\n--- PHASE 5 : Changement mot de passe enseignant ---")
    step("Changement mot de passe (mobile)", teacher_change_password)

    # Resume
    print("\n" + "=" * 72)
    print("  RESUME DU TEST")
    print("=" * 72)
    passed = sum(1 for _, ok, _ in results if ok)
    failed = len(results) - passed
    for name, ok, detail in results:
        mark = "OK  " if ok else "FAIL"
        print(f"  [{mark}] {name}{(' -> ' + detail) if detail else ''}")

    print("\n" + "-" * 72)
    print(f"  Resultat : {passed} OK / {failed} FAIL sur {len(results)} etapes")
    print("-" * 72)
    print(f"  Enseignant    : {teacher.get('nom')} {teacher.get('prenom')} "
          f"(id={teacher.get('id')})")
    print(f"  Email         : {teacher.get('email')}")
    print(f"  Mot de passe  : {TEACHER_PASSWORD_NEXT} (modifie en phase 5)")
    print(f"  Seance testee : id={seance_id}")
    print(f"  Emargement    : id={emargement_id}")
    print(f"  Fiche         : id={fiche_id}")
    print(f"  Calcul hon.   : id={calcul_id}")
    print("-" * 72)
    print("  Acces visuels :")
    print("    Mobile enseignant : http://localhost:8100/mobile/login")
    print("    Web admin          : http://localhost:8100/web/login")
    print("    Swagger            : http://localhost:8099/swagger-ui.html")
    print("=" * 72)

    return 1 if failed else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001
        print(f"\nERREUR FATALE: {exc}", file=sys.stderr)
        raise SystemExit(2)
