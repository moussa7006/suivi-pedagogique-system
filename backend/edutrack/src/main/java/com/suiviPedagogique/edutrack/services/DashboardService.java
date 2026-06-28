package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.DashboardDataDto;
import com.suiviPedagogique.edutrack.Entities.Emargement;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
import com.suiviPedagogique.edutrack.repositories.ClasseRepository;
import com.suiviPedagogique.edutrack.repositories.EmargementRepository;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClasseRepository classeRepository;
    private final SeanceRepository seanceRepository;
    private final EmargementRepository emargementRepository;

    public DashboardService(UtilisateurRepository utilisateurRepository,
                            ClasseRepository classeRepository,
                            SeanceRepository seanceRepository,
                            EmargementRepository emargementRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.classeRepository = classeRepository;
        this.seanceRepository = seanceRepository;
        this.emargementRepository = emargementRepository;
    }

    public DashboardDataDto getDashboardData() {
        DashboardDataDto dto = new DashboardDataDto();
        
        dto.setTotalTeachers(utilisateurRepository.countByRole(Role.ENSEIGNANT));
        dto.setTotalClasses(classeRepository.count());
        dto.setSessionsToday(seanceRepository.countByDateCours(LocalDate.now()));
        dto.setPendingEmargements(emargementRepository.countByStatut(StatutEmargement.EN_ATTENTE_FICHE));

        // Graphique 1: Émargements par jour (7 derniers jours)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Emargement> recentEmargements = emargementRepository.findByDateHeureScanAfter(sevenDaysAgo);
        
        // Initialiser avec 0 pour les 7 derniers jours
        Map<String, Long> emargementsParJour = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        for (int i = 6; i >= 0; i--) {
            emargementsParJour.put(LocalDate.now().minusDays(i).format(formatter), 0L);
        }
        
        for (Emargement e : recentEmargements) {
            if (e.getDateHeureScan() != null) {
                String dateStr = e.getDateHeureScan().toLocalDate().format(formatter);
                if (emargementsParJour.containsKey(dateStr)) {
                    emargementsParJour.put(dateStr, emargementsParJour.get(dateStr) + 1);
                }
            }
        }
        dto.setEmargementsParJour(emargementsParJour);

        // Graphique 2: Statut des séances du jour
        List<Seance> seancesAujourdhui = seanceRepository.findByDateCours(LocalDate.now());
        Map<String, Long> seancesParStatut = new LinkedHashMap<>();
        seancesParStatut.put("Non démarré", 0L);
        seancesParStatut.put("En attente", 0L);
        seancesParStatut.put("Validé", 0L);
        seancesParStatut.put("Rejeté", 0L);
        
        for (Seance s : seancesAujourdhui) {
            if (s.getEmargement() == null) {
                seancesParStatut.put("Non démarré", seancesParStatut.get("Non démarré") + 1);
            } else {
                StatutEmargement statut = s.getEmargement().getStatut();
                if (statut == StatutEmargement.EN_ATTENTE_FICHE) {
                    seancesParStatut.put("En attente", seancesParStatut.get("En attente") + 1);
                } else if (statut == StatutEmargement.VALIDE) {
                    seancesParStatut.put("Validé", seancesParStatut.get("Validé") + 1);
                } /*else if (statut == StatutEmargement.REJETE) {
                    seancesParStatut.put("Rejeté", seancesParStatut.get("Rejeté") + 1);
                } */
            }
        }
        dto.setSeancesParStatut(seancesParStatut);

        return dto;
    }
}
