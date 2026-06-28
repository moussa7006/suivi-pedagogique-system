package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.ImportResultDto;
import com.suiviPedagogique.edutrack.Entities.Classe;
import com.suiviPedagogique.edutrack.Entities.EmploiDuTemps;
import com.suiviPedagogique.edutrack.Entities.Enseignant;
import com.suiviPedagogique.edutrack.Entities.Matiere;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.Salle;
import com.suiviPedagogique.edutrack.Entities.AnneeUniversitaire;
import com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence;
import com.suiviPedagogique.edutrack.Entities.enums.JourSemaine;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.ClasseRepository;
import com.suiviPedagogique.edutrack.repositories.EmploiDuTempsRepository;
import com.suiviPedagogique.edutrack.repositories.EnseignantRepository;
import com.suiviPedagogique.edutrack.repositories.MatiereRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import com.suiviPedagogique.edutrack.repositories.SalleRepository;
import com.suiviPedagogique.edutrack.repositories.AnneeUniversitaireRepository;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class ExcelImportService {

    private final EnseignantRepository enseignantRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ClasseRepository classeRepository;
    private final MatiereRepository matiereRepository;
    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final SalleRepository salleRepository;
    private final AnneeUniversitaireRepository anneeUniversitaireRepository;
    private static final String DEFAULT_TEACHER_PASSWORD = "Intec@2026";
    private static final String DEFAULT_ADDRESS = "Non renseignée";
    private static final String DEFAULT_TEACHER_VALUE = "Non spécifié";
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", Pattern.CASE_INSENSITIVE);

    private final PasswordEncoder passwordEncoder;

    public ExcelImportService(EnseignantRepository enseignantRepository,
                              UtilisateurRepository utilisateurRepository,
                              ClasseRepository classeRepository,
                              MatiereRepository matiereRepository,
                              EmploiDuTempsRepository emploiDuTempsRepository,
                              SalleRepository salleRepository,
                              AnneeUniversitaireRepository anneeUniversitaireRepository,
                              PasswordEncoder passwordEncoder) {
        this.enseignantRepository = enseignantRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.classeRepository = classeRepository;
        this.matiereRepository = matiereRepository;
        this.emploiDuTempsRepository = emploiDuTempsRepository;
        this.salleRepository = salleRepository;
        this.anneeUniversitaireRepository = anneeUniversitaireRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(rollbackFor = Exception.class)
    public int importEnseignants(MultipartFile file) throws Exception {
        return importEnseignantsDetailed(file).getImportedCount();
    }

    @Transactional(rollbackFor = Exception.class)
    public ImportResultDto importEnseignantsDetailed(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier Excel est vide ou introuvable.");
        }

        List<Enseignant> enseignantsToSave = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        DataFormatter formatter = new DataFormatter();
        String defaultPasswordHash = passwordEncoder.encode(DEFAULT_TEACHER_PASSWORD);
        int totalRows = 0;
        LocalDate defaultDateEmbauche = LocalDate.now();

        Set<String> emailsInFile = new HashSet<>();
        Set<String> matriculesInFile = new HashSet<>();
        Set<String> telephonesInFile = new HashSet<>();

        // Map pour stocker les enseignants existants par email pour une mise à jour facile
        Map<String, Enseignant> existingEnseignantsByEmail = new HashMap<>();
        for (Enseignant ens : enseignantRepository.findAll()) {
            existingEnseignantsByEmail.put(normalizeKey(ens.getEmail()), ens);
        }

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet.getPhysicalNumberOfRows() <= 1) {
                throw new IllegalArgumentException("Le fichier Excel est vide ou ne contient que les en-têtes.");
            }

            Map<String, Integer> columns = resolveHeaderColumns(sheet.getRow(0), formatter);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                int numeroLigne = i + 1;

                if (row == null) {
                    continue;
                }

                String nom = getCellValue(row, columnIndex(columns, 0, "nom"), formatter);
                String prenom = getCellValue(row, columnIndex(columns, 1, "prenom", "prénom"), formatter);
                String email = getCellValue(row, columnIndex(columns, 2, "email", "mail"), formatter);
                String telephone = getCellValue(row, columnIndex(columns, 3, "telephone", "téléphone", "tel"), formatter);
                String matricule = getCellValue(row, columnIndex(columns, 4, "matricule"), formatter);
                String adresse = getCellValue(row, columnIndex(columns, 5, "adresse"), formatter);
                String specialite = getCellValue(row, columnIndex(columns, 6, "specialite", "spécialité"), formatter);
                String grade = getCellValue(row, columnIndex(columns, 7, "grade"), formatter);
                String dateEmbaucheValue = getCellValue(row, columnIndex(columns, 8, "dateEmbauche", "date embauche", "date d'embauche", "date_Embauche"), formatter);

                if (isBlank(nom) && isBlank(prenom) && isBlank(email) && isBlank(telephone) && isBlank(matricule)
                        && isBlank(adresse) && isBlank(specialite) && isBlank(grade) && isBlank(dateEmbaucheValue)) {
                    continue;
                }

                totalRows++;

                if (isBlank(matricule)) {
                    matricule = buildDefaultMatricule(numeroLigne);
                }

                List<String> rowErrors = new ArrayList<>();
                String normalizedEmail = normalizeKey(email);
                String normalizedMatricule = normalizeKey(matricule);
                String normalizedTelephone = normalizeKey(telephone);

                if (isBlank(nom)) rowErrors.add("nom obligatoire");
                if (isBlank(prenom)) rowErrors.add("prénom obligatoire");
                if (isBlank(email)) {
                    rowErrors.add("email obligatoire");
                } else if (!isValidEmail(email)) {
                    rowErrors.add("email invalide");
                }

                if (!rowErrors.isEmpty()) {
                    errors.add("Ligne " + numeroLigne + " ignorée : " + String.join(", ", rowErrors) + ".");
                    continue;
                }

                LocalDate dateEmbauche = defaultDateEmbauche;
                if (!isBlank(dateEmbaucheValue)) {
                    try {
                        dateEmbauche = parseDate(dateEmbaucheValue);
                    } catch (IllegalArgumentException e) {
                        errors.add("Ligne " + numeroLigne + " : date d'embauche invalide, la date du jour sera utilisée.");
                    }
                }

                // Vérifier si l'enseignant existe déjà (Mise à jour) ou s'il est nouveau
                Enseignant ens = existingEnseignantsByEmail.get(normalizedEmail);

                if (ens != null) {
                    // C'est une mise à jour
                    boolean isUpdated = false;

                    if (!isBlank(telephone) && !telephone.equals(ens.getTelephone())) {
                        ens.setTelephone(telephone);
                        isUpdated = true;
                    }
                    if (!isBlank(matricule) && !matricule.equals(ens.getMatricule()) && ens.getMatricule().startsWith("ENS-")) {
                        // On met à jour le matricule si l'actuel était un matricule généré par défaut
                        ens.setMatricule(matricule);
                        isUpdated = true;
                    }
                    if (!isBlank(adresse) && (isBlank(ens.getAdresse()) || ens.getAdresse().equals(DEFAULT_ADDRESS) || ens.getAdresse().equalsIgnoreCase("Non renseignée") || ens.getAdresse().equalsIgnoreCase("Non renseigné"))) {
                        ens.setAdresse(adresse);
                        isUpdated = true;
                    }
                    if (!isBlank(specialite) && (isBlank(ens.getSpecialite()) || ens.getSpecialite().equals(DEFAULT_TEACHER_VALUE) || ens.getSpecialite().equalsIgnoreCase("Non renseigné") || ens.getSpecialite().equalsIgnoreCase("Non renseignée"))) {
                        ens.setSpecialite(specialite);
                        isUpdated = true;
                    }
                    if (!isBlank(grade) && (isBlank(ens.getGrade()) || ens.getGrade().equals(DEFAULT_TEACHER_VALUE) || ens.getGrade().equalsIgnoreCase("Non renseigné") || ens.getGrade().equalsIgnoreCase("Non renseignée"))) {
                        ens.setGrade(grade);
                        isUpdated = true;
                    }

                    if (isUpdated) {
                        enseignantsToSave.add(ens);
                    }
                } else {
                    // C'est un nouvel enseignant
                    if (!emailsInFile.add(normalizedEmail)) {
                        errors.add("Ligne " + numeroLigne + " : email dupliqué dans le fichier.");
                        continue;
                    }

                    ens = new Enseignant();
                    ens.setNom(nom);
                    ens.setPrenom(prenom);
                    ens.setEmail(email);
                    ens.setTelephone(isBlank(telephone) ? "00000000" : telephone);
                    ens.setMatricule(matricule);
                    ens.setAdresse(isBlank(adresse) ? DEFAULT_ADDRESS : adresse);
                    ens.setRole(Role.ENSEIGNANT);
                    ens.setMotDePasse(defaultPasswordHash);
                    ens.setForcePasswordChange(true);
                    ens.setActif(true);

                    ens.setSpecialite(isBlank(specialite) ? DEFAULT_TEACHER_VALUE : specialite);
                    ens.setDateEmbauche(dateEmbauche);
                    ens.setGrade(isBlank(grade) ? DEFAULT_TEACHER_VALUE : grade);

                    enseignantsToSave.add(ens);
                    existingEnseignantsByEmail.put(normalizedEmail, ens);
                }
            }
        }

        if (!enseignantsToSave.isEmpty()) {
            enseignantRepository.saveAll(enseignantsToSave);
        }

        return ImportResultDto.success(totalRows, enseignantsToSave.size(), errors);
    }

    private String getCellValue(Row row, int cellIndex, DataFormatter formatter) {
        if (row == null || cellIndex < 0 || row.getCell(cellIndex) == null) {
            return "";
        }
        return formatter.formatCellValue(row.getCell(cellIndex)).trim();
    }

    private Map<String, Integer> resolveHeaderColumns(Row headerRow, DataFormatter formatter) {
        Map<String, Integer> columns = new HashMap<>();
        if (headerRow == null) {
            return columns;
        }

        for (int i = 0; i < headerRow.getLastCellNum(); i++) {
            String header = normalizeHeader(getCellValue(headerRow, i, formatter));
            if (!header.isEmpty()) {
                columns.put(header, i);
            }
        }

        return columns;
    }

    private int columnIndex(Map<String, Integer> columns, int fallbackIndex, String... aliases) {
        for (String alias : aliases) {
            Integer index = columns.get(normalizeHeader(alias));
            if (index != null) {
                return index;
            }
        }

        return columns.isEmpty() ? fallbackIndex : -1;
    }

    private String normalizeHeader(String value) {
        if (value == null) {
            return "";
        }

        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]", "");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private boolean isValidEmail(String email) {
        return !isBlank(email) && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    private String normalizeKey(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private String buildDefaultMatricule(int numeroLigne) {
        return "ENS-" + System.currentTimeMillis() + "-" + numeroLigne;
    }

    private LocalDate parseDate(String value) {
        String trimmedValue = value.trim();
        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.ISO_LOCAL_DATE,
                DateTimeFormatter.ofPattern("dd/MM/yyyy")
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(trimmedValue, formatter);
            } catch (Exception ignored) {
                // Essayer le format suivant.
            }
        }

        throw new IllegalArgumentException("Date invalide");
    }

    private String getCellValue(Row row, Map<String, Integer> headerMap, String... possibleHeaders) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        for (String header : possibleHeaders) {
            String searchKey = header.toLowerCase().trim();
            for (Map.Entry<String, Integer> entry : headerMap.entrySet()) {
                if (entry.getKey().contains(searchKey)) {
                    Cell cell = row.getCell(entry.getValue());
                    if (cell != null) {
                        return switch (cell.getCellType()) {
                            case STRING -> cell.getStringCellValue().trim();
                            case NUMERIC -> {
                                if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                                    // If it's a date or time, format it back to expected strings
                                    java.time.LocalDateTime dt = cell.getLocalDateTimeCellValue();
                                    // If it looks like just a time
                                    if (dt.getYear() <= 1900 && dt.getMonthValue() == 1 && dt.getDayOfMonth() <= 1) {
                                        yield dt.toLocalTime().format(timeFormatter);
                                    }
                                    // otherwise assume it's a full date string yyyy-MM-dd
                                    yield dt.toLocalDate().toString();
                                }
                                // If it's a plain number (e.g., "15" for day of month)
                                yield String.valueOf((int) cell.getNumericCellValue());
                            }
                            default -> cell.toString().trim();
                        };
                    }
                }
            }
        }
        return null;
    }

    @Transactional(rollbackFor = Exception.class)
    public int importSchedules(MultipartFile file) throws Exception {
        List<EmploiDuTemps> schedulesToSave = new ArrayList<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet.getPhysicalNumberOfRows() <= 1) {
                throw new RuntimeException("Le fichier Excel est vide ou ne contient que les en-têtes.");
            }

            // --- 1. Lecture dynamique des en-têtes ---
            Row headerRow = sheet.getRow(0);
            Map<String, Integer> headerMap = new java.util.HashMap<>();
            for (Cell cell : headerRow) {
                if (cell != null && cell.getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
                    headerMap.put(cell.getStringCellValue().toLowerCase().trim(), cell.getColumnIndex());
                }
            }

            // --- 2. Lecture des lignes de données ---
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                final int numeroLigne = i + 1;

                // Extraction dynamique par nom de colonne
                String titre = getCellValue(row, headerMap, "titre");
                String typeRecurrenceStr = getCellValue(row, headerMap, "type", "récurrence", "recurrence");
                String jourOuDate = getCellValue(row, headerMap, "jour", "date");
                String heureDebutStr = getCellValue(row, headerMap, "heure de début", "heure debut");
                String heureFinStr = getCellValue(row, headerMap, "heure de fin", "heure fin");
                String dateDebutStr = getCellValue(row, headerMap, "date de début", "date debut");
                String dateFinStr = getCellValue(row, headerMap, "date de fin", "date fin");
                String nomSalle = getCellValue(row, headerMap, "salle");
                String emailEnseignant = getCellValue(row, headerMap, "email", "enseignant");
                String nomMatiere = getCellValue(row, headerMap, "matière", "matiere");
                String nomClasse = getCellValue(row, headerMap, "classe");
                String libelleAnnee = getCellValue(row, headerMap, "année", "annee");

                if (titre == null || typeRecurrenceStr == null || emailEnseignant == null) {
                    // Si la ligne est globalement vide, on la saute, sinon on lève une erreur de données manquantes
                    if (titre == null && typeRecurrenceStr == null && emailEnseignant == null) continue;
                    throw new RuntimeException("Données obligatoires manquantes à la ligne " + numeroLigne + " (Titre, Type ou Email).");
                }

                TypeRecurrence type = TypeRecurrence.valueOf(typeRecurrenceStr.toUpperCase());

                Enseignant ens = enseignantRepository.findByEmail(emailEnseignant)
                        .orElseThrow(() -> new RuntimeException("Enseignant introuvable (Email: " + emailEnseignant + ") à la ligne " + numeroLigne));

                Matiere mat = matiereRepository.findAll().stream()
                        .filter(m -> m.getLibelle().equalsIgnoreCase(nomMatiere))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Matière introuvable (Libellé: " + nomMatiere + ") à la ligne " + numeroLigne));

                Classe cls = classeRepository.findAll().stream()
                        .filter(c -> c.getLibelle().equalsIgnoreCase(nomClasse))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Classe introuvable (Libellé: " + nomClasse + ") à la ligne " + numeroLigne));

                Salle salle = salleRepository.findAll().stream()
                        .filter(s -> s.getNom().equalsIgnoreCase(nomSalle))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Salle introuvable (Nom: " + nomSalle + "). L'importation est bloquée à la ligne " + numeroLigne));

                AnneeUniversitaire annee;
                if (libelleAnnee != null && !libelleAnnee.isEmpty()) {
                    annee = anneeUniversitaireRepository.findAll().stream()
                            .filter(a -> a.getLibelle().equalsIgnoreCase(libelleAnnee))
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("Année Universitaire introuvable (Libellé: " + libelleAnnee + "). L'importation est bloquée à la ligne " + numeroLigne));
                } else {
                    annee = anneeUniversitaireRepository.findAll().stream()
                            .filter(AnneeUniversitaire::getActive)
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("Aucune Année Universitaire active trouvée. L'importation est bloquée à la ligne " + numeroLigne));
                }

                EmploiDuTemps edt = new EmploiDuTemps();
                edt.setTitre(titre);
                edt.setTypeRecurrence(type);
                edt.setHeureDebut(LocalTime.parse(heureDebutStr, timeFormatter));
                edt.setHeureFin(LocalTime.parse(heureFinStr, timeFormatter));
                edt.setSalle(salle);
                edt.setEnseignant(ens);
                edt.setMatiere(mat);
                edt.setClasse(cls);
                edt.setAnneeUniversitaire(annee);

                if (dateDebutStr != null && !dateDebutStr.isEmpty()) {
                    edt.setDateDebutValidite(LocalDate.parse(dateDebutStr, dateFormatter));
                } else {
                    edt.setDateDebutValidite(LocalDate.now()); // Fallback au cas où la case est vide
                }

                if (dateFinStr != null && !dateFinStr.isEmpty()) {
                    edt.setDateFinValidite(LocalDate.parse(dateFinStr, dateFormatter));
                } else {
                    edt.setDateFinValidite(annee.getDateFin()); // Fallback au cas où la case est vide
                }

                if (type == TypeRecurrence.HEBDOMADAIRE) {
                    edt.setJourSemaine(JourSemaine.valueOf(jourOuDate.toUpperCase()));
                } else if (type == TypeRecurrence.MENSUEL) {
                    edt.setJourDuMois(Integer.parseInt(jourOuDate));
                } else if (type == TypeRecurrence.UNIQUE) {
                    edt.setDateSpecifique(LocalDate.parse(jourOuDate, dateFormatter));
                }

                schedulesToSave.add(edt);
            }
        }
        emploiDuTempsRepository.saveAll(schedulesToSave);
        return schedulesToSave.size();
    }
}
