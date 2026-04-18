package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Entities.Emargement;
import com.suiviPedagogique.edutrack.Entities.EmploiDuTemps;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence;
import com.suiviPedagogique.edutrack.repositories.EmploiDuTempsRepository;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class ScheduleJobService {

    @Autowired
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Autowired
    private SeanceRepository seanceRepository;

    /**
     * S'exécute tous les jours à 00:01
     * Génère les séances (Seance) du jour à partir des EmploiDuTemps actifs.
     */
    @Scheduled(cron = "0 1 0 * * ?")
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
                if (today.getDayOfWeek() == emploi.getJourDeSemaine()) {
                    shouldGenerate = true;
                }
            } else if (emploi.getTypeRecurrence() == TypeRecurrence.MENSUEL) {
                if (today.getDayOfMonth() == emploi.getJourDuMois()) {
                    shouldGenerate = true;
                }
            }

            if (shouldGenerate) {
                Seance seance = new Seance();
                seance.setDate(today);
                seance.setHeureDebut(emploi.getHeureDebut());
                seance.setHeureFin(emploi.getHeureFin());
                seance.setSalle(emploi.getSalle());
                seance.setAdministrateur(emploi.getAdministrateur());
                seance.setEnseignant(emploi.getEnseignant());
                seance.setClasse(emploi.getClasse());
                seance.setMatiere(emploi.getMatiere());
                seance.setEmploiDuTemps(emploi);

                // Initialiser l'émargement
                Emargement emargement = new Emargement();
                emargement.setEstLocalisee(false);
                seance.setEmargement(emargement);

                // IMPORTANT: On ne génère pas encore le QR code.
                seance.setTokenQRCode(null);

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
    public void generateQRCodeForUpcomingSeances() {
        List<Seance> seancesWithoutToken = seanceRepository.findSeancesForTodayWithoutToken();
        LocalTime now = LocalTime.now();

        for (Seance seance : seancesWithoutToken) {
            if (seance.getHeureDebut() != null) {
                // Si l'heure actuelle est à moins de 15 minutes du début (ou déjà commencée mais pas de QR)
                if (now.isAfter(seance.getHeureDebut().minusMinutes(15))) {
                    seance.setTokenQRCode(UUID.randomUUID().toString());
                    seanceRepository.save(seance);
                    System.out.println("QR Code généré pour la séance " + seance.getId());
                }
            }
        }
    }
}
