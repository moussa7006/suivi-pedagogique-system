package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Entities.Classe;
import com.suiviPedagogique.edutrack.Entities.EmploiDuTemps;
import com.suiviPedagogique.edutrack.Entities.Enseignant;
import com.suiviPedagogique.edutrack.Entities.Matiere;
import com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence;
import com.suiviPedagogique.edutrack.repositories.ClasseRepository;
import com.suiviPedagogique.edutrack.repositories.EmploiDuTempsRepository;
import com.suiviPedagogique.edutrack.repositories.EnseignantRepository;
import com.suiviPedagogique.edutrack.repositories.MatiereRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelImportService {

    private final EnseignantRepository enseignantRepository;
    private final ClasseRepository classeRepository;
    private final MatiereRepository matiereRepository;
    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final PasswordEncoder passwordEncoder;

    public ExcelImportService(EnseignantRepository enseignantRepository,
                              ClasseRepository classeRepository,
                              MatiereRepository matiereRepository,
                              EmploiDuTempsRepository emploiDuTempsRepository,
                              PasswordEncoder passwordEncoder) {
        this.enseignantRepository = enseignantRepository;
        this.classeRepository = classeRepository;
        this.matiereRepository = matiereRepository;
        this.emploiDuTempsRepository = emploiDuTempsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(rollbackFor = Exception.class)
    public int importEnseignants(MultipartFile file) throws Exception {
        List<Enseignant> enseignantsToSave = new ArrayList<>();
        String defaultPasswordHash = passwordEncoder.encode("Intec@2026");

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || row.getCell(0) == null) continue;

                String nom = row.getCell(0).getStringCellValue();
                String prenom = row.getCell(1).getStringCellValue();
                String email = row.getCell(2).getStringCellValue();
                String telephone = row.getCell(3) != null ? row.getCell(3).getStringCellValue() : "";
                String matricule = row.getCell(4) != null ? row.getCell(4).getStringCellValue() : "ENS-" + System.currentTimeMillis() + i;

                if (enseignantRepository.findByEmail(email).isPresent()) {
                    throw new RuntimeException("L'email " + email + " existe déjà.");
                }

                Enseignant ens = new Enseignant();
                ens.setNom(nom);
                ens.setPrenom(prenom);
                ens.setEmail(email);
                ens.setTelephone(telephone);
                ens.setMatricule(matricule);
                ens.setRole("ENSEIGNANT");
                ens.setMotDePasse(defaultPasswordHash);
                ens.setForcePasswordChange(true);

                enseignantsToSave.add(ens);
            }
        }
        enseignantRepository.saveAll(enseignantsToSave);
        return enseignantsToSave.size();
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

                String titre = row.getCell(0).getStringCellValue();
                String typeRecurrenceStr = row.getCell(1).getStringCellValue();
                TypeRecurrence type = TypeRecurrence.valueOf(typeRecurrenceStr.toUpperCase());
                
                String jourOuDate = row.getCell(2).getStringCellValue();
                String heureDebutStr = row.getCell(3).getStringCellValue();
                String heureFinStr = row.getCell(4).getStringCellValue();
                String salle = row.getCell(5).getStringCellValue();
                String emailEnseignant = row.getCell(6).getStringCellValue();
                String nomMatiere = row.getCell(7).getStringCellValue(); // Assuming libelle
                String nomClasse = row.getCell(8).getStringCellValue(); // Assuming filiere

                Enseignant ens = enseignantRepository.findByEmail(emailEnseignant)
                        .orElseThrow(() -> new RuntimeException("Enseignant introuvable (Email: " + emailEnseignant + ") à la ligne " + (i + 1)));

                Matiere mat = matiereRepository.findAll().stream()
                        .filter(m -> m.getLibelle().equalsIgnoreCase(nomMatiere))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Matière introuvable (Libellé: " + nomMatiere + ") à la ligne " + (i + 1)));

                Classe cls = classeRepository.findAll().stream()
                        .filter(c -> c.getFiliere().equalsIgnoreCase(nomClasse))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Classe introuvable (Filière: " + nomClasse + ") à la ligne " + (i + 1)));

                EmploiDuTemps edt = new EmploiDuTemps();
                edt.setTitre(titre);
                edt.setTypeRecurrence(type);
                edt.setHeureDebut(LocalTime.parse(heureDebutStr, timeFormatter));
                edt.setHeureFin(LocalTime.parse(heureFinStr, timeFormatter));
                edt.setSalle(salle);
                edt.setEnseignant(ens);
                edt.setMatiere(mat);
                edt.setClasse(cls);

                if (type == TypeRecurrence.HEBDOMADAIRE) {
                    edt.setJourDeSemaine(DayOfWeek.valueOf(jourOuDate.toUpperCase()));
                    // Set default dates if needed, or leave null for permanent
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
