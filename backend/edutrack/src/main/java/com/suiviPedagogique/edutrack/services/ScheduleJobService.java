package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Entities.Emargement;
import com.suiviPedagogique.edutrack.Entities.EmploiDuTemps;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.Entities.QRCode;
import com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence;
import com.suiviPedagogique.edutrack.Entities.enums.StatutSeance;
import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
import com.suiviPedagogique.edutrack.repositories.EmploiDuTempsRepository;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import com.suiviPedagogique.edutrack.repositories.QRCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ScheduleJobService {

    @Autowired
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Autowired
    private SeanceRepository seanceRepository;
    
    @Autowired
    private QRCodeRepository qrCodeRepository;

    /**
     * S'exécute tous les jours à 00:01
     * Génère les séances (Seance) du jour à partir des EmploiDuTemps actifs.
     */
    @Scheduled(cron = "0 1 0 * * ?")
    @Transactional
    public void generateDailySeances() {
        LocalDate today = LocalDate.now();
        List<EmploiDuTemps> activeSchedules = emploiDuTempsRepository.findAllActive();

        for (EmploiDuTemps emploi : activeSchedules) {
            boolean shouldGenerate = false;

            if (emploi.getTypeRecurrence() == TypeRecurrence.UNIQUE) {
                if (today.equals(emploi.getDateSpecifique())) {
                    shouldGenerate = true;
                }
            } else if (emploi.getTypeRecurrence() == TypeRecurrence.HEBDOMADAIRE) {
                if (emploi.getJourSemaine() != null && today.getDayOfWeek().name().equals(emploi.getJourSemaine().name())) {
                    shouldGenerate = true;
                }
            } else if (emploi.getTypeRecurrence() == TypeRecurrence.MENSUEL) {
                if (emploi.getJourDuMois() != null && today.getDayOfMonth() == emploi.getJourDuMois()) {
                    shouldGenerate = true;
                }
            }

            if (shouldGenerate) {
                Seance seance = new Seance();
                seance.setDateCours(today);
                seance.setHeureDebutReelle(emploi.getHeureDebut());
                seance.setHeureFinReelle(emploi.getHeureFin());
                seance.setStatut(StatutSeance.PREVUE);
                seance.setSalle(emploi.getSalle());
                seance.setEnseignant(emploi.getEnseignant());
                seance.setEmploiDuTemps(emploi);

                // Initialiser l'émargement
                Emargement emargement = new Emargement();
                emargement.setStatut(StatutEmargement.HORS_PERIMETRE);
                emargement.setSeance(seance);
                seance.setEmargement(emargement);

                // IMPORTANT: On ne génère pas encore le QR code.
                seanceRepository.save(seance);
                System.out.println("Séance générée pour: " + emploi.getTitre());
            }
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
}
