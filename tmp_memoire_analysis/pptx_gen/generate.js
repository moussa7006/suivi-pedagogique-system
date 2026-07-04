const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 inches width x 5.625 inches height

// Charte graphique moderne et épurée
const C_PRIMARY = "0F172A"; // Slate 900 (Bleu très sombre)
const C_ACCENT = "3B82F6"; // Blue 500 (Bleu vif pour les titres/accents)
const C_TEXT = "334155"; // Slate 700 (Gris foncé pour texte lisible)
const C_BG_LIGHT = "F8FAFC"; // Slate 50 (Fond très clair)

// Définition du Master Slide (en-tête et pied de page discrets)
pres.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "FFFFFF" },
  objects: [
    { rect: { x: 0, y: 0, w: 10, h: 0.15, fill: { color: C_ACCENT } } }, // Fine barre colorée en haut
    { rect: { x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: C_PRIMARY } } }, // Barre discrète en bas
    {
      text: {
        text: "Soutenance de Licence 3 - INTEC SUP",
        options: {
          x: 0.5,
          y: 5.3,
          w: 4,
          h: 0.325,
          color: "FFFFFF",
          fontSize: 10,
          fontFace: "Segoe UI",
          valign: "middle",
        },
      },
    },
    {
      text: {
        text: "Projet EduTrack - 2025/2026",
        options: {
          x: 5.5,
          y: 5.3,
          w: 4,
          h: 0.325,
          color: "FFFFFF",
          fontSize: 10,
          align: "right",
          fontFace: "Segoe UI",
          valign: "middle",
        },
      },
    },
  ],
});

// ================= 1. PAGE DE BIENVENUE =================
let slide1 = pres.addSlide();
slide1.background = { color: C_PRIMARY };
slide1.addText("SOUTENANCE DE MÉMOIRE", {
  x: 1,
  y: 0.8,
  w: 8,
  h: 0.6,
  color: C_ACCENT,
  fontSize: 18,
  bold: true,
  align: "center",
  letterSpacing: 1.5,
  fontFace: "Segoe UI",
});
slide1.addText(
  "CONCEPTION ET DÉVELOPPEMENT D'UNE APPLICATION\nWEB ET MOBILE DE SUIVI PÉDAGOGIQUE",
  {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.2,
    color: "FFFFFF",
    fontSize: 26,
    bold: true,
    align: "center",
    fontFace: "Segoe UI",
  },
);
slide1.addText("Projet : EduTrack", {
  x: 3,
  y: 2.8,
  w: 4,
  h: 0.6,
  fill: { color: C_ACCENT },
  color: "FFFFFF",
  fontSize: 22,
  bold: true,
  align: "center",
  fontFace: "Segoe UI",
  shape: pres.ShapeType.roundRect,
});

slide1.addText("Présenté par :\nMoussa Balla KEITA & Aya BOURAMA", {
  x: 1,
  y: 4.2,
  w: 4,
  h: 1,
  color: "E2E8F0",
  fontSize: 14,
  align: "left",
  fontFace: "Segoe UI",
});
slide1.addText("Sous la direction de :\nM. Mouhamoud Dembele", {
  x: 5,
  y: 4.2,
  w: 4,
  h: 1,
  color: "E2E8F0",
  fontSize: 14,
  align: "right",
  fontFace: "Segoe UI",
});

// ================= 2. INTRODUCTION =================
let slide2 = pres.addSlide({ masterName: "MASTER_SLIDE" });
slide2.addText("Introduction & Contexte", {
  x: 0.5,
  y: 0.3,
  w: 9,
  h: 0.6,
  color: C_PRIMARY,
  fontSize: 28,
  bold: true,
  fontFace: "Segoe UI",
});

slide2.addText("Le Contexte", {
  x: 0.5,
  y: 1.2,
  w: 9,
  h: 0.4,
  color: C_ACCENT,
  fontSize: 18,
  bold: true,
  fontFace: "Segoe UI",
});
slide2.addText(
  "• Transformation numérique des établissements d'enseignement supérieur.\n• Nécessité d'outils modernes pour centraliser la gestion académique.",
  {
    x: 0.5,
    y: 1.6,
    w: 9,
    h: 0.8,
    color: C_TEXT,
    fontSize: 16,
    fontFace: "Segoe UI",
    lineSpacing: 28,
  },
);

slide2.addText("La Problématique", {
  x: 0.5,
  y: 2.8,
  w: 9,
  h: 0.4,
  color: C_ACCENT,
  fontSize: 18,
  bold: true,
  fontFace: "Segoe UI",
});
slide2.addText(
  "• Processus de suivi pédagogique souvent manuel et fastidieux.\n• Manque de transparence et complexité dans le calcul des honoraires.\n• Risques d'erreurs et de pertes liés aux feuilles de présence papier.",
  {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 1.2,
    color: C_TEXT,
    fontSize: 16,
    fontFace: "Segoe UI",
    lineSpacing: 28,
  },
);

// ================= 3. LA SOLUTION EDUTRACK =================
let slide3 = pres.addSlide({ masterName: "MASTER_SLIDE" });
slide3.addText("La Solution : EduTrack", {
  x: 0.5,
  y: 0.3,
  w: 9,
  h: 0.6,
  color: C_PRIMARY,
  fontSize: 28,
  bold: true,
  fontFace: "Segoe UI",
});

slide3.addText("Pour l'Administration (Web)", {
  x: 0.5,
  y: 1.2,
  w: 4.5,
  h: 0.4,
  color: C_ACCENT,
  fontSize: 16,
  bold: true,
  fontFace: "Segoe UI",
});
slide3.addText(
  "• Gestion centralisée (classes, enseignants)\n• Planification des emplois du temps\n• Génération de QR Codes\n• Calcul automatisé des honoraires",
  {
    x: 0.5,
    y: 1.6,
    w: 4.5,
    h: 1.2,
    color: C_TEXT,
    fontSize: 14,
    fontFace: "Segoe UI",
    lineSpacing: 22,
  },
);

slide3.addText("Pour les Enseignants (Mobile)", {
  x: 0.5,
  y: 3.1,
  w: 4.5,
  h: 0.4,
  color: C_ACCENT,
  fontSize: 16,
  bold: true,
  fontFace: "Segoe UI",
});
slide3.addText(
  "• Émargement rapide par QR Code\n• Fiches de progression numériques\n• Consultation du planning\n• Suivi des honoraires",
  {
    x: 0.5,
    y: 3.5,
    w: 4.5,
    h: 1.2,
    color: C_TEXT,
    fontSize: 14,
    fontFace: "Segoe UI",
    lineSpacing: 22,
  },
);

// Image parfaitement alignée à droite
try {
  slide3.addImage({
    path: "MEMOIRE/Capture d'ecran application web et mobile/Capture d'écran 2026-07-02 213625.png",
    x: 5.2,
    y: 1.2,
    w: 4.3,
    h: 3.5,
    sizing: { type: "contain", w: 4.3, h: 3.5 },
  });
} catch (e) {}

// ================= 4. ARCHITECTURE DU PROJET =================
let slide4 = pres.addSlide({ masterName: "MASTER_SLIDE" });
slide4.addText("Architecture du Système", {
  x: 0.5,
  y: 0.3,
  w: 9,
  h: 0.6,
  color: C_PRIMARY,
  fontSize: 28,
  bold: true,
  fontFace: "Segoe UI",
});
try {
  slide4.addImage({
    path: "MEMOIRE/generated_schemas/architecture_systeme_edutrack_simple_PNG.png",
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 4.1,
    sizing: { type: "contain", w: 9, h: 4.1 },
  });
} catch (e) {}

// ================= 5. OUTILS UTILISÉS =================
let slide5 = pres.addSlide({ masterName: "MASTER_SLIDE" });
slide5.addText("Technologies & Outils", {
  x: 0.5,
  y: 0.3,
  w: 9,
  h: 0.6,
  color: C_PRIMARY,
  fontSize: 28,
  bold: true,
  fontFace: "Segoe UI",
});

const createCard = (slide, x, y, title, text) => {
  slide.addShape(pres.ShapeType.roundRect, {
    x: x,
    y: y,
    w: 4.2,
    h: 1.5,
    fill: { color: C_BG_LIGHT },
    line: { color: "CBD5E1", width: 1 },
  });
  slide.addText(title, {
    x: x + 0.2,
    y: y + 0.1,
    w: 3.8,
    h: 0.3,
    color: C_ACCENT,
    fontSize: 16,
    bold: true,
    fontFace: "Segoe UI",
  });
  slide.addText(text, {
    x: x + 0.2,
    y: y + 0.5,
    w: 3.8,
    h: 0.9,
    color: C_TEXT,
    fontSize: 14,
    fontFace: "Segoe UI",
    lineSpacing: 20,
  });
};

// Grille 2x2 propre
createCard(
  slide5,
  0.5,
  1.2,
  "Backend & Sécurité",
  "• Spring Boot 3.4.3 (Java 17)\n• Spring Security & JWT\n• Hibernate (JPA)",
);
createCard(
  slide5,
  5.3,
  1.2,
  "Application Mobile",
  "• Ionic 8 & Angular 20\n• Capacitor 8 (Caméra, Natif)\n• Scanner QR intégré",
);
createCard(
  slide5,
  0.5,
  3.1,
  "Frontend Web (Admin)",
  "• Angular 21\n• PrimeNG (Composants UI)\n• Chart.js (Statistiques)",
);
createCard(
  slide5,
  5.3,
  3.1,
  "Base de données & Conception",
  "• PostgreSQL\n• Swagger / OpenAPI\n• Draw.io pour l'UML",
);

// ================= 6. PERSPECTIVES =================
let slide6 = pres.addSlide({ masterName: "MASTER_SLIDE" });
slide6.addText("Perspectives d'Évolution", {
  x: 0.5,
  y: 0.3,
  w: 9,
  h: 0.6,
  color: C_PRIMARY,
  fontSize: 28,
  bold: true,
  fontFace: "Segoe UI",
});
slide6.addText(
  "Plusieurs améliorations sont envisagées pour les futures versions :",
  {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 0.4,
    color: C_TEXT,
    fontSize: 16,
    fontFace: "Segoe UI",
  },
);

slide6.addText(
  "• Intégration d'un module étudiant pour le suivi individuel.\n" +
    "• Ajout de notifications automatiques (SMS / Email).\n" +
    "• Développement d'un module de communication interne.\n" +
    "• Intégration éventuelle avec un système de paiement électronique externe.\n" +
    "• Renforcement des tests automatisés et déploiement en production.",
  {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 3,
    color: C_PRIMARY,
    fontSize: 18,
    fontFace: "Segoe UI",
    lineSpacing: 35,
  },
);

// ================= 7. ANNONCE DE LA DÉMO =================
let slide7 = pres.addSlide({ masterName: "MASTER_SLIDE" });
slide7.addText("Démonstration de l'Application", {
  x: 0.5,
  y: 0.3,
  w: 9,
  h: 0.6,
  color: C_PRIMARY,
  fontSize: 28,
  bold: true,
  fontFace: "Segoe UI",
  align: "center",
});
slide7.addText("Aperçu de l'interface mobile enseignant", {
  x: 0.5,
  y: 1.0,
  w: 9,
  h: 0.4,
  color: C_ACCENT,
  fontSize: 16,
  fontFace: "Segoe UI",
  align: "center",
  italic: true,
});

// Alignement propre de 3 captures d'écran mobiles au centre
try {
  slide7.addImage({
    path: "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213134_mobile-ionic.jpg",
    x: 2.2,
    y: 1.5,
    w: 1.6,
    h: 3.4,
    sizing: { type: "contain", w: 1.6, h: 3.4 },
  });
  slide7.addImage({
    path: "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213120_mobile-ionic.jpg",
    x: 4.2,
    y: 1.5,
    w: 1.6,
    h: 3.4,
    sizing: { type: "contain", w: 1.6, h: 3.4 },
  });
  slide7.addImage({
    path: "MEMOIRE/Capture d'ecran application web et mobile/Screenshot_20260702_213143_mobile-ionic.jpg",
    x: 6.2,
    y: 1.5,
    w: 1.6,
    h: 3.4,
    sizing: { type: "contain", w: 1.6, h: 3.4 },
  });
} catch (e) {}

// ================= 8. REMERCIEMENTS =================
let slide8 = pres.addSlide();
slide8.background = { color: C_PRIMARY };
slide8.addText("MERCI DE VOTRE ATTENTION", {
  x: 1,
  y: 2.0,
  w: 8,
  h: 1,
  color: "FFFFFF",
  fontSize: 36,
  bold: true,
  align: "center",
  fontFace: "Segoe UI",
});
slide8.addText(
  "Nous sommes à votre disposition pour répondre à vos questions.",
  {
    x: 1,
    y: 3.2,
    w: 8,
    h: 0.6,
    color: C_ACCENT,
    fontSize: 20,
    align: "center",
    fontFace: "Segoe UI",
  },
);

// Sauvegarde
pres
  .writeFile({ fileName: "MEMOIRE/Presentation_EduTrack_soutenance.pptx" })
  .then((fileName) => {
    console.log("created: " + fileName);
  });
