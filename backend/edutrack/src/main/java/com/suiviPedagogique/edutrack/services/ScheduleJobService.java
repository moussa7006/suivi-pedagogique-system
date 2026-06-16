package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Entities.Emargement;
import com.suiviPedagogique.edutrack.Entities.EmploiDuTemps;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.Entities.QRCode;
import com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence;
import com.suiviPedagogique.edutrack.Entities.enums.StatutSeance;
import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
import com.suiviPedagogique.edutrack.Entities.enums.JourSemaine;
import com.suiviPedagogique.edutrack.repositories.EmploiDuTempsRepository;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import com.suiviPedagogique.edutrack.repositories.QRCodeRepository;
import com.suiviPedagogique.edutrack.repositories.AnneeUniversitaireRepository;
import com.suiviPedagogique.edutrack.Entities.AnneeUniversitaire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.time.DayOfWeek;

@Service
public class ScheduleJobService {

    @Autowired
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Autowired
    private SeanceRepository seanceRepository;

    @Autowired
    private QRCodeRepository qrCodeRepository;

    @Autowired
    private AnneeUniversitaireRepository anneeUniversitaireRepository;

    /**
     * S'exécute tous les jours à 00:01
     * Génère les séances (Seance) du jour à partir des EmploiDuTemps actifs.
     */
    @Scheduled(cron = "0 1 0 * * ?")
    @Transactional
    public void generateDailySeances() {
        List<EmploiDuTemps> activeSchedules = emploiDuTempsRepository.findAllActive();
        for (EmploiDuTemps emploi : activeSchedules) {
            checkAndGenerateSeanceForToday(emploi);
        }
    }

    /**
     * Rattrapage au démarrage de l'application.
     * Si le backend n'était pas en cours d'exécution à 00:01, les séances du jour
     * n'ont pas été générées. Cette méthode comble ce trou de façon idempotente
     * (existsByEmploiDuTempsIdAndDateCours empêche les doublons).
     */
    @EventListener(ApplicationReadyEvent.class)
    public void runDailyGenerationAtStartup() {
        try {
            System.out.println("[Startup] Rattrapage de la génération des séances du jour...");
            generateDailySeances();
            updateAnneeUniversitaireStatus();
        } catch (Exception e) {
            System.err.println("[Startup] Echec du rattrapage : " + e.getMessage());
        }
    }

    /**
     * Vérifie si un emploi du temps s'applique à aujourd'hui et génère la séance si nécessaire.
     */
    @Transactional
    public void checkAndGenerateSeanceForToday(EmploiDuTemps emploi) {
        LocalDate today = LocalDate.now();
        boolean shouldGenerate = false;

        if (emploi.getTypeRecurrence() == TypeRecurrence.UNIQUE) {
            if (today.equals(emploi.getDateSpecifique())) {
                shouldGenerate = true;
            }
        } else if (emploi.getTypeRecurrence() == TypeRecurrence.HEBDOMADAIRE) {
            if (emploi.getJourSemaine() != null && emploi.getJourSemaine() == mapDayOfWeek(today.getDayOfWeek())) {
                boolean isValidStartDate = (emploi.getDateDebutValidite() == null || !today.isBefore(emploi.getDateDebutValidite()));
                boolean isValidEndDate = (emploi.getDateFinValidite() == null || !today.isAfter(emploi.getDateFinValidite()));
                if (isValidStartDate && isValidEndDate) {
                    shouldGenerate = true;
                }
            }
        } else if (emploi.getTypeRecurrence() == TypeRecurrence.MENSUEL) {
            if (emploi.getJourDuMois() != null && today.getDayOfMonth() == emploi.getJourDuMois()) {
                boolean isValidStartDate = (emploi.getDateDebutValidite() == null || !today.isBefore(emploi.getDateDebutValidite()));
                boolean isValidEndDate = (emploi.getDateFinValidite() == null || !today.isAfter(emploi.getDateFinValidite()));
                if (isValidStartDate && isValidEndDate) {
                    shouldGenerate = true;
                }
            }
        }

        if (shouldGenerate) {
            if (seanceRepository.existsByEmploiDuTempsIdAndDateCours(emploi.getId(), today)) {
                return;
            }

            if (!seanceRepository.findOverlappingSeancesForTeacher(
                    emploi.getEnseignant().getId(),
                    today,
                    emploi.getHeureDebut(),
                    emploi.getHeureFin(),
                    null
            ).isEmpty()) {
                System.out.println("Séance non générée pour " + emploi.getTitre() + " : enseignant déjà occupé sur ce créneau.");
                return;
            }

            Seance seance = new Seance();
            seance.setDateCours(today);
            seance.setHeureDebutReelle(emploi.getHeureDebut());
            seance.setHeureFinReelle(emploi.getHeureFin());
            seance.setStatut(StatutSeance.PREVUE);
            seance.setSalle(emploi.getSalle());
            seance.setEnseignant(emploi.getEnseignant());
            seance.setClasse(emploi.getClasse());
            seance.setEmploiDuTemps(emploi);

            // IMPORTANT: L'émargement et le QR code seront générés plus tard.
            seanceRepository.save(seance);
            System.out.println("Séance générée pour: " + emploi.getTitre());
        }
    }

    private boolean hasActiveQrOverlapForTeacher(Seance seance) {
        return !seanceRepository.findOverlappingSeancesWithActiveQrForTeacher(
                seance.getEnseignant().getId(),
                seance.getDateCours(),
                seance.getHeureDebutReelle(),
                seance.getHeureFinReelle(),
                seance.getId(),
                LocalDateTime.now()
        ).isEmpty();
    }

    private JourSemaine mapDayOfWeek(DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return JourSemaine.LUNDI;
            case TUESDAY: return JourSemaine.MARDI;
            case WEDNESDAY: return JourSemaine.MERCREDI;
            case THURSDAY: return JourSemaine.JEUDI;
            case FRIDAY: return JourSemaine.VENDREDI;
            case SATURDAY: return JourSemaine.SAMEDI;
            case SUNDAY: return JourSemaine.DIMANCHE;
            default: return null;
        }
    }

    /**
     * S'exécute toutes les minutes.
     * Cherche les séances d'aujourd'hui qui commencent dans 15 min ou moins
     * et qui n'ont pas encore de QR code généré.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void generateQRCodeForUpcomingSeances() {
        List<Seance> seancesWithoutToken = seanceRepository.findSeancesForTodayWithoutToken();
        LocalTime now = LocalTime.now();

        for (Seance seance : seancesWithoutToken) {
            if (seance.getHeureDebutReelle() != null) {
                // Si l'heure actuelle est à moins de 15 minutes du début (ou déjà commencée mais pas de QR)
                if (now.isAfter(seance.getHeureDebutReelle().minusMinutes(15))) {
                    if (hasActiveQrOverlapForTeacher(seance)) {
                        System.out.println("QR Code non généré pour la séance " + seance.getId() + " : enseignant déjà associé à un QR actif sur un cours simultané.");
                        continue;
                    }

                    QRCode qrCode = new QRCode();
                    qrCode.setCode(UUID.randomUUID().toString());
                    qrCode.setDateHeureCreation(LocalDateTime.now());
                    qrCode.setDateHeureExpiration(LocalDateTime.of(seance.getDateCours(), seance.getHeureFinReelle()));
                    qrCode.setEstValide(true);

                    qrCodeRepository.save(qrCode);
                    seance.setQrCode(qrCode);
                    seanceRepository.save(seance);
                    System.out.println("QR Code généré pour la séance " + seance.getId());
                }
            }
        }
    }

    /**
     * S'exécute tous les jours à 00:05
     * Met à jour le statut actif des années universitaires en fonction de la date du jour.
     */
    @Scheduled(cron = "0 5 0 * * ?")
    @Transactional
    public void updateAnneeUniversitaireStatus() {
        List<AnneeUniversitaire> annees = anneeUniversitaireRepository.findAll();
        LocalDate today = LocalDate.now();
        for (AnneeUniversitaire annee : annees) {
            boolean shouldBeActive = !today.isBefore(annee.getDateDebut()) && !today.isAfter(annee.getDateFin());
            if (annee.getActive() == null || annee.getActive() != shouldBeActive) {
                annee.setActive(shouldBeActive);
                anneeUniversitaireRepository.save(annee);
                System.out.println("Année universitaire '" + annee.getLibelle() + "' mise à jour: active = " + shouldBeActive);
            }
        }
    }
}
