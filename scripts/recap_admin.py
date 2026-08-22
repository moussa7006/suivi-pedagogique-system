#!/usr/bin/env python3
"""Recap final cote admin apres le test E2E d'Amadou Aya."""
import json
import urllib.request

API = "http://localhost:8099/api"
CANDIDATES = [
    ("admin@edutrack.local", "ChangeMe123456!"),
    ("admin@edutrack.local", "Admin1234!"),
    ("moussa.b.keita223@gmail.com", "Admin123456789!"),
]


def req(method, path, token=None, payload=None):
    data = json.dumps(payload).encode() if payload else None
    headers = {"Accept": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if payload:
        headers["Content-Type"] = "application/json"
    r = urllib.request.Request(f"{API}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r, timeout=20) as x:
            return json.loads(x.read().decode() or "[]")
    except urllib.error.HTTPError as e:
        return {"_http_error": e.code, "_body": e.read().decode(errors="replace")[:200]}


token = None
for email, pwd in CANDIDATES:
    body = req("POST", "/auth/login", payload={"email": email, "motDePasse": pwd})
    if isinstance(body, dict) and body.get("token"):
        token = body["token"]
        print(f"[admin connecte: {email}]")
        break

if not token:
    print("ERREUR: connexion admin impossible")
    raise SystemExit(1)

print("\n=== EMARGEMENTS (vue admin) ===")
for e in req("GET", "/emargements", token):
    print(f"  id={e.get('id')} statut={e.get('statut')} prof={e.get('enseignantNomPrenom')} "
          f"heure={e.get('heureSeance')} lieu={e.get('lieu')}")

print("\n=== FICHES DE PROGRESSION (vue admin) ===")
for f in req("GET", "/fiche-progression", token):
    print(f"  id={f.get('id')} seanceId={f.get('seanceId')} prof={f.get('enseignantNomPrenom')} "
          f"matiere={f.get('matiereLibelle')} valide={f.get('estValideAdmin')} date={f.get('dateSeance')}")

print("\n=== HONORAIRES enseignant id=13 (vue admin) ===")
for h in req("GET", "/honoraires/enseignant/13", token):
    print(f"  calculId={h.get('id')} mois={h.get('mois')} heures={h.get('totalHeures')} "
          f"montant={h.get('montantBrut')} statut={h.get('statut')}")

print("\n=== SEANCES de l'enseignant (vue admin) ===")
for s in req("GET", "/seances", token):
    if s.get("enseignantId") == 13:
        print(f"  id={s.get('id')} date={s.get('dateCours')} {s.get('heureDebutReelle')}-{s.get('heureFinReelle')} "
              f"statut={s.get('statut')} qr={'oui' if s.get('qrCodeToken') else 'non'} "
              f"emarg={s.get('emargementId')} fiche={s.get('ficheProgressionId')}")

print("\n=== DASHBOARD (vue admin) ===")
d = req("GET", "/dashboard", token)
if isinstance(d, dict) and "_http_error" not in d:
    print("  " + json.dumps(d, ensure_ascii=False, default=str)[:400])
else:
    print(f"  dashboard indispo: {d}")
