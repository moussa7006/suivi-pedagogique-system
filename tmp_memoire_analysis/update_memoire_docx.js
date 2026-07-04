const fs = require('fs');
const path = require('path');

const root = 'tmp_docx_edit';
const docPath = path.join(root, 'word/document.xml');
const relsPath = path.join(root, 'word/_rels/document.xml.rels');
const typesPath = path.join(root, '[Content_Types].xml');
const mediaDir = path.join(root, 'word/media');
let xml = fs.readFileSync(docPath, 'utf8');

function rep(a, b) {
  if (!xml.includes(a)) console.log('MISS', a.slice(0, 100));
  xml = xml.split(a).join(b);
}
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function p(text) {
  return `<w:p><w:pPr><w:spacing w:before="80" w:after="80"/><w:jc w:val="both"/></w:pPr><w:r><w:t>${esc(text)}</w:t></w:r></w:p>`;
}
function pc(text) {
  return `<w:p><w:pPr><w:spacing w:before="80" w:after="160"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>${esc(text)}</w:t></w:r></w:p>`;
}
function h(text) {
  return `<w:p><w:pPr><w:spacing w:before="240" w:after="120"/><w:jc w:val="left"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>${esc(text)}</w:t></w:r></w:p>`;
}
function br() {
  return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
}
function imgPara(rId, id, name, cx, cy) {
  return `<w:p><w:pPr><w:spacing w:before="160" w:after="80"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${id}" name="${esc(name)}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${id}" name="${esc(name)}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
}
function getPngDim(buf) {
  if (buf.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}
function getJpgDim(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return { w: 720, h: 1280 };
}
function getSvgDim(txt) {
  const vb = (txt.match(/viewBox="([^"]+)"/) || [])[1];
  if (vb) {
    const a = vb.trim().split(/\s+/).map(Number);
    return { w: a[2], h: a[3] };
  }
  return { w: 900, h: 600 };
}
function scaled(w, h, maxCx, maxCy) {
  const emu = 9525;
  let cx = w * emu;
  let cy = h * emu;
  const s = Math.min(maxCx / cx, maxCy / cy, 1);
  return { cx: Math.round(cx * s), cy: Math.round(cy * s) };
}

rep("CONCEPTION ET DÉVELOPPEMENT D'UN SYSTÈME DE", 'CONCEPTION ET DÉVELOPPEMENT D’UNE APPLICATION');
rep('SUIVI PÉDAGOGIQUE ET DE GESTION DES', 'WEB ET MOBILE DE SUIVI PÉDAGOGIQUE ET DE CALCUL');
rep('Année Universitaire 2025 - 2026', 'Année Universitaire 2025-2026');
rep('Aya BOURAMA &amp; Moussa Balla KEITA', 'Moussa Balla KEITA &amp; Aya BOURAMA');
rep('Nom du Directeur de mémoire : À compléter', 'Directeur de mémoire : M. Mouhamoud Dembele');
rep('Sous la direction de :', 'Filière : Génie Informatique et Programmation - Cycle : Licence 3 - Sous la direction de :');
rep("Nous remercions tout d'abord notre Directeur de mémoire, Monsieur/Madame le Directeur de mémoire (nom à compléter), pour sa disponibilité, ses conseils éclairés et son accompagnement rigoureux tout au long de ce travail. Sa patience et sa rigueur académique ont été d'une aide précieuse.", "Nous remercions tout d'abord notre Directeur de mémoire, M. Mouhamoud Dembele, pour sa disponibilité, ses conseils éclairés et son accompagnement rigoureux tout au long de ce travail.");
rep('un système intégré de suivi pédagogique et de gestion des honoraires des enseignants', 'une application web et mobile de suivi pédagogique et de calcul des honoraires des enseignants');
rep('gestion des honoraires des enseignants', 'calcul des honoraires des enseignants');
rep('gestion des honoraires', 'calcul des honoraires');
rep('gestion efficace des honoraires', 'suivi administratif efficace des honoraires');
rep('produire des états de paiement précis et vérifiables', 'produire des états d’honoraires précis et vérifiables');
rep('Validation et suivi des paiements', 'Suivi administratif des honoraires calculés');
rep("Génération des lignes d'honoraires", 'Génération des détails d’honoraires');
rep('LignesHonoraires', 'DetailHonoraire');
rep("Le diagramme de séquence illustre le flux d'interactions pour le scénario d'émargement par QR code : l'enseignant ouvre l'application mobile, scanne le QR code de la séance, le système vérifie la validité du code, enregistre l'émargement avec horodatage, et confirme l'opération à l'enseignant.", 'Afin de mieux représenter les principaux processus fonctionnels du système, trois diagrammes de séquence ont été réalisés. Ils décrivent respectivement l’authentification des utilisateurs, l’émargement par QR Code et le calcul des honoraires. Ces diagrammes permettent de visualiser les interactions entre les acteurs, les interfaces clientes, les contrôleurs, les services métier et la base de données.');
rep("Suivi des statuts d'émargement (valide, en retard, absent).", 'Suivi des statuts d’émargement, notamment EN_ATTENTE_FICHE après le scan du QR Code et VALIDE après le remplissage de la fiche de progression.');
rep('Figure 4 : Diagramme de séquence du processus d’émargement par QR Code', 'Figure 4 : Diagramme de séquence du processus d’authentification - Figure 5 : Diagramme de séquence du processus d’émargement par QR Code - Figure 6 : Diagramme de séquence du calcul des honoraires - Figure 7 : Tableau de bord de l’interface web administrateur - Figure 8 : Page de connexion de la plateforme EduTrack - Figure 9 : Planning mobile de l’enseignant - Figure 10 : Accueil de l’application mobile enseignant - Figure 11 : Interface mobile de gestion de la fiche de progression - Figure 12 : Profil enseignant dans l’application mobile - Figure 13 : Consultation mobile des honoraires calculés');
rep('calcul automatisé des honoraires', 'calcul des honoraires');
rep("l'ajout de fonctionnalités d'intelligence artificielle pour l'analyse prédictive des résultats pédagogiques ;", 'l’ajout de notifications automatiques pour informer les enseignants et l’administration ;');
rep("l'intégration avec des systèmes de paiement électronique pour la gestion des frais de scolarité.", 'l’intégration éventuelle avec un système de paiement électronique externe ; - Le renforcement des tests automatisés et le déploiement en production.');
rep('Enfin, l’intégration de notifications, d’un module étudiant et d’un tableau de bord analytique plus avancé permettrait d’améliorer l’exploitation pédagogique des données collectées par le système.', 'Enfin, l’intégration de notifications, d’un module étudiant, d’un module de communication interne et d’un mécanisme de paiement électronique externe pourrait renforcer progressivement l’exploitation pédagogique et administrative du système.');

if (!xml.includes('Connexion administrateur')) {
  const tests = h('Tableau de validation fonctionnelle') +
    p('Les validations fonctionnelles ont été synthétisées dans le tableau suivant. Tous les scénarios testés ont été validés.') +
    p('Scénario testé | Résultat attendu | Résultat obtenu | Statut') +
    p('Connexion administrateur | Accès au tableau de bord | Accès réussi | Validé') +
    p('Connexion enseignant | Accès à l’espace enseignant | Accès réussi | Validé') +
    p('Création d’un enseignant | Enseignant enregistré | Enregistrement effectué | Validé') +
    p('Création d’une classe | Classe disponible dans le système | Classe créée avec succès | Validé') +
    p('Création d’une matière | Matière enregistrée | Matière disponible | Validé') +
    p('Création d’un emploi du temps | Séances générées | Séances planifiées | Validé') +
    p('Génération du QR Code | QR Code affiché | QR Code généré | Validé') +
    p('Scan du QR Code | Émargement enregistré | Statut EN_ATTENTE_FICHE | Validé') +
    p('Remplissage de la fiche de progression | Séance finalisée | Émargement validé | Validé') +
    p('Calcul des honoraires | Montant calculé | Montant affiché | Validé') +
    p('Consultation mobile du planning | Planning affiché | Planning consultable | Validé') +
    p('Consultation mobile des honoraires | Montants affichés | Honoraires consultables | Validé');
  xml = xml.replace(/(<w:p[^>]*>[\s\S]*?<w:t>Conclusion<\/w:t>[\s\S]*?<\/w:p>)/, tests + '$1');
}

if (!xml.includes('SOMMERVILLE Ian')) {
  const add = p('• SOMMERVILLE Ian : « Software Engineering », 10e édition, Pearson, Londres, 2016, 816 pages.') +
    p('• PRESSMAN Roger S. : « Software Engineering: A Practitioner’s Approach », 8e édition, McGraw-Hill, New York, 2014, 976 pages.') +
    p('• LAUDON Kenneth C. et LAUDON Jane P. : « Management Information Systems: Managing the Digital Firm », 16e édition, Pearson, New York, 2020, 648 pages.') +
    p('• BOOCH Grady ; RUMBAUGH James ; JACOBSON Ivar : « The Unified Modeling Language User Guide », 2e édition, Addison-Wesley, Boston, 2005, 496 pages.');
  xml = xml.replace(/(<w:t>Ouvrages<\/w:t>[\s\S]*?<\/w:p>)/, '$1' + add);
}

const items = [
  ['diagramme_sequence_authentification.svg', 'MEMOIRE/generated_schemas/diagramme_sequence_authentification.svg', 'rId18', 'Figure 4 : Diagramme de séquence du processus d’authentification', 'Source : réalisé par les auteurs à partir du fonctionnement de l’application EduTrack.'],
  ['diagramme_sequence_emargement_qr.svg', 'MEMOIRE/generated_schemas/diagramme_sequence_emargement_qr.svg', 'rId19', 'Figure 5 : Diagramme de séquence du processus d’émargement par QR Code', 'Source : réalisé par les auteurs à partir du fonctionnement de l’application EduTrack.'],
  ['diagramme_sequence_honoraires.svg', 'MEMOIRE/generated_schemas/diagramme_sequence_honoraires.svg', 'rId20', 'Figure 6 : Diagramme de séquence du calcul des honoraires', 'Source : réalisé par les auteurs à partir du fonctionnement de l’application EduTrack.'],
  ['capture_dashboard_web.png', "MEMOIRE/Capture d'ecran application web et mobile/Capture d'écran 2026-07-02 213625.png", 'rId21', 'Figure 7 : Tableau de bord de l’interface web administrateur', 'Source : capture d’écran de l’application EduTrack.'],
  ['capture_login_web.png', "MEMOIRE/Capture d'ecran application web et mobile/Capture d'écran 2026-07-02 213822.png", 'rId22', 'Figure 8 : Page de connexion de la plateforme EduTrack', 'Source : capture d’écran de l’application EduTrack.'],
  ['capture_planning_mobile.jpg', "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213120_mobile-ionic.jpg", 'rId23', 'Figure 9 : Planning mobile de l’enseignant', 'Source : capture d’écran de l’application mobile EduTrack.'],
  ['capture_accueil_mobile.jpg', "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213134_mobile-ionic.jpg", 'rId24', 'Figure 10 : Accueil de l’application mobile enseignant', 'Source : capture d’écran de l’application mobile EduTrack.'],
  ['capture_fiche_progression_mobile.jpg', "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213143_mobile-ionic.jpg", 'rId25', 'Figure 11 : Interface mobile de gestion de la fiche de progression', 'Source : capture d’écran de l’application mobile EduTrack.'],
  ['capture_profil_mobile.jpg', "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213151_mobile-ionic.jpg", 'rId26', 'Figure 12 : Profil enseignant dans l’application mobile', 'Source : capture d’écran de l’application mobile EduTrack.'],
  ['capture_honoraires_mobile.jpg', "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213212_mobile-ionic.jpg", 'rId27', 'Figure 13 : Consultation mobile des honoraires calculés', 'Source : capture d’écran de l’application mobile EduTrack.']
];

for (const [name, src] of items) fs.copyFileSync(src, path.join(mediaDir, name));

let rels = fs.readFileSync(relsPath, 'utf8');
for (const [name, , rid] of items) {
  if (!rels.includes(`Id="${rid}"`)) {
    rels = rels.replace('</Relationships>', `<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/></Relationships>`);
  }
}
fs.writeFileSync(relsPath, rels);

let types = fs.readFileSync(typesPath, 'utf8');
if (!types.includes('Extension="svg"')) {
  types = types.replace('<Default Extension="png" ContentType="image/png"/>', '<Default Extension="png" ContentType="image/png"/><Default Extension="svg" ContentType="image/svg+xml"/><Default Extension="jpg" ContentType="image/jpeg"/>');
}
if (!types.includes('Extension="jpg"')) {
  types = types.replace('<Default Extension="png" ContentType="image/png"/>', '<Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/>');
}
fs.writeFileSync(typesPath, types);

if (!xml.includes('Annexe 1 : Diagrammes de séquence et captures d’écran')) {
  let annex = br() + h('Annexes') + h('Annexe 1 : Diagrammes de séquence et captures d’écran') +
    p('Cette annexe regroupe les principaux diagrammes de séquence ainsi que les captures d’écran de l’application web et mobile EduTrack. Les diagrammes Draw.io sources sont disponibles dans le dossier MEMOIRE/generated_schemas.');
  let id = 10;
  for (const [name, src, rid, cap, source] of items) {
    const buf = fs.readFileSync(src);
    let dim;
    if (name.endsWith('.svg')) dim = getSvgDim(buf.toString('utf8'));
    else if (name.endsWith('.png')) dim = getPngDim(buf);
    else dim = getJpgDim(buf);
    const maxCx = name.endsWith('.svg') ? 6200000 : (dim.w > dim.h ? 6200000 : 2800000);
    const maxCy = name.endsWith('.svg') ? 4200000 : (dim.w > dim.h ? 3800000 : 5200000);
    const sc = scaled(dim.w, dim.h, maxCx, maxCy);
    annex += imgPara(rid, id++, name, sc.cx, sc.cy) + pc(cap) + pc(source);
  }
  xml = xml.replace(/(<w:p[^>]*>[\s\S]*?<w:t>Table des matières<\/w:t>[\s\S]*?<\/w:p>)/, annex + '$1');
}

fs.writeFileSync(docPath, xml);
console.log('document updated');
