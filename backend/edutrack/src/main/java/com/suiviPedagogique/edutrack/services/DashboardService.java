package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.DashboardDataDto;
import com.suiviPedagogique.edutrack.Entities.Classe;
import com.suiviPedagogique.edutrack.Entities.Emargement;
import com.suiviPedagogique.edutrack.Entities.Enseignant;
import com.suiviPedagogique.edutrack.Entities.Matiere;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
import com.suiviPedagogique.edutrack.repositories.ClasseRepository;
import com.suiviPedagogique.edutrack.repositories.EmargementRepository;
import com.suiviPedagogique.edutrack.repositories.MatiereRepository;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClasseRepository classeRepository;
    private final SeanceRepository seanceRepository;
    private final EmargementRepository emargementRepository;
    private final MatiereRepository matiereRepository;

    public DashboardService(UtilisateurRepository utilisateurRepository,
                            ClasseRepository classeRepository,
                            SeanceRepository seanceRepository,
                            EmargementRepository emargementRepository,
                            MatiereRepository matiereRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.classeRepository = classeRepository;
        this.seanceRepository = seanceRepository;
        this.emargementRepository = emargementRepository;
        this.matiereRepository = matiereRepository;
    }

    public DashboardDataDto getDashboardData() {
        DashboardDataDto dto = new DashboardDataDto();

        List<Seance> allSeances = seanceRepository.findAll();
        List<Matiere> allMatieres = matiereRepository.findAll();

        dto.setTotalTeachers(utilisateurRepository.countByRole(Role.ENSEIGNANT));
        dto.setTotalClasses(classeRepository.count());
        dto.setSessionsToday(seanceRepository.countByDateCours(LocalDate.now()));
        dto.setPendingEmargements(emargementRepository.countByStatut(StatutEmargement.EN_ATTENTE_FICHE));
        dto.setTotalMatieres(allMatieres.size());
        dto.setTotalSeances(allSeances.size());

        // Compter les émargements validés (global)
        long emargementsValides = allSeances.stream()
                .filter(s -> s.getEmargement() != null
                        && s.getEmargement().getStatut() == StatutEmargement.VALIDE)
                .count();
        dto.setEmargementsValides(emargementsValides);
        dto.setTauxValidationGlobal(
                allSeances.isEmpty() ? 0.0 : Math.round(emargementsValides * 10000.0 / allSeances.size()) / 100.0
        );

        // Graphique 1: Émargements par jour (7 derniers jours)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Emargement> recentEmargements = emargementRepository.findByDateHeureScanAfter(sevenDaysAgo);

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
                }
            }
        }
        dto.setSeancesParStatut(seancesParStatut);

        // Tableau 1: Performance par enseignant
        dto.setTopEnseignants(buildTopEnseignants(allSeances));

        // Tableau 2: Volumétrie par matière
        dto.setMatieresVolumetrie(buildMatieresVolumetrie(allSeances, allMatieres));

        // Tableau 3: Taux d'émargement par classe
        dto.setClassesEmargement(buildClassesEmargement(allSeances));

        return dto;
    }

    private List<Map<String, Object>> buildTopEnseignants(List<Seance> seances) {
        Map<Integer, long[]> counts = new HashMap<>(); // [planifiees, validees]
        Map<Integer, Enseignant> byId = new HashMap<>();

        for (Seance s : seances) {
            if (s.getEnseignant() == null) continue;
            Integer id = s.getEnseignant().getId();
            byId.putIfAbsent(id, s.getEnseignant());
            long[] c = counts.computeIfAbsent(id, k -> new long[]{0, 0});
            c[0]++;
            if (s.getEmargement() != null
                    && s.getEmargement().getStatut() == StatutEmargement.VALIDE) {
                c[1]++;
            }
        }

        return counts.entrySet().stream()
                .map(e -> {
                    Enseignant ens = byId.get(e.getKey());
                    long[] c = e.getValue();
                    double taux = c[0] == 0 ? 0.0 : Math.round(c[1] * 10000.0 / c[0]) / 100.0;
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", ens.getId());
                    row.put("nom", (ens.getPrenom() == null ? "" : ens.getPrenom()) + " "
                            + (ens.getNom() == null ? "" : ens.getNom()));
                    row.put("matricule", ens.getMatricule());
                    row.put("specialite", ens.getSpecialite() != null ? ens.getSpecialite() : "N/A");
                    row.put("seancesPlanifiees", c[0]);
                    row.put("emargementsValides", c[1]);
                    row.put("tauxValidation", taux);
                    row.put("statut", taux >= 75 ? "EXCELLENT" : taux >= 50 ? "MOYEN" : "FAIBLE");
                    return row;
                })
                .sorted((a, b) -> Long.compare((long) b.get("seancesPlanifiees"), (long) a.get("seancesPlanifiees")))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildMatieresVolumetrie(List<Seance> seances, List<Matiere> matieres) {
        Map<Integer, long[]> counts = new HashMap<>(); // [planifiees, validees]
        Map<Integer, Matiere> byId = new HashMap<>();

        for (Matiere m : matieres) {
            byId.put(m.getId(), m);
            counts.put(m.getId(), new long[]{0, 0});
        }

        for (Seance s : seances) {
            if (s.getEmploiDuTemps() == null || s.getEmploiDuTemps().getMatiere() == null) continue;
            Integer id = s.getEmploiDuTemps().getMatiere().getId();
            long[] c = counts.computeIfAbsent(id, k -> new long[]{0, 0});
            c[0]++;
            if (s.getEmargement() != null
                    && s.getEmargement().getStatut() == StatutEmargement.VALIDE) {
                c[1]++;
            }
        }

        return counts.entrySet().stream()
                .map(e -> {
                    Matiere m = byId.get(e.getKey());
                    long[] c = e.getValue();
                    double taux = c[0] == 0 ? 0.0 : Math.round(c[1] * 10000.0 / c[0]) / 100.0;
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("code", m != null ? m.getCode() : "N/A");
                    row.put("libelle", m != null ? m.getLibelle() : "N/A");
                    row.put("departement", m != null && m.getDepartement() != null
                            ? m.getDepartement().getLibelle() : "N/A");
                    row.put("volumeHoraireTotal", m != null ? m.getVolumeHoraireTotal() : 0);
                    row.put("seancesPlanifiees", c[0]);
                    row.put("emargementsValides", c[1]);
                    row.put("tauxValidation", taux);
                    return row;
                })
                .sorted((a, b) -> Long.compare((long) b.get("seancesPlanifiees"), (long) a.get("seancesPlanifiees")))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildClassesEmargement(List<Seance> seances) {
        Map<Integer, long[]> counts = new HashMap<>();
        Map<Integer, Classe> byId = new HashMap<>();

        for (Seance s : seances) {
            if (s.getClasse() == null) continue;
            Integer id = s.getClasse().getId();
            byId.putIfAbsent(id, s.getClasse());
            long[] c = counts.computeIfAbsent(id, k -> new long[]{0, 0});
            c[0]++;
            if (s.getEmargement() != null
                    && s.getEmargement().getStatut() == StatutEmargement.VALIDE) {
                c[1]++;
            }
        }

        return counts.entrySet().stream()
                .map(e -> {
                    Classe c = byId.get(e.getKey());
                    long[] v = e.getValue();
                    double taux = v[0] == 0 ? 0.0 : Math.round(v[1] * 10000.0 / v[0]) / 100.0;
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("libelle", c.getLibelle());
                    row.put("filiere", c.getFiliere() != null ? c.getFiliere().getLibelle() : "N/A");
                    row.put("niveau", c.getNiveauEnseignement() != null
                            ? c.getNiveauEnseignement().getLibelle() : "N/A");
                    row.put("seancesPlanifiees", v[0]);
                    row.put("emargementsValides", v[1]);
                    row.put("tauxValidation", taux);
                    row.put("statut", taux >= 75 ? "EXCELLENT" : taux >= 50 ? "MOYEN" : "FAIBLE");
                    return row;
                })
                .sorted((a, b) -> Long.compare((long) b.get("seancesPlanifiees"), (long) a.get("seancesPlanifiees")))
                .collect(Collectors.toList());
    }
}
