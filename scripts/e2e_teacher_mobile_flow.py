#!/usr/bin/env python3
"""Scénario E2E EduTrack : admin + enseignant + mobile.

Ce script prépare un jeu de données complet pour tester :
- création d'un enseignant ;
- création département, filière, niveau, année, classe, matière, salle ;
- création d'un emploi du temps et d'une séance du jour ;
- génération d'un QR code ;
- connexion enseignant ;
- création d'une fiche de progression/cahier de textes.

À la fin, il affiche les identifiants enseignant et le token QR à scanner depuis le mobile.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date, datetime, timedelta
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DEFAULT_BASE_URL = "http://localhost:8099/api"
DEFAULT_ADMIN_EMAIL = "admin@edutrack.local"
DEFAULT_ADMIN_PASSWORD = "ChangeMe123456!"


class ApiError(RuntimeError):
    pass


class EduTrackApi:
    def __init__(self, base_url: str) -> None:
        self.base_url = base_url.rstrip("/")

    def request(
        self,
        method: str,
        path: str,
        token: str | None = None,
        payload: dict[str, Any] | None = None,
    ) -> Any:
        url = f"{self.base_url}{path}"
        body = None
        headers = {"Accept": "application/json"}

        if payload is not None:
            body = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"

        if token:
            headers["Authorization"] = f"Bearer {token}"

        request = Request(url, data=body, headers=headers, method=method)

        try:
            with urlopen(request, timeout=20) as response:
                raw = response.read().decode("utf-8")
                if not raw:
                    return None
                content_type = response.headers.get("Content-Type", "")
                if "application/json" in content_type:
                    try:
                        return json.loads(raw)
                    except json.JSONDecodeError:
                        return raw
                return raw
        except HTTPError as exc:
            details = exc.read().decode("utf-8", errors="replace")
            raise ApiError(f"{method} {path} -> HTTP {exc.code}: {details}") from exc
        except URLError as exc:
            raise ApiError(
                f"Impossible de joindre le backend {self.base_url}: {exc}"
            ) from exc

    def login(self, email: str, password: str) -> dict[str, Any]:
        return self.request(
            "POST",
            "/auth/login",
            payload={"email": email, "motDePasse": password},
        )

    def create(self, token: str, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self.request("POST", path, token=token, payload=payload)

    def get(self, token: str, path: str) -> Any:
        return self.request("GET", path, token=token)


def print_step(message: str) -> None:
    print(f"\n▶ {message}")


def must_get_id(entity: dict[str, Any], label: str) -> int:
    entity_id = entity.get("id")
    if not isinstance(entity_id, int):
        raise ApiError(f"{label}: aucun id retourné: {entity}")
    return entity_id


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Prépare un scénario complet enseignant/mobile EduTrack."
    )
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--admin-email", default=DEFAULT_ADMIN_EMAIL)
    parser.add_argument("--admin-password", default=DEFAULT_ADMIN_PASSWORD)
    parser.add_argument("--teacher-email", default=None)
    parser.add_argument("--teacher-password", default="TeacherTest12345!")
    args = parser.parse_args()

    api = EduTrackApi(args.base_url)
    run_id = datetime.now().strftime("%Y%m%d%H%M%S")
    teacher_email = args.teacher_email or f"enseignant.e2e.{run_id}@edutrack.local"
    teacher_password = args.teacher_password

    print_step("Connexion administrateur")
    admin_login = api.login(args.admin_email, args.admin_password)
    admin_token = admin_login.get("token")
    if not admin_token:
        raise ApiError("Connexion admin réussie sans token JWT.")
    print(f"Admin connecté : {args.admin_email}")

    print_step("Création de l'enseignant de test")
    teacher_payload = {
        "nom": "E2E",
        "prenom": "Enseignant",
        "email": teacher_email,
        "telephone": f"77{run_id[-6:]}",
        "adresse": "Campus Test EduTrack",
        "matricule": f"ENS-E2E-{run_id}",
        "role": "ENSEIGNANT",
        "motDePasse": teacher_password,
        "specialite": "Développement web et mobile",
        "grade": "Vacataire",
        "dateEmbauche": str(date.today()),
    }
    teacher = api.create(admin_token, "/auth/register", teacher_payload)
    teacher_id = must_get_id(teacher, "enseignant")
    print(f"Enseignant créé : id={teacher_id}, email={teacher_email}")

    print_step("Création du référentiel académique")
    departement = api.create(
        admin_token, "/departements", {"libelle": f"Département E2E {run_id}"}
    )
    departement_id = must_get_id(departement, "département")

    filiere = api.create(
        admin_token,
        "/filieres",
        {"libelle": f"Filière E2E {run_id}", "departementId": departement_id},
    )
    filiere_id = must_get_id(filiere, "filière")

    niveau = api.create(
        admin_token,
        "/niveau-enseignement",
        {"libelle": f"Licence Test {run_id}", "prixHoraire": 10000},
    )
    niveau_id = must_get_id(niveau, "niveau")

    annee = api.create(
        admin_token,
        "/annee-universitaire",
        {
            "libelle": f"Année E2E {run_id}",
            "dateDebut": str(date.today() - timedelta(days=30)),
            "dateFin": str(date.today() + timedelta(days=300)),
            "active": True,
        },
    )
    annee_id = must_get_id(annee, "année universitaire")

    classe = api.create(
        admin_token,
        "/classes",
        {
            "libelle": f"Classe E2E {run_id}",
            "filiereId": filiere_id,
            "niveauEnseignementId": niveau_id,
            "anneeUniversitaireId": annee_id,
        },
    )
    classe_id = must_get_id(classe, "classe")

    matiere = api.create(
        admin_token,
        "/matieres",
        {
            "code": f"E2E-{run_id[-6:]}",
            "libelle": f"Matière E2E Mobile {run_id}",
            "volumeHoraireTotal": 30,
            "departementId": departement_id,
        },
    )
    matiere_id = must_get_id(matiere, "matière")

    salle = api.create(
        admin_token,
        "/salles",
        {
            "nom": f"Salle E2E {run_id[-6:]}",
            "batiment": "Bâtiment Test",
            "capacite": 40,
            "equipement": "Projecteur, Wi-Fi",
            "adresseIp": "192.168.1.250",
        },
    )
    salle_id = must_get_id(salle, "salle")

    print(
        f"Référentiel créé : dept={departement_id}, filiere={filiere_id}, niveau={niveau_id}, annee={annee_id}, classe={classe_id}, matiere={matiere_id}, salle={salle_id}"
    )

    print_step("Création d'un emploi du temps et d'une séance du jour")
    now = datetime.now()
    start = (now - timedelta(minutes=5)).time().replace(microsecond=0)
    end = (now + timedelta(hours=2)).time().replace(microsecond=0)

    emploi = api.create(
        admin_token,
        "/emploi-du-temps",
        {
            "titre": f"Cours E2E Mobile {run_id}",
            "typeRecurrence": "UNIQUE",
            "dateDebutValidite": str(date.today()),
            "dateFinValidite": str(date.today()),
            "dateSpecifique": str(date.today()),
            "heureDebut": start.isoformat(timespec="minutes"),
            "heureFin": end.isoformat(timespec="minutes"),
            "salleId": salle_id,
            "enseignantId": teacher_id,
            "classeId": classe_id,
            "matiereId": matiere_id,
            "anneeUniversitaireId": annee_id,
        },
    )
    emploi_id = must_get_id(emploi, "emploi du temps")

    seances = api.get(admin_token, "/seances")
    seance = next((s for s in seances if s.get("emploiDuTempsId") == emploi_id), None)
    if seance is None:
        seance = api.create(
            admin_token,
            "/seances",
            {
                "dateCours": str(date.today()),
                "heureDebutReelle": start.isoformat(timespec="minutes"),
                "heureFinReelle": end.isoformat(timespec="minutes"),
                "statut": "PREVUE",
                "salleId": salle_id,
                "enseignantId": teacher_id,
                "classeId": classe_id,
                "emploiDuTempsId": emploi_id,
            },
        )
    seance_id = must_get_id(seance, "séance")
    print(
        f"Séance prête : id={seance_id}, horaire={start.isoformat(timespec='minutes')} - {end.isoformat(timespec='minutes')}"
    )

    print_step("Génération du QR code de la séance")
    qr_seance = api.create(admin_token, f"/seances/{seance_id}/qr-code", {})
    qr_token = qr_seance.get("qrCodeToken")
    if not qr_token:
        raise ApiError(f"QR code non retourné pour la séance {seance_id}: {qr_seance}")
    print(f"Token QR généré : {qr_token}")

    print_step("Connexion enseignant")
    teacher_login = api.login(teacher_email, teacher_password)
    teacher_token = teacher_login.get("token")
    if not teacher_token:
        raise ApiError("Connexion enseignant réussie sans token JWT.")
    print("Enseignant connecté avec succès")

    print_step("Création du cahier de textes / fiche de progression")
    fiche_response = api.create(
        teacher_token,
        f"/fiche-progression/{seance_id}",
        {
            "dateSaisie": str(date.today()),
            "contenuDetaille": "Séance E2E : préparation complète du test mobile, création du cahier de textes et validation du parcours enseignant.",
            "objectifs": "Valider le parcours enseignant sur l'application mobile EduTrack.",
            "travaux": "Scanner le QR code depuis l'écran mobile d'émargement.",
        },
    )
    print(f"Réponse fiche : {fiche_response}")

    print("\n" + "=" * 72)
    print("SCÉNARIO PRÊT POUR TEST MOBILE")
    print("=" * 72)
    print(f"URL mobile            : http://localhost:8100/")
    print(f"Email enseignant      : {teacher_email}")
    print(f"Mot de passe          : {teacher_password}")
    print(f"Séance ID             : {seance_id}")
    print(f"Token QR à scanner    : {qr_token}")
    print("Latitude test         : 12.6392")
    print("Longitude test        : -8.0029")
    print("\nÉtapes manuelles :")
    print("1. Ouvre http://localhost:8100/")
    print("2. Connecte-toi avec l'enseignant ci-dessus")
    print("3. Va sur Scan QR")
    print("4. Colle le token QR ci-dessus")
    print("5. Valide le QR code")
    print("=" * 72)

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ApiError as exc:
        print(f"\nERREUR: {exc}", file=sys.stderr)
        raise SystemExit(1)
