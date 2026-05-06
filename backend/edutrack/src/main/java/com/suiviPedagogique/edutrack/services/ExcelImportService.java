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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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

        Set<String> emailsInFile = new HashSet<>();
        Set<String> matriculesInFile = new HashSet<>();
        Set<String> telephonesInFile = new HashSet<>();
        Set<String> existingEmails = new HashSet<>();
        Set<String> existingMatricules = new HashSet<>();
        Set<String> existingTelephones = new HashSet<>();

        for (Utilisateur utilisateur : utilisateurRepository.findAll()) {
            if (!isBlank(utilisateur.getEmail())) {
                existingEmails.add(normalizeKey(utilisateur.getEmail()));
            }
            if (!isBlank(utilisateur.getMatricule())) {
                existingMatricules.add(normalizeKey(utilisateur.getMatricule()));
            }
            if (!isBlank(utilisateur.getTelephone())) {
                existingTelephones.add(normalizeKey(utilisateur.getTelephone()));
            }
        }

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                int numeroLigne = i + 1;

                if (row == null) {
                    continue;
                }

                String nom = getCellValue(row, 0, formatter);
                String prenom = getCellValue(row, 1, formatter);
                String email = getCellValue(row, 2, formatter);
                String telephone = getCellValue(row, 3, formatter);
                String matricule = getCellValue(row, 4, formatter);

                if (isBlank(nom) && isBlank(prenom) && isBlank(email) && isBlank(telephone) && isBlank(matricule)) {
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

                if (isBlank(nom)) {
                    rowErrors.add("nom obligatoire");
                }
                if (isBlank(prenom)) {
                    rowErrors.add("prénom obligatoire");
                }
                if (isBlank(email)) {
                    rowErrors.add("email obligatoire");
                } else if (!isValidEmail(email)) {
                    rowErrors.add("email invalide");
                } else if (existingEmails.contains(normalizedEmail) || utilisateurRepository.findByEmail(email).isPresent()) {
                    rowErrors.add("email déjà utilisé");
                } else if (!emailsInFile.add(normalizedEmail)) {
                    rowErrors.add("email dupliqué dans le fichier");
                }

                if (existingMatricules.contains(normalizedMatricule)) {
                    rowErrors.add("matricule déjà utilisé");
                } else if (!matriculesInFile.add(normalizedMatricule)) {
                    rowErrors.add("matricule dupliqué dans le fichier");
                }

                if (!isBlank(telephone)) {
                    if (existingTelephones.contains(normalizedTelephone)) {
                        rowErrors.add("téléphone déjà utilisé");
                    } else if (!telephonesInFile.add(normalizedTelephone)) {
                        rowErrors.add("téléphone dupliqué dans le fichier");
                    }
                }

                if (!rowErrors.isEmpty()) {
                    errors.add("Ligne " + numeroLigne + " : " + String.join(", ", rowErrors) + ".");
                    continue;
                }

                Enseignant ens = new Enseignant();
                ens.setNom(nom);
                ens.setPrenom(prenom);
                ens.setEmail(email);
                ens.setTelephone(telephone);
                ens.setMatricule(matricule);
                ens.setRole(Role.ENSEIGNANT);
                ens.setMotDePasse(defaultPasswordHash);
                ens.setForcePasswordChange(true);
                ens.setActif(true);
                
                // Valeurs par défaut pour les nouveaux champs
                ens.setSpecialite("Non spécifié");
                ens.setDateEmbauche(LocalDate.now());
                ens.setGrade("Non spécifié");

                enseignantsToSave.add(ens);
            }
        }

        if (!enseignantsToSave.isEmpty()) {
            enseignantRepository.saveAll(enseignantsToSave);
        }

        return ImportResultDto.success(totalRows, enseignantsToSave.size(), errors);
    }

    private String getCellValue(Row row, int cellIndex, DataFormatter formatter) {
        if (row == null || row.getCell(cellIndex) == null) {
            return "";
        }
        return formatter.formatCellValue(row.getCell(cellIndex)).trim();
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

    @Transactional(rollbackFor = Exception.class)
    public int importSchedules(MultipartFile file) throws Exception {
        List<EmploiDuTemps> schedulesToSave = new ArrayList<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || row.getCell(0) == null) continue;

                final int numeroLigne = i + 1;

                String titre = row.getCell(0).getStringCellValue();
                String typeRecurrenceStr = row.getCell(1).getStringCellValue();
                TypeRecurrence type = TypeRecurrence.valueOf(typeRecurrenceStr.toUpperCase());

                String jourOuDate = row.getCell(2).getStringCellValue();
                String heureDebutStr = row.getCell(3).getStringCellValue();
                String heureFinStr = row.getCell(4).getStringCellValue();
                String nomSalle = row.getCell(5).getStringCellValue();
                String emailEnseignant = row.getCell(6).getStringCellValue();
                String nomMatiere = row.getCell(7).getStringCellValue(); 
                String nomClasse = row.getCell(8).getStringCellValue(); 
                String libelleAnnee = row.getCell(9) != null ? row.getCell(9).getStringCellValue() : null;

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
                edt.setDateDebutValidite(LocalDate.now()); // Par défaut
                edt.setDateFinValidite(annee.getDateFin());

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
