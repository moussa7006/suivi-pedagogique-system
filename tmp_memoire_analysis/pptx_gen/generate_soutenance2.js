const pptxgen = require("pptxgenjs");
const fs = require("fs");

const pptx = new pptxgen();
pptx.defineLayout({ name: "CUSTOM_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "CUSTOM_WIDE";
pptx.author = "EduTrack";
pptx.subject = "Soutenance EduTrack";
pptx.title = "Presentation EduTrack soutenance 2";
pptx.company = "INTEC SUP";
pptx.lang = "fr-FR";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "fr-FR",
};

const W = 13.333;
const NAVY = "0B1220";
const BLUE = "2563EB";
const SKY = "38BDF8";
const AMBER = "F59E0B";
const GREEN = "10B981";
const RED = "EF4444";
const TEXT = "1E293B";
const MUTED = "64748B";
const LIGHT = "F8FAFC";
const BORDER = "CBD5E1";
const WHITE = "FFFFFF";

const img = {
  logo: "backend/edutrack/src/main/resources/images/logo_INTEC_nom_Horizon-1-3-1.png",
  logo2: "backend/edutrack/src/main/resources/images/intec.png",
  dashboard:
    "MEMOIRE/Capture d'ecran application web et mobile/Capture d'écran 2026-07-02 213625.png",
  login:
    "MEMOIRE/Capture d'ecran application web et mobile/Capture d'écran 2026-07-02 213822.png",
  mobileHome:
    "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213134_mobile-ionic.jpg",
  mobilePlanning:
    "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213120_mobile-ionic.jpg",
  mobileFiche:
    "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213143_mobile-ionic.jpg",
  mobileHonoraires:
    "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213212_mobile-ionic.jpg",
  architecture:
    "MEMOIRE/generated_schemas/architecture_systeme_edutrack_simple_PNG.png",
};

function exists(p) {
  return fs.existsSync(p);
}
function addLogo(slide, dark = false) {
  const p = exists(img.logo) ? img.logo : img.logo2;
  if (!exists(p)) return;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 10.75,
    y: 0.22,
    w: 1.85,
    h: 0.62,
    rectRadius: 0.06,
    fill: { color: WHITE, transparency: dark ? 0 : 8 },
    line: { color: dark ? WHITE : BORDER, transparency: 25 },
  });
  slide.addImage({
    path: p,
    x: 10.86,
    y: 0.31,
    w: 1.63,
    h: 0.43,
    sizing: { type: "contain", w: 1.63, h: 0.43 },
  });
}
function addFooter(slide, index, total = 9, dark = false) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.18,
    w: W,
    h: 0.32,
    fill: { color: dark ? NAVY : "F1F5F9" },
    line: { color: dark ? NAVY : "F1F5F9" },
  });
  slide.addText("EduTrack — Soutenance Licence 3", {
    x: 0.55,
    y: 7.25,
    w: 4.5,
    h: 0.12,
    fontSize: 9.5,
    color: dark ? WHITE : MUTED,
    margin: 0,
  });
  slide.addText(`${index}/${total}`, {
    x: 12.0,
    y: 7.25,
    w: 0.8,
    h: 0.12,
    fontSize: 9.5,
    color: dark ? WHITE : MUTED,
    align: "right",
    margin: 0,
  });
}
function addTitle(slide, title, subtitle, index) {
  slide.background = { color: WHITE };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: 0.12,
    fill: { color: BLUE },
    line: { color: BLUE },
  });
  slide.addText(title, {
    x: 0.62,
    y: 0.37,
    w: 9.55,
    h: 0.52,
    fontSize: 30,
    bold: true,
    color: NAVY,
    margin: 0,
    fit: "shrink",
  });
  if (subtitle)
    slide.addText(subtitle, {
      x: 0.65,
      y: 0.98,
      w: 9.9,
      h: 0.28,
      fontSize: 14,
      color: MUTED,
      margin: 0,
      fit: "shrink",
    });
  addLogo(slide);
  addFooter(slide, index);
}
function imageFrame(slide, path, x, y, w, h) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: WHITE },
    line: { color: BORDER, width: 1 },
  });
  if (exists(path))
    slide.addImage({
      path,
      x: x + 0.08,
      y: y + 0.08,
      w: w - 0.16,
      h: h - 0.16,
      sizing: { type: "contain", w: w - 0.16, h: h - 0.16 },
    });
}
function card(
  slide,
  x,
  y,
  w,
  h,
  title,
  body,
  accent = BLUE,
  titleSize = 19,
  bodySize = 16,
) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: LIGHT },
    line: { color: BORDER, width: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 0.1,
    h,
    fill: { color: accent },
    line: { color: accent },
  });
  slide.addText(title, {
    x: x + 0.28,
    y: y + 0.2,
    w: w - 0.45,
    h: 0.35,
    fontSize: titleSize,
    bold: true,
    color: NAVY,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(body, {
    x: x + 0.28,
    y: y + 0.75,
    w: w - 0.45,
    h: h - 0.85,
    fontSize: bodySize,
    color: TEXT,
    margin: 0.03,
    fit: "shrink",
    breakLine: false,
    valign: "top",
  });
}
function pill(slide, x, y, w, text, color) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.58,
    rectRadius: 0.1,
    fill: { color },
    line: { color },
  });
  slide.addText(text, {
    x: x + 0.15,
    y: y + 0.15,
    w: w - 0.3,
    h: 0.2,
    fontSize: 15,
    bold: true,
    color: WHITE,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}
function arrow(slide, x, y, w, label, color) {
  slide.addShape(pptx.ShapeType.chevron, {
    x,
    y,
    w,
    h: 0.85,
    fill: { color },
    line: { color },
  });
  slide.addText(label, {
    x: x + 0.15,
    y: y + 0.25,
    w: w - 0.3,
    h: 0.2,
    fontSize: 13.5,
    bold: true,
    color: WHITE,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}

// 1. Bienvenue
{
  const slide = pptx.addSlide();
  slide.background = { color: NAVY };
  slide.addShape(pptx.ShapeType.arc, {
    x: -1.6,
    y: -1.8,
    w: 5.0,
    h: 5.0,
    fill: { color: BLUE, transparency: 5 },
    line: { color: BLUE, transparency: 100 },
    adjustPoint: 0.3,
  });
  slide.addShape(pptx.ShapeType.arc, {
    x: 9.9,
    y: 4.3,
    w: 5.0,
    h: 5.0,
    fill: { color: SKY, transparency: 30 },
    line: { color: SKY, transparency: 100 },
    adjustPoint: 0.3,
  });
  addLogo(slide, true);
  slide.addText("SOUTENANCE DE MÉMOIRE", {
    x: 1,
    y: 0.9,
    w: 11.3,
    h: 0.35,
    fontSize: 18,
    bold: true,
    color: SKY,
    align: "center",
    margin: 0,
    charSpace: 1.2,
  });
  slide.addText("EduTrack", {
    x: 1,
    y: 1.65,
    w: 11.3,
    h: 0.8,
    fontSize: 54,
    bold: true,
    color: WHITE,
    align: "center",
    margin: 0,
  });
  slide.addText(
    "CONCEPTION ET DÉVELOPPEMENT D'UNE APPLICATION\nWEB ET MOBILE DE SUIVI PÉDAGOGIQUE ET DE CALCUL\nDES HONORAIRES DES ENSEIGNANTS",
    {
      x: 0.75,
      y: 2.55,
      w: 11.85,
      h: 1.05,
      fontSize: 20,
      bold: true,
      color: "E2E8F0",
      align: "center",
      margin: 0,
      fit: "shrink",
    },
  );
  pill(
    slide,
    4.0,
    3.72,
    5.35,
    "Projet de Licence 3 — Génie Informatique",
    AMBER,
  );
  slide.addText("Moussa Balla KEITA & Aya BOURAMA", {
    x: 1.0,
    y: 5.55,
    w: 5.7,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: WHITE,
    margin: 0,
  });
  slide.addText("Directeur : M. Mouhamoud Dembele", {
    x: 6.7,
    y: 5.55,
    w: 5.6,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: WHITE,
    align: "right",
    margin: 0,
  });
  slide.addText("INTEC SUP — Année universitaire 2025-2026", {
    x: 1,
    y: 6.45,
    w: 11.3,
    h: 0.25,
    fontSize: 14,
    color: "CBD5E1",
    align: "center",
    margin: 0,
  });
}

// 2. Problématique et objectifs
{
  const slide = pptx.addSlide();
  addTitle(
    slide,
    "Problématique & objectifs",
    "Ce que le projet cherche à résoudre concrètement.",
    2,
  );
  card(
    slide,
    0.75,
    1.38,
    3.8,
    4.1,
    "Constat",
    "Le suivi pédagogique est souvent dispersé entre feuilles papier, fichiers Excel et échanges informels.",
    RED,
    22,
    19,
  );
  card(
    slide,
    4.82,
    1.38,
    3.8,
    4.1,
    "Problème",
    "Ces méthodes créent des erreurs, des retards, une faible traçabilité et rendent le calcul des honoraires difficile.",
    AMBER,
    22,
    19,
  );
  card(
    slide,
    8.89,
    1.38,
    3.8,
    4.1,
    "Objectif général",
    "Concevoir une application web et mobile pour centraliser le suivi, l’émargement et le calcul des honoraires.",
    GREEN,
    22,
    19,
  );
}

// 3. Solution EduTrack
{
  const slide = pptx.addSlide();
  addTitle(
    slide,
    "Solution proposée : EduTrack",
    "Une plateforme web et mobile adaptée au suivi pédagogique.",
    3,
  );
  imageFrame(slide, img.dashboard, 0.75, 1.35, 6.2, 4.85);
  card(
    slide,
    7.25,
    1.35,
    5.35,
    1.05,
    "Gestion académique",
    "Classes, enseignants, matières, salles et emplois du temps.",
    BLUE,
    18,
    15,
  );
  card(
    slide,
    7.25,
    2.62,
    5.35,
    1.05,
    "Émargement QR Code",
    "Scan mobile et traçabilité des présences.",
    GREEN,
    18,
    15,
  );
  card(
    slide,
    7.25,
    3.89,
    5.35,
    1.05,
    "Fiche de progression",
    "Suivi numérique du contenu réalisé en séance.",
    SKY,
    18,
    15,
  );
  card(
    slide,
    7.25,
    5.16,
    5.35,
    1.05,
    "Honoraires",
    "Calcul et consultation des montants à percevoir.",
    AMBER,
    18,
    15,
  );
}

// 4. Fonctionnement d'EduTrack
{
  const slide = pptx.addSlide();
  addTitle(
    slide,
    "Fonctionnement d’EduTrack",
    "Le parcours principal du suivi pédagogique.",
    4,
  );
  arrow(slide, 0.85, 1.55, 2.2, "Planifier", BLUE);
  arrow(slide, 3.2, 1.55, 2.2, "Générer QR", SKY);
  arrow(slide, 5.55, 1.55, 2.2, "Émarger", GREEN);
  arrow(slide, 7.9, 1.55, 2.2, "Remplir fiche", AMBER);
  arrow(slide, 10.25, 1.55, 2.2, "Calculer", RED);
  imageFrame(slide, img.mobilePlanning, 1.2, 3.05, 2.15, 3.25);
  imageFrame(slide, img.mobileHome, 4.05, 3.05, 2.15, 3.25);
  imageFrame(slide, img.mobileFiche, 6.9, 3.05, 2.15, 3.25);
  imageFrame(slide, img.mobileHonoraires, 9.75, 3.05, 2.15, 3.25);
}

// 5. Architecture
{
  const slide = pptx.addSlide();
  addTitle(
    slide,
    "Architecture du projet",
    "Organisation technique simple du système.",
    5,
  );
  imageFrame(slide, img.architecture, 0.8, 1.15, 11.75, 5.65);
}

// 6. Outils utilisés
{
  const slide = pptx.addSlide();
  addTitle(
    slide,
    "Outils utilisés",
    "Technologies retenues pour construire le projet.",
    6,
  );
  card(
    slide,
    0.75,
    1.35,
    3.55,
    1.55,
    "Backend",
    "Spring Boot 3.4.3\nJava 17\nSpring Security + JWT",
    BLUE,
    20,
    16,
  );
  card(
    slide,
    4.9,
    1.35,
    3.55,
    1.55,
    "Application Web",
    "Angular 21\nPrimeNG\nChart.js",
    SKY,
    20,
    16,
  );
  card(
    slide,
    9.05,
    1.35,
    3.55,
    1.55,
    "Application Mobile",
    "Ionic 8\nAngular 20\nCapacitor",
    AMBER,
    20,
    16,
  );
  card(
    slide,
    0.75,
    3.65,
    3.55,
    1.55,
    "Base de données",
    "PostgreSQL\nJPA / Hibernate",
    GREEN,
    20,
    16,
  );
  card(
    slide,
    4.9,
    3.65,
    3.55,
    1.55,
    "Documentation API",
    "Swagger\nOpenAPI",
    BLUE,
    20,
    16,
  );
  card(
    slide,
    9.05,
    3.65,
    3.55,
    1.55,
    "Conception",
    "UML\nDraw.io\nDiagrammes",
    SKY,
    20,
    16,
  );
}

// 7. Apports du projet
{
  const slide = pptx.addSlide();
  addTitle(
    slide,
    "Apports du projet",
    "Ce que la solution améliore pour l’établissement.",
    7,
  );
  card(
    slide,
    0.85,
    1.45,
    3.85,
    3.95,
    "Traçabilité",
    "Chaque séance peut être suivie depuis la planification jusqu’à l’émargement et la fiche de progression.",
    BLUE,
    22,
    18,
  );
  card(
    slide,
    4.95,
    1.45,
    3.85,
    3.95,
    "Fiabilité",
    "La centralisation réduit les pertes d’information et les erreurs liées au traitement manuel.",
    GREEN,
    22,
    18,
  );
  card(
    slide,
    9.05,
    1.45,
    3.45,
    3.95,
    "Transparence",
    "Les honoraires sont calculés à partir des séances réellement effectuées.",
    AMBER,
    22,
    18,
  );
}

// 8. Perspectives
{
  const slide = pptx.addSlide();
  addTitle(
    slide,
    "Perspectives",
    "Évolutions prévues après cette première version.",
    8,
  );
  card(
    slide,
    0.75,
    1.35,
    5.7,
    1.1,
    "Module étudiant",
    "Ajouter un espace de suivi individuel des étudiants.",
    BLUE,
    20,
    17,
  );
  card(
    slide,
    6.85,
    1.35,
    5.7,
    1.1,
    "Notifications",
    "Envoyer des alertes automatiques par email ou SMS.",
    SKY,
    20,
    17,
  );
  card(
    slide,
    0.75,
    2.95,
    5.7,
    1.1,
    "Communication interne",
    "Faciliter les échanges entre administration et enseignants.",
    GREEN,
    20,
    17,
  );
  card(
    slide,
    6.85,
    2.95,
    5.7,
    1.1,
    "Paiement externe éventuel",
    "Connecter plus tard un système de paiement électronique.",
    AMBER,
    20,
    17,
  );
  card(
    slide,
    3.0,
    4.55,
    7.35,
    1.1,
    "Production",
    "Renforcer les tests automatisés et préparer le déploiement.",
    RED,
    20,
    17,
  );
}

// 9. Démo
{
  const slide = pptx.addSlide();
  slide.background = { color: NAVY };
  addLogo(slide, true);
  slide.addText("Démonstration du projet", {
    x: 1,
    y: 0.85,
    w: 11.3,
    h: 0.55,
    fontSize: 38,
    bold: true,
    color: WHITE,
    align: "center",
    margin: 0,
  });
  slide.addText(
    "Parcours : connexion → planning → QR Code → fiche de progression → honoraires",
    {
      x: 1.15,
      y: 1.55,
      w: 11,
      h: 0.3,
      fontSize: 18,
      color: SKY,
      align: "center",
      margin: 0,
      fit: "shrink",
    },
  );
  [img.mobileHome, img.mobilePlanning, img.mobileFiche, img.mobileHonoraires]
    .filter(exists)
    .slice(0, 4)
    .forEach((p, i) => {
      const x = 2.0 + i * 2.35;
      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y: 2.25,
        w: 1.75,
        h: 3.8,
        rectRadius: 0.12,
        fill: { color: WHITE, transparency: 5 },
        line: { color: WHITE, transparency: 35 },
      });
      slide.addImage({
        path: p,
        x: x + 0.1,
        y: 2.35,
        w: 1.55,
        h: 3.6,
        sizing: { type: "contain", w: 1.55, h: 3.6 },
      });
    });
  slide.addText("Place à la démonstration pratique", {
    x: 1,
    y: 6.55,
    w: 11.3,
    h: 0.35,
    fontSize: 20,
    bold: true,
    color: AMBER,
    align: "center",
    margin: 0,
  });
}

// 10. Remerciements
{
  const slide = pptx.addSlide();
  slide.background = { color: NAVY };
  addLogo(slide, true);
  slide.addText("MERCI", {
    x: 1,
    y: 1.75,
    w: 11.3,
    h: 0.95,
    fontSize: 64,
    bold: true,
    color: WHITE,
    align: "center",
    margin: 0,
  });
  slide.addText("DE VOTRE ATTENTION", {
    x: 1,
    y: 2.95,
    w: 11.3,
    h: 0.45,
    fontSize: 28,
    bold: true,
    color: SKY,
    align: "center",
    margin: 0,
    charSpace: 1,
  });
  slide.addText(
    "Nous sommes à votre disposition pour répondre à vos questions.",
    {
      x: 1.3,
      y: 4.15,
      w: 10.7,
      h: 0.42,
      fontSize: 22,
      color: "E2E8F0",
      align: "center",
      margin: 0,
    },
  );
  slide.addText("EduTrack — Suivi pédagogique et calcul des honoraires", {
    x: 1,
    y: 6.45,
    w: 11.3,
    h: 0.25,
    fontSize: 14,
    color: "94A3B8",
    align: "center",
    margin: 0,
  });
}

pptx
  .writeFile({ fileName: "MEMOIRE/Presentation_EduTrack_soutenance2.pptx" })
  .then((file) => console.log(`created: ${file}`));
