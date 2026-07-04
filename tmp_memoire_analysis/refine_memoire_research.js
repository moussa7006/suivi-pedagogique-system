const fs = require("fs");
const path = require("path");

const docPath = path.join("tmp_docx_edit", "word", "document.xml");
let xml = fs.readFileSync(docPath, "utf8");

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function p(text) {
  return `<w:p><w:pPr><w:spacing w:before="80" w:after="80"/><w:jc w:val="both"/></w:pPr><w:r><w:t>${esc(text)}</w:t></w:r></w:p>`;
}
function pBreakLines(lines) {
  return `<w:p><w:pPr><w:spacing w:before="80" w:after="140"/><w:jc w:val="left"/></w:pPr>${lines.map((line, i) => `<w:r>${i ? "<w:br/>" : ""}<w:t>${esc(line)}</w:t></w:r>`).join("")}</w:p>`;
}
function h(text) {
  return `<w:p><w:pPr><w:spacing w:before="220" w:after="100"/><w:jc w:val="left"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:t>${esc(text)}</w:t></w:r></w:p>`;
}
function paraText(para) {
  return para
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function replaceAll(a, b) {
  xml = xml.split(a).join(b);
}
function insertAfterParagraphContaining(needle, content, marker) {
  if (marker && xml.includes(marker)) return false;
  const re = /<w:p[\s\S]*?<\/w:p>/g;
  let m;
  while ((m = re.exec(xml))) {
    if (paraText(m[0]).includes(needle)) {
      const pos = m.index + m[0].length;
      xml = xml.slice(0, pos) + content + xml.slice(pos);
      return true;
    }
  }
  console.log("anchor not found:", needle);
  return false;
}
function replaceParagraphContaining(needle, content) {
  const re = /<w:p[\s\S]*?<\/w:p>/g;
  let m;
  while ((m = re.exec(xml))) {
    if (paraText(m[0]).includes(needle)) {
      xml = xml.slice(0, m.index) + content + xml.slice(m.index + m[0].length);
      return true;
    }
  }
  console.log("paragraph not found:", needle);
  return false;
}
function removeParagraphContaining(needle) {
  const re = /<w:p[\s\S]*?<\/w:p>/g;
  let m;
  while ((m = re.exec(xml))) {
    if (paraText(m[0]).includes(needle)) {
      xml = xml.slice(0, m.index) + xml.slice(m.index + m[0].length);
      return true;
    }
  }
  return false;
}

// 1. Correction orthographique : le/du/au calcul.
const replacements = [
  [
    "La calcul des honoraires des enseignants",
    "Le calcul des honoraires des enseignants",
  ],
  [
    "la calcul des honoraires des enseignants",
    "le calcul des honoraires des enseignants",
  ],
  ["La calcul des honoraires", "Le calcul des honoraires"],
  ["la calcul des honoraires", "le calcul des honoraires"],
  ["à la calcul des honoraires", "au calcul des honoraires"],
  ["de la calcul des honoraires", "du calcul des honoraires"],
  ["à la calcul", "au calcul"],
  ["de la calcul", "du calcul"],
  ["Section 2 : La calcul", "Section 2 : Le calcul"],
  ["Section 2 : la calcul", "Section 2 : le calcul"],
  ["la calcul", "le calcul"],
  ["La calcul", "Le calcul"],
  [
    "Principes de calcul et de calcul des honoraires",
    "Principes du calcul des honoraires",
  ],
  ["à le calcul", "au calcul"],
  ["de le calcul", "du calcul"],
  [
    "La première partie, consacrée au cadre théorique, aborde les concepts fondamentaux liés au suivi pédagogique et à le calcul",
    "La première partie, consacrée au cadre théorique, aborde les concepts fondamentaux liés au suivi pédagogique et au calcul",
  ],
  [
    "relatives au suivi pédagogique, à le calcul",
    "relatives au suivi pédagogique, au calcul",
  ],
  [
    "Question principale : Comment un système numérique intégré peut-il améliorer le suivi pédagogique et à le calcul",
    "Question principale : Comment un système numérique intégré peut-il améliorer le suivi pédagogique et le calcul",
  ],
];
for (const [a, b] of replacements) replaceAll(a, b);

// 2. Numérotation : I- devient I.
xml = xml.replace(/\b([IVX]+)-/g, "$1.");

// 3. Puces uniformisées avec le symbole •.
xml = xml.replace(/<w:t>- /g, "<w:t>• ");
xml = xml.replace(
  /<w:t xml:space="preserve">- /g,
  '<w:t xml:space="preserve">• ',
);
xml = xml.replace(/ : - /g, " : • ");
xml = xml.replace(/ ; - /g, " ; • ");
xml = xml.replace(/\. - /g, ". • ");

// 4. Sources sous les captures.
replaceAll(
  "Source : capture d’écran de l’application EduTrack.",
  "Source : Capture d'écran réalisée par l'auteur à partir de l'application EduTrack.",
);
replaceAll(
  "Source : capture d’écran de l’application mobile EduTrack.",
  "Source : Capture d'écran réalisée par l'auteur à partir de l'application EduTrack.",
);
replaceAll(
  "Source : capture d'écran de l’application EduTrack.",
  "Source : Capture d'écran réalisée par l'auteur à partir de l'application EduTrack.",
);

// 5. Citations et renforcement scientifique.
insertAfterParagraphContaining(
  "Méthodologie de travail",
  p(
    "Cette démarche s’inscrit dans une logique de recherche appliquée : elle part d’un problème concret observé dans un établissement d’enseignement supérieur, mobilise des références théoriques et techniques, puis propose une solution expérimentale évaluée à partir de scénarios fonctionnels. Selon Sommerville (2016), l’ingénierie logicielle vise à produire des systèmes fiables en s’appuyant sur l’analyse des besoins, la conception structurée et la validation progressive.",
  ),
  "Selon Sommerville (2016)",
);
insertAfterParagraphContaining(
  "I. Définition et objectifs du suivi pédagogique",
  p(
    "Dans la littérature sur les systèmes d’information, la centralisation et la qualité des données constituent des facteurs essentiels pour améliorer la coordination et la prise de décision organisationnelle (Laudon et Laudon, 2020). Appliqué au contexte pédagogique, ce principe justifie l’utilisation d’un outil numérique capable de regrouper les séances, les émargements, les fiches de progression et les honoraires calculés.",
  ),
  "Laudon et Laudon, 2020",
);
insertAfterParagraphContaining(
  "I. Spring Boot et architectures REST",
  p(
    "Le choix d’une architecture REST est cohérent avec les recommandations courantes de conception d’applications distribuées, car elle facilite la séparation entre le backend, l’interface web et l’application mobile. Pressman (2014) souligne que la modularité et la séparation des responsabilités améliorent la maintenabilité des systèmes logiciels. La documentation officielle Spring Boot (Spring IO, consultée le 15 mars 2026) confirme également l’intérêt du framework pour développer rapidement des services web robustes.",
  ),
  "Spring IO, consultée le 15 mars 2026",
);
insertAfterParagraphContaining(
  "II. PostgreSQL et persistance des données",
  p(
    "PostgreSQL a été retenu pour sa fiabilité, sa conformité SQL et ses mécanismes de contraintes relationnelles. Ces caractéristiques sont importantes pour un système manipulant des données pédagogiques et administratives sensibles, notamment les séances, les émargements et les honoraires calculés (PostgreSQL Global Development Group, consulté le 15 mars 2026).",
  ),
  "PostgreSQL Global Development Group",
);
insertAfterParagraphContaining(
  "II. Développement frontend avec Angular",
  p(
    "Angular a été choisi pour structurer l’interface web en composants réutilisables et faciliter la maintenance de l’application. La documentation Angular recommande cette approche par composants pour organiser les interfaces complexes et améliorer la lisibilité du code (Angular, consulté le 20 mars 2026).",
  ),
  "Angular, consulté le 20 mars 2026",
);
insertAfterParagraphContaining(
  "I. Développement mobile avec Ionic/Capacitor",
  p(
    "Ionic et Capacitor permettent de produire une application mobile hybride à partir de technologies web tout en donnant accès à certaines fonctionnalités natives. Ce choix est adapté à un projet de licence, car il réduit le coût de développement tout en offrant une application installable sur smartphone (Ionic, consulté le 25 mars 2026 ; Capacitor, consulté le 25 mars 2026).",
  ),
  "Capacitor, consulté le 25 mars 2026",
);

// 6. Comparaison avec solutions existantes / travaux similaires.
insertAfterParagraphContaining(
  "Questions de recherche, objectifs et hypothèses",
  h("Mise en perspective avec les solutions existantes") +
    p(
      "Plusieurs établissements utilisent encore des outils génériques tels que les feuilles Excel, les formulaires papier ou des plateformes académiques orientées principalement vers la gestion des notes et des étudiants. Ces solutions permettent une gestion minimale des données, mais elles restent souvent limitées pour assurer simultanément l’émargement des enseignants, le suivi de la progression pédagogique et le calcul des honoraires. Par comparaison, EduTrack se distingue par l’intégration de ces trois dimensions dans une même application web et mobile, avec un mécanisme d’émargement par QR Code et une consultation mobile destinée aux enseignants.",
    ) +
    p(
      "Cette comparaison montre que l’intérêt scientifique et pratique du projet ne réside pas seulement dans le développement informatique, mais aussi dans la réponse à une problématique organisationnelle : comment améliorer la traçabilité des activités pédagogiques et fiabiliser les données utilisées pour le calcul administratif des honoraires ?",
    ),
  "Mise en perspective avec les solutions existantes",
);

// 7. Transitions après titres majeurs.
insertAfterParagraphContaining(
  "Partie I : Cadre théorique",
  p(
    "Cette partie présente les fondements conceptuels et techniques nécessaires à la compréhension du projet. Elle permet de situer EduTrack dans le champ du suivi pédagogique, des systèmes d’information et des technologies de développement web et mobile.",
  ),
  "Cette partie présente les fondements conceptuels et techniques nécessaires",
);
insertAfterParagraphContaining(
  "Partie II : Cas pratique – Analyse, conception et implémentation",
  p(
    "Après avoir posé le cadre théorique, cette partie expose la démarche pratique suivie pour concevoir, développer et valider EduTrack. Elle met en relation les besoins identifiés, les choix de conception et les résultats obtenus.",
  ),
  "Après avoir posé le cadre théorique, cette partie expose",
);
insertAfterParagraphContaining(
  "Chapitre 1 : Analyse et conception du système",
  p(
    "Ce chapitre assure la transition entre l’étude du besoin et la réalisation technique. Il présente les exigences fonctionnelles et non fonctionnelles, puis décrit les principaux choix de modélisation du système.",
  ),
  "Ce chapitre assure la transition entre l’étude du besoin",
);
insertAfterParagraphContaining(
  "Chapitre 2 : Implémentation et validation",
  p(
    "Ce chapitre montre comment les choix de conception ont été traduits en composants logiciels opérationnels. Il présente également les validations réalisées afin d’apprécier la conformité de la solution aux besoins définis.",
  ),
  "Ce chapitre montre comment les choix de conception ont été traduits",
);

// 8. Tableau de validation : puces et lisibilité.
replaceAll(
  "Scénario testé | Résultat attendu | Résultat obtenu | Statut",
  "Scénario testé — Résultat attendu — Résultat obtenu — Statut",
);
replaceAll(" | ", " — ");

// 9. Conclusion renforcée.
insertAfterParagraphContaining(
  "transformation numérique de l'enseignement supérieur au Mali.",
  p(
    "En définitive, ce travail démontre qu'une solution numérique telle qu'EduTrack contribue à améliorer le suivi pédagogique, la traçabilité des activités d'enseignement et la transparence du calcul des honoraires des enseignants, tout en participant à la transformation numérique des établissements d'enseignement supérieur.",
  ),
  "En définitive, ce travail démontre",
);

// 10. Bibliographie au schéma demandé.
const biblio = [
  h("Ouvrages"),
  pBreakLines([
    "SOMMERVILLE Ian",
    "Software Engineering, 10e édition, Pearson, Londres, 2016.",
    "Consulté dans le cadre de l’étude de l’ingénierie logicielle.",
  ]),
  pBreakLines([
    "PRESSMAN Roger S.",
    "Software Engineering: A Practitioner’s Approach, 8e édition, McGraw-Hill, New York, 2014.",
    "Consulté dans le cadre de l’étude de la conception logicielle.",
  ]),
  pBreakLines([
    "LAUDON Kenneth C. et LAUDON Jane P.",
    "Management Information Systems: Managing the Digital Firm, 16e édition, Pearson, New York, 2020.",
    "Consulté dans le cadre de l’étude des systèmes d’information.",
  ]),
  pBreakLines([
    "BOOCH Grady ; RUMBAUGH James ; JACOBSON Ivar",
    "The Unified Modeling Language User Guide, 2e édition, Addison-Wesley, Boston, 2005.",
    "Consulté dans le cadre de la modélisation UML.",
  ]),
  pBreakLines([
    "FOWLER Martin",
    "UML Distilled: A Brief Guide to the Standard Object Modeling Language, 3e édition, Addison-Wesley, Boston, 2004.",
    "Consulté dans le cadre de la modélisation UML.",
  ]),
  h("Documentation technique"),
  pBreakLines([
    "SPRING IO",
    "Spring Boot Documentation",
    "Consulté le 15 mars 2026, disponible sur : https://docs.spring.io/spring-boot/docs/current/reference/html/",
  ]),
  pBreakLines([
    "ANGULAR",
    "Angular Documentation",
    "Consulté le 20 mars 2026, disponible sur : https://angular.dev/docs",
  ]),
  pBreakLines([
    "IONIC",
    "Ionic Framework Documentation",
    "Consulté le 25 mars 2026, disponible sur : https://ionicframework.com/docs",
  ]),
  pBreakLines([
    "CAPACITOR",
    "Capacitor Documentation",
    "Consulté le 25 mars 2026, disponible sur : https://capacitorjs.com/docs",
  ]),
  pBreakLines([
    "POSTGRESQL GLOBAL DEVELOPMENT GROUP",
    "PostgreSQL Documentation",
    "Consulté le 15 mars 2026, disponible sur : https://www.postgresql.org/docs/",
  ]),
  h("Cours"),
  pBreakLines([
    "KOME Moctar",
    "Cours de méthodologie de recherche et de rédaction, INTEC SUP, Bamako, année universitaire 2025-2026.",
    "Consulté dans le cadre de la rédaction du mémoire.",
  ]),
].join("");

{
  const paragraphs = [...xml.matchAll(/<w:p[\s\S]*?<\/w:p>/g)].map((m) => ({
    xml: m[0],
    index: m.index,
  }));
  const glossaire = paragraphs.find((p) => paraText(p.xml) === "Glossaire");
  if (!glossaire) {
    console.log("glossary anchor not found");
  } else {
    const biblioStart = paragraphs
      .filter(
        (p) => p.index < glossaire.index && paraText(p.xml) === "Bibliographie",
      )
      .pop();
    if (!biblioStart) {
      console.log("bibliography start not found");
    } else {
      const replacement =
        '<w:p><w:pPr><w:spacing w:before="240" w:after="120"/><w:jc w:val="left"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>Bibliographie</w:t></w:r></w:p>' +
        biblio;
      xml =
        xml.slice(0, biblioStart.index) +
        replacement +
        xml.slice(glossaire.index);
    }
  }
}

// Nettoyage de formulations restantes.
replaceAll(
  "the management of teachers’ fees",
  "the calculation of teachers’ fees",
);
replaceAll("teachers’ fees management", "teachers’ fees calculation");
replaceAll("• Le renforcement", "• Le renforcement");

fs.writeFileSync(docPath, xml);
console.log("refinement complete");
