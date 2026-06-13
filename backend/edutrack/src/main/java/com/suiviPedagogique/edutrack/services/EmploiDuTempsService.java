package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.EmploiDuTempsDto;
import com.suiviPedagogique.edutrack.Entities.*;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmploiDuTempsService {

    @Autowired
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private ClasseRepository classeRepository;

    @Autowired
    private MatiereRepository matiereRepository;

    @Autowired
    private SalleRepository salleRepository;

    @Autowired
    private AnneeUniversitaireRepository anneeUniversitaireRepository;

    @Autowired
    private ScheduleJobService scheduleJobService;

    @Autowired
    private SeanceRepository seanceRepository;

    private Utilisateur getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public EmploiDuTempsDto create(EmploiDuTempsDto dto) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut créer un emploi du temps");
        }

        EmploiDuTemps emploi = new EmploiDuTemps();
        hydrateEntity(emploi, dto, null);

        EmploiDuTemps saved = emploiDuTempsRepository.save(emploi);
        scheduleJobService.checkAndGenerateSeanceForToday(saved);
        return convertToDto(saved);
    }

    public EmploiDuTempsDto update(Integer id, EmploiDuTempsDto dto) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut modifier un emploi du temps");
        }

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emploi du temps non trouvé"));

        hydrateEntity(emploi, dto, id);

        EmploiDuTemps updated = emploiDuTempsRepository.save(emploi);
        scheduleJobService.checkAndGenerateSeanceForToday(updated);
        return convertToDto(updated);
    }

    @Transactional
    public void delete(Integer id) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut supprimer un emploi du temps");
        }

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emploi du temps non trouvé"));
        seanceRepository.deleteAll(seanceRepository.findByEmploiDuTempsId(id));
        emploiDuTempsRepository.delete(emploi);
    }

    public List<EmploiDuTempsDto> getAll() {
        Utilisateur currentUser = getCurrentUser();
        List<EmploiDuTemps> list;
        if (currentUser.getRole() == Role.ADMINISTRATEUR) {
            list = emploiDuTempsRepository.findAll();
        } else if (currentUser.getRole() == Role.ENSEIGNANT) {
            list = emploiDuTempsRepository.findByEnseignantId(currentUser.getId());
        } else {
            throw new AccessDeniedException("Rôle non autorisé");
        }
        return list.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public EmploiDuTempsDto getById(Integer id) {
        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emploi du temps non trouvé"));
        return convertToDto(emploi);
    }

    private void hydrateEntity(EmploiDuTemps emploi, EmploiDuTempsDto dto, Integer emploiId) {
        emploi.setTitre(dto.getTitre());
        emploi.setTypeRecurrence(dto.getTypeRecurrence());
        emploi.setDateDebutValidite(dto.getDateDebutValidite());
        emploi.setDateFinValidite(dto.getDateFinValidite());
        emploi.setJourSemaine(dto.getJourSemaine());
        emploi.setJourDuMois(dto.getJourDuMois());
        emploi.setDateSpecifique(dto.getDateSpecifique());
        emploi.setHeureDebut(dto.getHeureDebut());
        emploi.setHeureFin(dto.getHeureFin());

        if (dto.getSalleId() != null) {
            Salle salle = salleRepository.findById(dto.getSalleId())
                    .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
            checkSalleAvailability(salle, dto, emploiId);
            emploi.setSalle(salle);
        }

        if (dto.getEnseignantId() != null) {
            Enseignant enseignant = enseignantRepository.findById(dto.getEnseignantId())
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
            checkProfAvailability(enseignant, dto, emploiId);
            emploi.setEnseignant(enseignant);
        }
        if (dto.getClasseId() != null) {
            Classe classe = classeRepository.findById(dto.getClasseId())
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
            emploi.setClasse(classe);
        }
        if (dto.getMatiereId() != null) {
            Matiere matiere = matiereRepository.findById(dto.getMatiereId())
                    .orElseThrow(() -> new RuntimeException("Matière non trouvée"));
            emploi.setMatiere(matiere);
        }
        if (dto.getAnneeUniversitaireId() != null) {
            AnneeUniversitaire annee = anneeUniversitaireRepository.findById(dto.getAnneeUniversitaireId())
                    .orElseThrow(() -> new RuntimeException("Année universitaire non trouvée"));
            emploi.setAnneeUniversitaire(annee);
        }
    }

    private EmploiDuTempsDto convertToDto(EmploiDuTemps emploi) {
        EmploiDuTempsDto dto = new EmploiDuTempsDto();
        dto.setId(emploi.getId());
        dto.setTitre(emploi.getTitre());
        dto.setTypeRecurrence(emploi.getTypeRecurrence());
        dto.setDateDebutValidite(emploi.getDateDebutValidite());
        dto.setDateFinValidite(emploi.getDateFinValidite());
        dto.setJourSemaine(emploi.getJourSemaine());
        dto.setJourDuMois(emploi.getJourDuMois());
        dto.setDateSpecifique(emploi.getDateSpecifique());
        dto.setHeureDebut(emploi.getHeureDebut());
        dto.setHeureFin(emploi.getHeureFin());

        if (emploi.getSalle() != null) dto.setSalleId(emploi.getSalle().getId());
        if (emploi.getEnseignant() != null) dto.setEnseignantId(emploi.getEnseignant().getId());
        if (emploi.getClasse() != null) dto.setClasseId(emploi.getClasse().getId());
        if (emploi.getMatiere() != null) dto.setMatiereId(emploi.getMatiere().getId());
        if (emploi.getAnneeUniversitaire() != null) dto.setAnneeUniversitaireId(emploi.getAnneeUniversitaire().getId());

        return dto;
    }

    private com.suiviPedagogique.edutrack.Entities.enums.JourSemaine toJourSemaine(java.time.DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.LUNDI;
            case TUESDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.MARDI;
            case WEDNESDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.MERCREDI;
            case THURSDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.JEUDI;
            case FRIDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.VENDREDI;
            case SATURDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.SAMEDI;
            case SUNDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.DIMANCHE;
            default: return null;
        }
    }

    private void checkProfAvailability(Enseignant enseignant, EmploiDuTempsDto dto, Integer excludeId) {
        validateSchedulePayload(dto);

        List<EmploiDuTemps> emplois = emploiDuTempsRepository.findByEnseignantId(enseignant.getId());
        for (EmploiDuTemps existingSchedule : emplois) {
            if (excludeId != null && existingSchedule.getId().equals(excludeId)) {
                continue;
            }

            if (!timeRangesOverlap(
                    existingSchedule.getHeureDebut(),
                    existingSchedule.getHeureFin(),
                    dto.getHeureDebut(),
                    dto.getHeureFin())) {
                continue;
            }

            LocalDate start = maxDate(getStartDate(existingSchedule), getStartDate(dto));
            LocalDate end = minDate(getEndDate(existingSchedule), getEndDate(dto));
            if (start == null || end == null || start.isAfter(end)) {
                continue;
            }

            LocalDate conflictDate = findFirstConflictDate(existingSchedule, dto, start, end);
            if (conflictDate != null) {
                throw new RuntimeException(buildTeacherConflictMessage(enseignant, existingSchedule, dto, conflictDate));
            }
        }
    }

    private void checkSalleAvailability(Salle salle, EmploiDuTempsDto dto, Integer excludeId) {
        validateSchedulePayload(dto);

        List<EmploiDuTemps> emplois = emploiDuTempsRepository.findBySalleId(salle.getId());
        for (EmploiDuTemps existingSchedule : emplois) {
            if (excludeId != null && existingSchedule.getId().equals(excludeId)) {
                continue;
            }

            if (!timeRangesOverlap(
                    existingSchedule.getHeureDebut(),
                    existingSchedule.getHeureFin(),
                    dto.getHeureDebut(),
                    dto.getHeureFin())) {
                continue;
            }

            LocalDate start = maxDate(getStartDate(existingSchedule), getStartDate(dto));
            LocalDate end = minDate(getEndDate(existingSchedule), getEndDate(dto));
            if (start == null || end == null || start.isAfter(end)) {
                continue;
            }

            LocalDate conflictDate = findFirstConflictDate(existingSchedule, dto, start, end);
            if (conflictDate != null) {
                throw new RuntimeException(buildRoomConflictMessage(salle, existingSchedule, dto, conflictDate));
            }
        }
    }

    private void validateSchedulePayload(EmploiDuTempsDto dto) {
        if (dto.getTypeRecurrence() == null) {
            throw new RuntimeException("Le type de récurrence est obligatoire.");
        }
        if (dto.getHeureDebut() == null || dto.getHeureFin() == null) {
            throw new RuntimeException("Les heures de début et de fin sont obligatoires.");
        }
        if (!dto.getHeureDebut().isBefore(dto.getHeureFin())) {
            throw new RuntimeException("L'heure de début doit être antérieure à l'heure de fin.");
        }
        if (getStartDate(dto) == null || getEndDate(dto) == null) {
            throw new RuntimeException("Les dates de validité de la planification sont obligatoires.");
        }
        if (getStartDate(dto).isAfter(getEndDate(dto))) {
            throw new RuntimeException("La date de début de validité doit être antérieure ou égale à la date de fin.");
        }
        if (dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.HEBDOMADAIRE && dto.getJourSemaine() == null) {
            throw new RuntimeException("Le jour de la semaine est obligatoire pour une planification hebdomadaire.");
        }
        if (dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.MENSUEL
                && (dto.getJourDuMois() == null || dto.getJourDuMois() < 1 || dto.getJourDuMois() > 31)) {
            throw new RuntimeException("Le jour du mois doit être compris entre 1 et 31 pour une planification mensuelle.");
        }
        if (dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE && dto.getDateSpecifique() == null) {
            throw new RuntimeException("La date spécifique est obligatoire pour une planification unique.");
        }
    }

    private LocalDate findFirstConflictDate(EmploiDuTemps existingSchedule, EmploiDuTempsDto newSchedule, LocalDate start, LocalDate end) {
        LocalDate current = start;
        while (!current.isAfter(end)) {
            if (appliesOn(existingSchedule, current) && appliesOn(newSchedule, current)) {
                return current;
            }
            current = current.plusDays(1);
        }
        return null;
    }

    private boolean appliesOn(EmploiDuTemps emploi, LocalDate date) {
        if (date == null || date.isBefore(getStartDate(emploi)) || date.isAfter(getEndDate(emploi))) {
            return false;
        }

        switch (emploi.getTypeRecurrence()) {
            case UNIQUE:
                return date.equals(emploi.getDateSpecifique());
            case HEBDOMADAIRE:
                return emploi.getJourSemaine() != null && emploi.getJourSemaine() == toJourSemaine(date.getDayOfWeek());
            case MENSUEL:
                return emploi.getJourDuMois() != null && emploi.getJourDuMois() == date.getDayOfMonth();
            default:
                return false;
        }
    }

    private boolean appliesOn(EmploiDuTempsDto dto, LocalDate date) {
        if (date == null || date.isBefore(getStartDate(dto)) || date.isAfter(getEndDate(dto))) {
            return false;
        }

        switch (dto.getTypeRecurrence()) {
            case UNIQUE:
                return date.equals(dto.getDateSpecifique());
            case HEBDOMADAIRE:
                return dto.getJourSemaine() != null && dto.getJourSemaine() == toJourSemaine(date.getDayOfWeek());
            case MENSUEL:
                return dto.getJourDuMois() != null && dto.getJourDuMois() == date.getDayOfMonth();
            default:
                return false;
        }
    }

    private boolean timeRangesOverlap(java.time.LocalTime existingStart, java.time.LocalTime existingEnd,
                                      java.time.LocalTime newStart, java.time.LocalTime newEnd) {
        return existingStart != null && existingEnd != null && newStart != null && newEnd != null
                && existingStart.isBefore(newEnd) && existingEnd.isAfter(newStart);
    }

    private LocalDate getStartDate(EmploiDuTemps emploi) {
        if (emploi.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE) {
            return emploi.getDateSpecifique();
        }
        return emploi.getDateDebutValidite();
    }

    private LocalDate getEndDate(EmploiDuTemps emploi) {
        if (emploi.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE) {
            return emploi.getDateSpecifique();
        }
        return emploi.getDateFinValidite();
    }

    private LocalDate getStartDate(EmploiDuTempsDto dto) {
        if (dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE) {
            return dto.getDateSpecifique();
        }
        return dto.getDateDebutValidite();
    }

    private LocalDate getEndDate(EmploiDuTempsDto dto) {
        if (dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE) {
            return dto.getDateSpecifique();
        }
        return dto.getDateFinValidite();
    }

    private LocalDate maxDate(LocalDate first, LocalDate second) {
        if (first == null) return second;
        if (second == null) return first;
        return first.isAfter(second) ? first : second;
    }

    private LocalDate minDate(LocalDate first, LocalDate second) {
        if (first == null) return second;
        if (second == null) return first;
        return first.isBefore(second) ? first : second;
    }

    private String buildTeacherConflictMessage(Enseignant enseignant, EmploiDuTemps existingSchedule,
                                               EmploiDuTempsDto newSchedule, LocalDate conflictDate) {
        String teacherName = (enseignant.getPrenom() + " " + enseignant.getNom()).trim();
        String title = existingSchedule.getTitre() != null && !existingSchedule.getTitre().isBlank()
                ? existingSchedule.getTitre()
                : "un autre cours";
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return "Planification impossible : l'enseignant " + teacherName
                + " est déjà affecté à " + title
                + " le " + conflictDate.format(dateFormatter)
                + " de " + existingSchedule.getHeureDebut()
                + " à " + existingSchedule.getHeureFin()
                + ". Le nouveau créneau " + newSchedule.getHeureDebut()
                + " - " + newSchedule.getHeureFin()
                + " chevauche ce cours.";
    }

    private String buildRoomConflictMessage(Salle salle, EmploiDuTemps existingSchedule,
                                            EmploiDuTempsDto newSchedule, LocalDate conflictDate) {
        String title = existingSchedule.getTitre() != null && !existingSchedule.getTitre().isBlank()
                ? existingSchedule.getTitre()
                : "un autre cours";
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return "Planification impossible : la salle " + salle.getNom()
                + " est déjà occupée par " + title
                + " le " + conflictDate.format(dateFormatter)
                + " de " + existingSchedule.getHeureDebut()
                + " à " + existingSchedule.getHeureFin()
                + ". Le nouveau créneau " + newSchedule.getHeureDebut()
                + " - " + newSchedule.getHeureFin()
                + " chevauche cette planification.";
    }
}
