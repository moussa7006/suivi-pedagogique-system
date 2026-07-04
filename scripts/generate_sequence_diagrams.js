const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "MEMOIRE", "generated_schemas");
fs.mkdirSync(outDir, { recursive: true });

const diagrams = [
  {
    key: "diagramme_sequence_emargement_qr",
    title: "Diagramme de séquence - Émargement par QR Code",
    actors: [
      "Enseignant",
      "Application mobile",
      "API Emargement",
      "EmargementService",
      "Base de données",
    ],
    messages: [
      ["Enseignant", "Application mobile", "Scanner le QR Code de la salle"],
      [
        "Application mobile",
        "API Emargement",
        "POST /api/emargements/scan\n(tokenQRCode, position GPS)",
      ],
      ["API Emargement", "EmargementService", "faireEmargement(request)"],
      [
        "EmargementService",
        "Base de données",
        "Rechercher la séance par token QR",
      ],
      ["Base de données", "EmargementService", "Séance + QR Code actif"],
      [
        "EmargementService",
        "Base de données",
        "Vérifier enseignant, date, horaire et géolocalisation",
      ],
      [
        "EmargementService",
        "Base de données",
        "Créer/mettre à jour l’émargement\nstatut = EN_ATTENTE_FICHE",
      ],
      ["EmargementService", "API Emargement", "Emargement enregistré"],
      [
        "API Emargement",
        "Application mobile",
        "Message de succès + seanceId + emargementId",
      ],
      [
        "Application mobile",
        "Enseignant",
        "Demander le remplissage de la fiche de progression",
      ],
    ],
    alts: [
      {
        after: 6,
        text: "Erreur : QR expiré, séance hors horaire, mauvais enseignant ou position invalide",
      },
    ],
  },

  {
    key: "diagramme_sequence_honoraires",
    title: "Diagramme de séquence - Calcul des honoraires",
    actors: [
      "Administrateur",
      "Interface web",
      "API Honoraires",
      "HonorairesService",
      "Base de données",
    ],
    messages: [
      ["Administrateur", "Interface web", "Choisir enseignant, année et mois"],
      [
        "Interface web",
        "API Honoraires",
        "GET /api/honoraires/preview\n(enseignantId, année, mois)",
      ],
      ["API Honoraires", "HonorairesService", "previewHonoraires(...)"],
      ["HonorairesService", "Base de données", "Vérifier rôle administrateur"],
      [
        "HonorairesService",
        "Base de données",
        "Charger enseignant et séances payables validées",
      ],
      ["Base de données", "HonorairesService", "Séances non encore payées"],
      [
        "HonorairesService",
        "API Honoraires",
        "Prévisualisation : heures et montant brut",
      ],
      ["API Honoraires", "Interface web", "Afficher le détail du calcul"],
      ["Administrateur", "Interface web", "Confirmer le calcul"],
      ["Interface web", "API Honoraires", "POST /api/honoraires/calculer"],
      ["API Honoraires", "HonorairesService", "calculerHonoraires(...)"],
      [
        "HonorairesService",
        "Base de données",
        "Créer/mettre à jour HonorairesCalculs\n+ DetailHonoraire",
      ],
      [
        "Base de données",
        "HonorairesService",
        "Calcul sauvegardé au statut BROUILLON",
      ],
      ["HonorairesService", "API Honoraires", "HonorairesCalculDto"],
      ["API Honoraires", "Interface web", "Afficher le calcul enregistré"],
      [
        "Interface web",
        "Administrateur",
        "Afficher le total des heures, le montant brut\net les détails par séance",
      ],
    ],
    alts: [
      {
        after: 12,
        text: "Erreur : aucune séance payable ou calcul déjà existant/payé",
      },
    ],
  },
  {
    key: "diagramme_sequence_authentification",
    title: "Diagramme de séquence - Authentification des utilisateurs",
    actors: [
      "Utilisateur",
      "Interface web/mobile",
      "API Auth",
      "AuthService",
      "Base de données",
      "JwtUtil",
    ],
    messages: [
      ["Utilisateur", "Interface web/mobile", "Saisir email et mot de passe"],
      [
        "Interface web/mobile",
        "API Auth",
        "POST /api/auth/login\n(email, motDePasse)",
      ],
      ["API Auth", "AuthService", "authentifier(loginRequest)"],
      [
        "AuthService",
        "Base de données",
        "Rechercher l’utilisateur par email normalisé",
      ],
      ["Base de données", "AuthService", "Utilisateur trouvé"],
      ["AuthService", "AuthService", "Vérifier que le compte est actif"],
      [
        "AuthService",
        "AuthService",
        "Comparer le mot de passe saisi\navec le hash enregistré",
      ],
      ["AuthService", "API Auth", "Utilisateur authentifié"],
      ["API Auth", "JwtUtil", "generateToken(email, rôle)"],
      ["JwtUtil", "API Auth", "JWT signé"],
      [
        "API Auth",
        "Interface web/mobile",
        "Réponse 200 : token + profil utilisateur",
      ],
      [
        "Interface web/mobile",
        "Utilisateur",
        "Redirection vers l’espace selon le rôle",
      ],
    ],
    alts: [
      {
        after: 7,
        text: "Erreur : email inconnu, compte désactivé ou mot de passe incorrect",
      },
    ],
  },
];

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const svgEsc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function drawio(diagram) {
  const actorX = diagram.actors.map((_, i) => 80 + i * 230);
  const top = 80;
  const msgGap = 70;
  const width = 160;
  const height = Math.max(
    760,
    top + 90 + diagram.messages.length * msgGap + 80,
  );
  const pageWidth = 80 + (diagram.actors.length - 1) * 230 + width + 100;
  let id = 2;
  const cells = [
    '<mxCell id="0" />',
    '<mxCell id="1" parent="0" />',
    `<mxCell id="title" value="${esc(diagram.title)}" style="text;html=1;strokeColor=none;fillColor=none;fontSize=22;fontStyle=1;align=center;verticalAlign=middle;" vertex="1" parent="1"><mxGeometry x="20" y="20" width="${pageWidth - 40}" height="30" as="geometry" /></mxCell>`,
  ];

  diagram.actors.forEach((actor, i) => {
    const x = actorX[i];
    const boxId = `a${i}`;
    cells.push(
      `<mxCell id="${boxId}" value="${esc(actor)}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="${x}" y="${top}" width="${width}" height="46" as="geometry" /></mxCell>`,
    );
    cells.push(
      `<mxCell id="l${i}" value="" style="endArrow=none;html=1;rounded=0;dashed=1;strokeColor=#888888;" edge="1" parent="1"><mxGeometry width="50" height="50" relative="1" as="geometry"><mxPoint x="${x + width / 2}" y="${top + 46}" as="sourcePoint" /><mxPoint x="${x + width / 2}" y="${height - 40}" as="targetPoint" /></mxGeometry></mxCell>`,
    );
  });

  const actorIndex = Object.fromEntries(diagram.actors.map((a, i) => [a, i]));
  diagram.messages.forEach((m, idx) => {
    const y = top + 90 + idx * msgGap;
    const [from, to, label] = m;
    const sx = actorX[actorIndex[from]] + width / 2;
    const tx = actorX[actorIndex[to]] + width / 2;
    const dir = sx < tx ? "classic" : "classic";
    cells.push(
      `<mxCell id="m${idx}" value="${esc(label).replace(/\n/g, "&lt;br&gt;")}" style="endArrow=${dir};html=1;rounded=0;strokeWidth=1.4;edgeStyle=orthogonalEdgeStyle;align=center;verticalAlign=bottom;fontSize=11;" edge="1" parent="1"><mxGeometry width="50" height="50" relative="1" as="geometry"><mxPoint x="${sx}" y="${y}" as="sourcePoint" /><mxPoint x="${tx}" y="${y}" as="targetPoint" /></mxGeometry></mxCell>`,
    );
    const alt = diagram.alts.find((a) => a.after === idx + 1);
    if (alt) {
      cells.push(
        `<mxCell id="alt${idx}" value="alt ${esc(alt.text)}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=11;align=left;spacingLeft=8;" vertex="1" parent="1"><mxGeometry x="60" y="${y + 18}" width="${pageWidth - 120}" height="34" as="geometry" /></mxCell>`,
      );
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" modified="2026-07-02T00:00:00.000Z" agent="Zed" version="24.7.17" type="device">\n  <diagram id="${diagram.key}" name="${esc(diagram.title)}">\n    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${pageWidth}" pageHeight="${height}" math="0" shadow="0">\n      <root>\n        ${cells.join("\n        ")}\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n`;
}

function svg(diagram) {
  const actorX = diagram.actors.map((_, i) => 80 + i * 230);
  const top = 80;
  const msgGap = 70;
  const boxW = 160;
  const boxH = 48;
  const height = Math.max(
    760,
    top + 90 + diagram.messages.length * msgGap + 80,
  );
  const width = 80 + (diagram.actors.length - 1) * 230 + boxW + 100;
  const actorIndex = Object.fromEntries(diagram.actors.map((a, i) => [a, i]));
  let out = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`;
  out += `<defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,4 L0,8 z" fill="#2f5597"/></marker><style>text{font-family:Arial,Helvetica,sans-serif}.title{font-size:22px;font-weight:bold}.actor{font-size:14px;font-weight:bold}.msg{font-size:12px}.alt{font-size:12px;font-weight:bold}</style></defs>`;
  out += `<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>`;
  out += `<text class="title" x="${width / 2}" y="36" text-anchor="middle">${svgEsc(diagram.title)}</text>`;
  diagram.actors.forEach((actor, i) => {
    const x = actorX[i];
    const cx = x + boxW / 2;
    out += `<rect x="${x}" y="${top}" width="${boxW}" height="${boxH}" rx="10" fill="#dbeafe" stroke="#3b6ea8" stroke-width="1.5"/>`;
    out += `<text class="actor" x="${cx}" y="${top + 29}" text-anchor="middle" fill="#1f2937">${svgEsc(actor)}</text>`;
    out += `<line x1="${cx}" y1="${top + boxH}" x2="${cx}" y2="${height - 40}" stroke="#888" stroke-dasharray="7 6"/>`;
  });
  diagram.messages.forEach((m, idx) => {
    const y = top + 95 + idx * msgGap;
    const [from, to, label] = m;
    const sx = actorX[actorIndex[from]] + boxW / 2;
    const tx = actorX[actorIndex[to]] + boxW / 2;
    const marker =
      sx < tx ? 'marker-end="url(#arrow)"' : 'marker-start="url(#arrow)"';
    out += `<line x1="${sx}" y1="${y}" x2="${tx}" y2="${y}" stroke="#2f5597" stroke-width="1.6" ${marker}/>`;
    const mid = (sx + tx) / 2;
    const lines = label.split("\n");
    lines.forEach((line, li) => {
      out += `<text class="msg" x="${mid}" y="${y - 8 - (lines.length - 1 - li) * 14}" text-anchor="middle" fill="#111827">${svgEsc(line)}</text>`;
    });
    const alt = diagram.alts.find((a) => a.after === idx + 1);
    if (alt) {
      out += `<rect x="55" y="${y + 16}" width="${width - 110}" height="36" rx="4" fill="#fff7d6" stroke="#d6b656"/>`;
      out += `<text class="alt" x="70" y="${y + 39}" fill="#7a5b00">alt : ${svgEsc(alt.text)}</text>`;
    }
  });
  out += "\n</svg>\n";
  return out;
}

for (const d of diagrams) {
  fs.writeFileSync(path.join(outDir, `${d.key}.drawio`), drawio(d), "utf8");
  fs.writeFileSync(path.join(outDir, `${d.key}.svg`), svg(d), "utf8");
}

console.log(
  `Generated ${diagrams.length} draw.io files and ${diagrams.length} SVG images in ${outDir}`,
);
