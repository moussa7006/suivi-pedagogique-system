const pptxgen = require("pptxgenjs");
const fs = require("fs");

const pptx = new pptxgen();
pptx.defineLayout({ name: "CUSTOM_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "CUSTOM_WIDE";
pptx.author = "EduTrack";
pptx.title = "Presentation EduTrack soutenance";

// Couleurs Modernes (Dark Tech)
const BG_DARK = "0B1121"; // Bleu nuit très profond
const BG_CARD = "172033"; // Bleu nuit légèrement plus clair pour les cartes
const ACCENT_CYAN = "06B6D4"; // Cyan vibrant
const ACCENT_BLUE = "3B82F6"; // Bleu royal
const ACCENT_GOLD = "F59E0B"; // Or
const ACCENT_GREEN = "10B981"; // Émeraude
const TEXT_WHITE = "FFFFFF";
const TEXT_MUTED = "94A3B8"; // Gris bleuté
const LINE_COLOR = "334155";

const img = {
  logo: "backend/edutrack/src/main/resources/images/logo_INTEC_nom_Horizon-1-3-1.png",
  logo2: "backend/edutrack/src/main/resources/images/intec.png",
  dashboard:
    "MEMOIRE/Capture d'ecran application web et mobile/Capture d'écran 2026-07-02 213625.png",
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

  // Nouveaux logos
  spring: "MEMOIRE/logos/spring.svg",
  angular: "MEMOIRE/logos/angular.svg",
  ionic: "MEMOIRE/logos/ionic.svg",
  postgres: "MEMOIRE/logos/postgresql.svg",
  java: "MEMOIRE/logos/java.svg",
};

function exists(p) {
  return fs.existsSync(p);
}

function addBackground(slide) {
  slide.background = { color: BG_DARK };
  // Effets géométriques de fond (cercles néon flous/transparents)
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -2,
    y: -2,
    w: 6,
    h: 6,
    fill: { color: ACCENT_BLUE, transparency: 95 },
    line: { type: "none" },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10,
    y: 4,
    w: 6,
    h: 6,
    fill: { color: ACCENT_CYAN, transparency: 95 },
    line: { type: "none" },
  });
}

function addLogo(slide) {
  const p = exists(img.logo) ? img.logo : img.logo2;
  if (!exists(p)) return;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 11.2,
    y: 0.25,
    w: 1.8,
    h: 0.6,
    rectRadius: 0.1,
    fill: { color: TEXT_WHITE, transparency: 5 },
    line: { color: TEXT_WHITE, transparency: 80 },
  });
  slide.addImage({
    path: p,
    x: 11.3,
    y: 0.35,
    w: 1.6,
    h: 0.4,
    sizing: { type: "contain", w: 1.6, h: 0.4 },
  });
}

function addFooter(slide, index, total = 9) {
  slide.addText("EduTrack — Projet de Licence 3", {
    x: 0.5,
    y: 7.15,
    w: 5,
    h: 0.2,
    fontSize: 10,
    color: TEXT_MUTED,
    margin: 0,
  });
  slide.addText(`${index} / ${total}`, {
    x: 12.3,
    y: 7.15,
    w: 0.5,
    h: 0.2,
    fontSize: 10,
    color: ACCENT_CYAN,
    bold: true,
    align: "right",
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 7.05,
    w: 12.3,
    h: 0.01,
    fill: { color: LINE_COLOR },
  });
}

function addTitle(slide, title, index) {
  addBackground(slide);
  slide.addText(title, {
    x: 0.5,
    y: 0.3,
    w: 10,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: TEXT_WHITE,
    margin: 0,
    charSpace: 1,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 0.95,
    w: 1.5,
    h: 0.05,
    fill: { color: ACCENT_CYAN },
  });
  addLogo(slide);
  addFooter(slide, index);
}

// Composant Carte Verre (Glassmorphism)
function glassCard(slide, x, y, w, h, title, body, iconColor) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: BG_CARD, transparency: 10 },
    line: { color: LINE_COLOR, width: 1 },
  });
  if (iconColor)
    slide.addShape(pptx.ShapeType.rect, {
      x: x,
      y: y + 0.2,
      w: 0.08,
      h: 0.4,
      fill: { color: iconColor },
    });
  slide.addText(title, {
    x: x + 0.25,
    y: y + 0.15,
    w: w - 0.4,
    h: 0.35,
    fontSize: 18,
    bold: true,
    color: TEXT_WHITE,
    margin: 0,
  });
  slide.addText(body, {
    x: x + 0.25,
    y: y + 0.6,
    w: w - 0.4,
    h: h - 0.7,
    fontSize: 15,
    color: TEXT_MUTED,
    margin: 0,
    valign: "top",
  });
}

// 0. Page de Bienvenue (Showcase)
{
  const slide = pptx.addSlide();
  addBackground(slide);

  // Élément décoratif de fond
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 4.5,
    h: 7.5,
    fill: { color: ACCENT_CYAN, transparency: 85 },
    line: { type: "none" },
  });

  // Logos école (grand)
  if (exists(img.logo)) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.7,
      y: 0.5,
      w: 3.0,
      h: 1.0,
      rectRadius: 0.1,
      fill: { color: TEXT_WHITE, transparency: 10 },
      line: { color: TEXT_WHITE, transparency: 80 },
    });
    slide.addImage({
      path: img.logo,
      x: 0.8,
      y: 0.6,
      w: 2.8,
      h: 0.8,
      sizing: { type: "contain", w: 2.8, h: 0.8 },
    });
  }

  // Textes d'accueil
  slide.addText("BIENVENUE", {
    x: 0.6,
    y: 2.5,
    w: 8,
    h: 1.5,
    fontSize: 75,
    bold: true,
    color: TEXT_WHITE,
    margin: 0,
  });
  slide.addText("Soutenance de Projet de Licence", {
    x: 0.7,
    y: 3.9,
    w: 8,
    h: 0.5,
    fontSize: 26,
    color: ACCENT_CYAN,
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.75,
    y: 4.6,
    w: 2.5,
    h: 0.05,
    fill: { color: ACCENT_CYAN },
  });
  slide.addText("Présentation de la plateforme EduTrack", {
    x: 0.7,
    y: 4.9,
    w: 8,
    h: 0.5,
    fontSize: 20,
    color: TEXT_MUTED,
    margin: 0,
    italic: true,
  });

  // Showcase visuel : Ordinateur (Web)
  if (exists(img.dashboard)) {
    // Cadre/Ombre Ordinateur
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 5.6,
      y: 1.9,
      w: 6.2,
      h: 3.7,
      rectRadius: 0.05,
      fill: { color: "000000" },
      line: { color: LINE_COLOR, width: 2 },
    });
    slide.addImage({
      path: img.dashboard,
      x: 5.7,
      y: 2.0,
      w: 6.0,
      h: 3.5,
      sizing: { type: "contain", w: 6.0, h: 3.5 },
    });
  }

  // Showcase visuel : Mobile (Superposé)
  if (exists(img.mobileHome)) {
    // Cadre/Ombre Mobile
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 10.5,
      y: 2.8,
      w: 1.9,
      h: 4.0,
      rectRadius: 0.15,
      fill: { color: "000000" },
      line: { color: LINE_COLOR, width: 2 },
    });
    slide.addImage({
      path: img.mobileHome,
      x: 10.6,
      y: 2.9,
      w: 1.7,
      h: 3.8,
      sizing: { type: "contain", w: 1.7, h: 3.8 },
    });
  }
}

// 1. Page de Garde WOW
{
  const slide = pptx.addSlide();
  addBackground(slide);
  addLogo(slide);

  slide.addText("PROJET DE FIN DE CYCLE", {
    x: 1,
    y: 1.8,
    w: 11.3,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: ACCENT_CYAN,
    letterSpacing: 2,
  });
  slide.addText("EduTrack", {
    x: 0.95,
    y: 2.1,
    w: 11.3,
    h: 1.2,
    fontSize: 72,
    bold: true,
    color: TEXT_WHITE,
    margin: 0,
  });

  slide.addText(
    "CONCEPTION ET DÉVELOPPEMENT D'UNE APPLICATION\nWEB ET MOBILE DE SUIVI PÉDAGOGIQUE ET DE CALCUL\nDES HONORAIRES DES ENSEIGNANTS",
    {
      x: 1.05,
      y: 3.3,
      w: 11,
      h: 1.2,
      fontSize: 20,
      color: "E2E8F0",
      bold: true,
      margin: 0,
    },
  );

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1,
    y: 5.5,
    w: 4.5,
    h: 1.2,
    rectRadius: 0.1,
    fill: { color: BG_CARD },
    line: { color: LINE_COLOR },
  });
  slide.addText("Présenté par", {
    x: 1.2,
    y: 5.65,
    w: 4,
    h: 0.2,
    fontSize: 12,
    color: TEXT_MUTED,
  });
  slide.addText("Moussa Balla KEITA\nAya BOURAMA", {
    x: 1.2,
    y: 5.9,
    w: 4,
    h: 0.6,
    fontSize: 18,
    bold: true,
    color: TEXT_WHITE,
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 5.8,
    y: 5.5,
    w: 4.5,
    h: 1.2,
    rectRadius: 0.1,
    fill: { color: BG_CARD },
    line: { color: LINE_COLOR },
  });
  slide.addText("Sous la direction de", {
    x: 6.0,
    y: 5.65,
    w: 4,
    h: 0.2,
    fontSize: 12,
    color: TEXT_MUTED,
  });
  slide.addText("M. Mouhamoud Dembele\nINTEC SUP - 2025/2026", {
    x: 6.0,
    y: 5.9,
    w: 4,
    h: 0.6,
    fontSize: 18,
    bold: true,
    color: TEXT_WHITE,
  });
}

// 2. Problématique & Objectifs
{
  const slide = pptx.addSlide();
  addTitle(slide, "Problématique & Objectifs", 2);
  glassCard(
    slide,
    0.5,
    1.8,
    3.8,
    4.5,
    "Le Constat",
    "La gestion des activités pédagogiques repose encore largement sur des fichiers Excel et des formulaires papier, fragmentant l’information.",
    ACCENT_BLUE,
  );
  glassCard(
    slide,
    4.75,
    1.8,
    3.8,
    4.5,
    "Le Problème",
    "Ces méthodes manuelles engendrent :\n\n• Des erreurs de saisie\n• Un manque de traçabilité\n• Une complexité pour calculer les honoraires des enseignants.",
    ACCENT_GOLD,
  );
  glassCard(
    slide,
    9,
    1.8,
    3.8,
    4.5,
    "Notre Objectif",
    "Créer un écosystème numérique (Web & Mobile) capable de centraliser les emplois du temps, fiabiliser l’émargement et automatiser le calcul financier.",
    ACCENT_CYAN,
  );
}

// 3. La Solution EduTrack
{
  const slide = pptx.addSlide();
  addTitle(slide, "La Solution : EduTrack", 3);

  if (exists(img.dashboard)) {
    // Ombre sous l'image
    slide.addShape(pptx.ShapeType.rect, {
      x: 5.6,
      y: 1.6,
      w: 7.1,
      h: 5.1,
      fill: { color: "000000", transparency: 60 },
    });
    slide.addImage({
      path: img.dashboard,
      x: 5.5,
      y: 1.5,
      w: 7.1,
      h: 5.1,
      sizing: { type: "contain", w: 7.1, h: 5.1 },
    });
  }

  glassCard(
    slide,
    0.5,
    1.5,
    4.5,
    1.1,
    "Espace Web (Admin)",
    "Gestion des classes, matières et planification des emplois du temps.",
    ACCENT_BLUE,
  );
  glassCard(
    slide,
    0.5,
    2.8,
    4.5,
    1.1,
    "Technologie QR Code",
    "Génération d’un QR Code unique pour chaque séance planifiée.",
    ACCENT_CYAN,
  );
  glassCard(
    slide,
    0.5,
    4.1,
    4.5,
    1.1,
    "Espace Mobile (Enseignant)",
    "Émargement rapide, remplissage de la fiche de progression et suivi.",
    ACCENT_GREEN,
  );
  glassCard(
    slide,
    0.5,
    5.4,
    4.5,
    1.1,
    "Module Honoraires",
    "Calcul automatisé basé sur la présence réelle validée.",
    ACCENT_GOLD,
  );
}

// 4. Fonctionnement du Système
{
  const slide = pptx.addSlide();
  addTitle(slide, "Fonctionnement du système", 4);

  const steps = [
    {
      n: "1",
      t: "Planification",
      d: "L’admin crée une séance",
      c: ACCENT_BLUE,
    },
    { n: "2", t: "Génération", d: "Un QR Code est généré", c: ACCENT_CYAN },
    {
      n: "3",
      t: "Émargement",
      d: "L’enseignant scanne le code",
      c: ACCENT_GREEN,
    },
    {
      n: "4",
      t: "Validation",
      d: "Il remplit la fiche de suivi",
      c: ACCENT_GOLD,
    },
    { n: "5", t: "Calcul", d: "Honoraires mis à jour", c: "#8B5CF6" },
  ];

  steps.forEach((s, i) => {
    const x = 0.5 + i * 2.55;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.8,
      w: 2.3,
      h: 2.5,
      rectRadius: 0.1,
      fill: { color: BG_CARD },
      line: { color: s.c, width: 2 },
    });
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.75,
      y: 1.8,
      w: 0.8,
      h: 0.8,
      fill: { color: s.c },
    });
    slide.addText(s.n, {
      x: x + 0.75,
      y: 1.8,
      w: 0.8,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: TEXT_WHITE,
      align: "center",
    });

    slide.addText(s.t, {
      x: x,
      y: 3.2,
      w: 2.3,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: TEXT_WHITE,
      align: "center",
    });
    slide.addText(s.d, {
      x: x + 0.1,
      y: 3.7,
      w: 2.1,
      h: 1,
      fontSize: 14,
      color: TEXT_MUTED,
      align: "center",
      valign: "top",
    });
  });
}

// 5. Architecture Technique
{
  const slide = pptx.addSlide();
  addTitle(slide, "Architecture Technique", 5);

  if (exists(img.architecture)) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y: 1.4,
      w: 12.33,
      h: 5.5,
      rectRadius: 0.05,
      fill: { color: "FFFFFF", transparency: 10 },
    });
    slide.addImage({
      path: img.architecture,
      x: 0.6,
      y: 1.5,
      w: 12.13,
      h: 5.3,
      sizing: { type: "contain", w: 12.13, h: 5.3 },
    });
  }
}

// 6. OUTILS ET TECHNOLOGIES (LA SLIDE WAOUH)
{
  const slide = pptx.addSlide();
  addTitle(slide, "Technologies & Frameworks", 6);

  function techCard(x, y, w, h, title, logoPath) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.1,
      fill: { color: BG_CARD },
      line: { color: LINE_COLOR },
    });
    if (exists(logoPath)) {
      slide.addImage({
        path: logoPath,
        x: x + 0.3,
        y: y + 0.3,
        w: 0.8,
        h: 0.8,
        sizing: { type: "contain", w: 0.8, h: 0.8 },
      });
    }
    slide.addText(title, {
      x: x + 1.3,
      y: y + 0.3,
      w: w - 1.5,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: TEXT_WHITE,
      valign: "middle",
    });
  }

  techCard(0.8, 1.8, 5.5, 1.4, "Spring Boot 3", img.spring);
  techCard(0.8, 3.5, 5.5, 1.4, "Java 17", img.java);
  techCard(0.8, 5.2, 5.5, 1.4, "PostgreSQL", img.postgres);

  techCard(7.0, 1.8, 5.5, 1.4, "Angular 21", img.angular);
  techCard(7.0, 3.5, 5.5, 1.4, "Ionic 8", img.ionic);

  // Carte générique pour JWT/Security
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.0,
    y: 5.2,
    w: 5.5,
    h: 1.4,
    rectRadius: 0.1,
    fill: { color: BG_CARD },
    line: { color: LINE_COLOR },
  });
  slide.addText("Spring Security + JWT\nSwagger OpenAPI", {
    x: 7.2,
    y: 5.3,
    w: 5.1,
    h: 1.2,
    fontSize: 20,
    bold: true,
    color: ACCENT_CYAN,
    valign: "middle",
    align: "center",
  });
}

// 7. DÉMONSTRATION MOBILE (Mockups)
{
  const slide = pptx.addSlide();
  addTitle(slide, "Espace Mobile Enseignant", 7);

  const screens = [
    img.mobileHome,
    img.mobilePlanning,
    img.mobileFiche,
    img.mobileHonoraires,
  ].filter(exists);
  const titles = ["Accueil", "Planning", "Progression", "Honoraires"];

  screens.slice(0, 4).forEach((p, i) => {
    const x = 1.0 + i * 2.9;

    // Cadre téléphone
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.6,
      w: 2.2,
      h: 4.8,
      rectRadius: 0.15,
      fill: { color: "000000" },
      line: { color: LINE_COLOR, width: 2 },
    });
    // Écran
    slide.addImage({
      path: p,
      x: x + 0.1,
      y: 1.7,
      w: 2.0,
      h: 4.6,
      sizing: { type: "contain", w: 2.0, h: 4.6 },
    });

    slide.addText(titles[i], {
      x,
      y: 6.5,
      w: 2.2,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: ACCENT_CYAN,
      align: "center",
    });
  });
}

// 8. ANNONCE DÉMONSTRATION
{
  const slide = pptx.addSlide();
  addBackground(slide);
  addLogo(slide);

  // Grand texte au centre
  slide.addText("DÉMONSTRATION", {
    x: 1,
    y: 2.5,
    w: 11.3,
    h: 1.5,
    fontSize: 60,
    bold: true,
    color: TEXT_WHITE,
    align: "center",
    margin: 0,
  });

  // Ligne de séparation
  slide.addShape(pptx.ShapeType.rect, {
    x: 4.6,
    y: 4.2,
    w: 4.1,
    h: 0.05,
    fill: { color: ACCENT_GREEN },
  });

  // Sous-titre
  slide.addText("Présentation en direct de l'application EduTrack", {
    x: 1,
    y: 4.6,
    w: 11.3,
    h: 0.5,
    fontSize: 26,
    color: ACCENT_GREEN,
    align: "center",
    margin: 0,
  });
}

// 9. Perspectives
{
  const slide = pptx.addSlide();
  addTitle(slide, "Perspectives d'évolution", 8);

  glassCard(
    slide,
    0.8,
    1.8,
    5.5,
    2.0,
    "Module Étudiant",
    "Développement d’un portail dédié aux étudiants pour consulter leurs notes, emplois du temps et absences.",
    ACCENT_CYAN,
  );
  glassCard(
    slide,
    7.0,
    1.8,
    5.5,
    2.0,
    "Paiement Électronique",
    "Intégration d’une API bancaire ou mobile money pour automatiser le versement direct des honoraires.",
    ACCENT_GOLD,
  );
  glassCard(
    slide,
    0.8,
    4.2,
    5.5,
    2.0,
    "Notifications Intelligentes",
    "Alertes par SMS et Email en cas de retard, d'absence ou de modification de planning.",
    ACCENT_BLUE,
  );
  glassCard(
    slide,
    7.0,
    4.2,
    5.5,
    2.0,
    "Déploiement Cloud",
    "Mise en production sécurisée sur un serveur dédié avec intégration continue.",
    ACCENT_GREEN,
  );
}

// 9. Remerciements
{
  const slide = pptx.addSlide();
  addBackground(slide);
  addLogo(slide);

  slide.addText("MERCI POUR VOTRE ATTENTION", {
    x: 1,
    y: 2.5,
    w: 11.3,
    h: 1.5,
    fontSize: 56,
    bold: true,
    color: TEXT_WHITE,
    align: "center",
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 4.6,
    y: 4.0,
    w: 4.1,
    h: 0.05,
    fill: { color: ACCENT_CYAN },
  });
  slide.addText(
    "Nous sommes à votre disposition pour répondre à vos questions",
    {
      x: 1,
      y: 4.3,
      w: 11.3,
      h: 0.5,
      fontSize: 24,
      color: ACCENT_CYAN,
      align: "center",
      margin: 0,
    },
  );
}

pptx
  .writeFile({ fileName: "MEMOIRE/Presentation_EduTrack_soutenance2.pptx" })
  .then((file) => console.log(`created: ${file}`));
