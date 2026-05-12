#!/usr/bin/env python3
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta

API = "http://localhost:8099/api"
FRONT = "http://localhost:4200"
ADMIN_EMAIL = "moussa.b.keita223@gmail.com"
ADMIN_PASSWORD = "admin123"

results = []
admin_token = None
teacher_token = None
created = {}


def log(name, ok, detail=""):
    status = "OK" if ok else "FAIL"
    results.append((name, ok, detail))
    print(f"[{status}] {name}{' -> ' + detail if detail else ''}")


def request(method, url, token=None, payload=None, expected=None, timeout=20):
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
                raise RuntimeError(f"HTTP {resp.status}: {body[:500]}")
            return resp.status, parsed
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        if expected and e.code in expected:
            try:
                return e.code, json.loads(body) if body else None
            except json.JSONDecodeError:
                return e.code, body
        raise RuntimeError(f"HTTP {e.code}: {body[:800]}")


def step(name, fn):
    try:
        detail = fn()
        log(name, True, detail if isinstance(detail, str) else "")
    except Exception as exc:
        log(name, False, str(exc))


def create(path, payload):
    _, body = request("POST", f"{API}{path}", admin_token, payload, expected={200, 201})
    if not isinstance(body, dict) or "id" not in body:
        raise RuntimeError(f"Réponse sans id: {body}")
    return body


def update(path, payload):
    _, body = request("PUT", f"{API}{path}", admin_token, payload, expected={200})
    return body


def delete(path):
    status, _ = request(
        "DELETE", f"{API}{path}", admin_token, None, expected={200, 204}
    )
    return status


def get(path, token=None):
    _, body = request("GET", f"{API}{path}", token or admin_token, None, expected={200})
    return body


suffix = datetime.now().strftime("%Y%m%d%H%M%S")
today = date.today()
start = today.isoformat()
end = (today + timedelta(days=120)).isoformat()
seance_start = "00:00:00"
seance_end = "23:59:00"

step(
    "Backend Swagger joignable",
    lambda: str(
        request("GET", "http://localhost:8099/swagger-ui.html", expected={200, 302})[0]
    ),
)


def login_admin():
    global admin_token
    _, body = request(
        "POST",
        f"{API}/auth/login",
        payload={"email": ADMIN_EMAIL, "motDePasse": ADMIN_PASSWORD},
        expected={200},
    )
    admin_token = body.get("token")
    if not admin_token:
        raise RuntimeError("Token admin absent")
    return body.get("role", "")


step("Connexion administrateur", login_admin)

step(
    "Lister utilisateurs initial",
    lambda: f"{len(get('/utilisateurs/lister-tous'))} utilisateur(s)",
)


def create_referentials():
    created["departement"] = create(
        "/departements", {"libelle": f"Département Test Admin {suffix}"}
    )
    created["filiere"] = create(
        "/filieres",
        {
            "libelle": f"Filière Test Admin {suffix}",
            "departementId": created["departement"]["id"],
        },
    )
    created["niveau"] = create(
        "/niveau-enseignement",
        {"libelle": f"Niveau Test Admin {suffix}", "prixHoraire": 12500.0},
    )
    created["classe"] = create(
        "/classes",
        {
            "libelle": f"Classe Test Admin {suffix}",
            "filiereId": created["filiere"]["id"],
            "niveauEnseignementId": created["niveau"]["id"],
        },
    )
    created["matiere"] = create(
        "/matieres",
        {
            "code": f"MAT{suffix[-6:]}",
            "libelle": f"Matière Test Admin {suffix}",
            "volumeHoraireTotal": 40,
            "departementId": created["departement"]["id"],
        },
    )
    created["salle"] = create(
        "/salles",
        {
            "nom": f"Salle Test Admin {suffix}",
            "batiment": "Bloc Test",
            "capacite": 45,
            "equipement": "Projecteur",
            "adresseIp": f"192.168.{int(suffix[-4:-2])}.{int(suffix[-2:])}",
        },
    )
    created["annee"] = create(
        "/annee-universitaire",
        {
            "libelle": f"Année Test Admin {suffix}",
            "dateDebut": start,
            "dateFin": end,
            "active": True,
        },
    )
    return "département, filière, niveau, classe, matière, salle, année créés"


step("Créer référentiels admin", create_referentials)


def update_referentials():
    update(
        f"/departements/{created['departement']['id']}",
        {"libelle": f"Département Test Admin MAJ {suffix}"},
    )
    update(
        f"/filieres/{created['filiere']['id']}",
        {
            "libelle": f"Filière Test Admin MAJ {suffix}",
            "departementId": created["departement"]["id"],
        },
    )
    update(
        f"/niveau-enseignement/{created['niveau']['id']}",
        {"libelle": f"Niveau Test Admin MAJ {suffix}", "prixHoraire": 13000.0},
    )
    update(
        f"/classes/{created['classe']['id']}",
        {
            "libelle": f"Classe Test Admin MAJ {suffix}",
            "filiereId": created["filiere"]["id"],
            "niveauEnseignementId": created["niveau"]["id"],
        },
    )
    update(
        f"/matieres/{created['matiere']['id']}",
        {
            "code": created["matiere"]["code"],
            "libelle": f"Matière Test Admin MAJ {suffix}",
            "volumeHoraireTotal": 48,
            "departementId": created["departement"]["id"],
        },
    )
    update(
        f"/salles/{created['salle']['id']}",
        {
            "nom": created["salle"]["nom"],
            "batiment": "Bloc Test MAJ",
            "capacite": 50,
            "equipement": "Projecteur + Tableau",
            "adresseIp": created["salle"]["adresseIp"],
        },
    )
    update(
        f"/annee-universitaire/{created['annee']['id']}",
        {
            "libelle": f"Année Test Admin MAJ {suffix}",
            "dateDebut": start,
            "dateFin": end,
            "active": True,
        },
    )
    return "CRUD update référentiels validé"


step("Modifier référentiels admin", update_referentials)


def create_teacher():
    payload = {
        "nom": "EnseignantTest",
        "prenom": "AdminFlow",
        "email": f"enseignant.test.{suffix}@example.com",
        "motDePasse": "Teacher123!",
        "matricule": f"ENS-{suffix}",
        "telephone": f"77{suffix[-6:]}",
        "adresse": "Adresse test",
        "role": "ENSEIGNANT",
        "specialite": "Informatique",
        "dateEmbauche": start,
        "grade": "Assistant",
    }
    _, body = request(
        "POST", f"{API}/auth/register", admin_token, payload, expected={201}
    )
    created["teacher"] = body
    created["teacher_email"] = payload["email"]
    return f"id={body.get('id')}"


step("Créer enseignant via admin", create_teacher)


def update_teacher():
    tid = created["teacher"]["id"]
    body = update(
        f"/utilisateurs/modifier/{tid}",
        {
            "nom": "EnseignantTestMaj",
            "prenom": "AdminFlow",
            "email": created["teacher_email"],
            "telephone": f"78{suffix[-6:]}",
            "adresse": "Adresse test MAJ",
            "matricule": f"ENS-{suffix}",
            "actif": True,
        },
    )
    return f"id={body.get('id')}"


step("Modifier enseignant", update_teacher)


def create_schedule_and_seance():
    schedule_payload = {
        "titre": f"Planning Test Admin {suffix}",
        "typeRecurrence": "UNIQUE",
        "dateDebutValidite": start,
        "dateFinValidite": end,
        "dateSpecifique": start,
        "heureDebut": seance_start,
        "heureFin": seance_end,
        "salleId": created["salle"]["id"],
        "enseignantId": created["teacher"]["id"],
        "classeId": created["classe"]["id"],
        "matiereId": created["matiere"]["id"],
        "anneeUniversitaireId": created["annee"]["id"],
    }
    created["schedule"] = create("/emploi-du-temps", schedule_payload)
    update(
        f"/emploi-du-temps/{created['schedule']['id']}",
        {**schedule_payload, "titre": f"Planning Test Admin MAJ {suffix}"},
    )
    seance_payload = {
        "dateCours": start,
        "heureDebutReelle": seance_start,
        "heureFinReelle": seance_end,
        "salleId": created["salle"]["id"],
        "statut": "PREVUE",
        "emploiDuTempsId": created["schedule"]["id"],
        "enseignantId": created["teacher"]["id"],
        "classeId": created["classe"]["id"],
    }
    created["seance"] = create("/seances", seance_payload)
    update(
        f"/seances/{created['seance']['id']}", {**seance_payload, "statut": "EN_COURS"}
    )
    return f"planning={created['schedule']['id']}, séance={created['seance']['id']}"


step("Créer/modifier planning et séance", create_schedule_and_seance)


def login_teacher_and_create_progress():
    global teacher_token
    _, body = request(
        "POST",
        f"{API}/auth/login",
        payload={"email": created["teacher_email"], "motDePasse": "Teacher123!"},
        expected={200},
    )
    teacher_token = body.get("token")
    if not teacher_token:
        raise RuntimeError("Token enseignant absent")
    payload = {
        "dateSaisie": start,
        "contenuDetaille": "Cours test global admin",
        "objectifs": "Valider le flux pédagogique",
        "travaux": "Exercice de test",
    }
    status, body = request(
        "POST",
        f"{API}/fiche-progression/{created['seance']['id']}",
        teacher_token,
        payload,
        expected={200},
    )
    return str(body)


step("Créer fiche progression côté enseignant", login_teacher_and_create_progress)


def validate_progress_admin():
    fiches = get("/fiche-progression")
    matching = [f for f in fiches if f.get("seanceId") == created["seance"]["id"]]
    if not matching:
        raise RuntimeError("Fiche créée introuvable")
    created["fiche"] = matching[0]
    body = update(
        f"/fiche-progression/{created['fiche']['id']}/valider", {"estValideAdmin": True}
    )
    return f"fiche={body.get('id')} validée"


step("Valider fiche progression côté admin", validate_progress_admin)

step(
    "Lister présences / émargements",
    lambda: f"{len(get('/emargements'))} émargement(s)",
)
step(
    "Lister tableaux admin",
    lambda: (
        f"users={len(get('/utilisateurs/lister-tous'))}, classes={len(get('/classes'))}, matières={len(get('/matieres'))}, plannings={len(get('/emploi-du-temps'))}, séances={len(get('/seances'))}, fiches={len(get('/fiche-progression'))}"
    ),
)


def deletion_checks():
    temp_salle = create(
        "/salles",
        {
            "nom": f"Salle Suppression {suffix}",
            "batiment": "Temp",
            "capacite": 10,
            "equipement": "Temp",
            "adresseIp": f"10.0.{int(suffix[-4:-2])}.{int(suffix[-2:])}",
        },
    )
    delete(f"/salles/{temp_salle['id']}")
    temp_dept = create(
        "/departements", {"libelle": f"Département Suppression {suffix}"}
    )
    delete(f"/departements/{temp_dept['id']}")
    temp_annee = create(
        "/annee-universitaire",
        {
            "libelle": f"Année Suppression {suffix}",
            "dateDebut": start,
            "dateFin": end,
            "active": False,
        },
    )
    delete(f"/annee-universitaire/{temp_annee['id']}")
    return "delete salle/département/année OK"


step("Tester suppressions simples", deletion_checks)


def front_pages():
    # Le serveur Angular dev utilise parfois le fallback SPA seulement quand le
    # client envoie un header HTML. Sans ce header, Express répond "Cannot GET".
    pages = [
        "/",
        "/login",
        "/dashboard",
        "/classes",
        "/matieres",
        "/schedule",
        "/teachers",
        "/qr-generator",
        "/attendance",
        "/pedagogy",
        "/profile",
    ]
    ok = []
    for page in pages:
        req = urllib.request.Request(
            f"{FRONT}{page}",
            headers={"Accept": "text/html,application/xhtml+xml"},
            method="GET",
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            if resp.status != 200 or "<app-root" not in body:
                raise RuntimeError(f"{page}: HTTP {resp.status}, app-root introuvable")
            ok.append(f"{page}:{resp.status}")
    return ", ".join(ok)


step("Pages frontend admin joignables", front_pages)

print("\nRésumé")
print("======")
passed = sum(1 for _, ok, _ in results if ok)
failed = len(results) - passed
print(f"Tests OK: {passed}")
print(f"Tests FAIL: {failed}")
print("Données créées pour test manuel UI:")
print(
    json.dumps(
        {k: v for k, v in created.items() if k not in {"teacher_email"}},
        ensure_ascii=False,
        indent=2,
        default=str,
    )
)
print(f"Email enseignant créé: {created.get('teacher_email')}")
print("Mot de passe enseignant: Teacher123!")

if failed:
    sys.exit(1)
