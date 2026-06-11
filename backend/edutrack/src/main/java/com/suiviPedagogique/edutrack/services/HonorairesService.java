package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.DetailHonoraireDto;
import com.suiviPedagogique.edutrack.Dto.HonorairesCalculDto;
import com.suiviPedagogique.edutrack.Entities.*;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
import com.suiviPedagogique.edutrack.Entities.enums.StatutHonoraire;
import com.suiviPedagogique.edutrack.repositories.DetailHonoraireRepository;
import com.suiviPedagogique.edutrack.repositories.EnseignantRepository;
import com.suiviPedagogique.edutrack.repositories.HonorairesCalculsRepository;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HonorairesService {
    private final HonorairesCalculsRepository honorairesCalculsRepository;
    private final DetailHonoraireRepository detailHonoraireRepository;
    private final SeanceRepository seanceRepository;
    private final EnseignantRepository enseignantRepository;
    private final UtilisateurRepository utilisateurRepository;

    public HonorairesService(
            HonorairesCalculsRepository honorairesCalculsRepository,
            DetailHonoraireRepository detailHonoraireRepository,
            SeanceRepository seanceRepository,
            EnseignantRepository enseignantRepository,
            UtilisateurRepository utilisateurRepository
    ) {
        this.honorairesCalculsRepository = honorairesCalculsRepository;
        this.detailHonoraireRepository = detailHonoraireRepository;
        this.seanceRepository = seanceRepository;
        this.enseignantRepository = enseignantRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public HonorairesCalculDto previewHonoraires(Integer enseignantId, Integer annee, Integer mois) {
        verifyAdmin();
        Enseignant enseignant = getEnseignant(enseignantId);
        LocalDate moisCalcul = normalizeMonth(annee, mois);
        List<Seance> seancesPayables = getSeancesPayables(enseignantId, moisCalcul);

        return buildPreviewDto(enseignant, moisCalcul, seancesPayables);
    }

    @Transactional
    public HonorairesCalculDto calculerHonoraires(Integer enseignantId, Integer annee, Integer mois) {
        verifyAdmin();
        Enseignant enseignant = getEnseignant(enseignantId);
        LocalDate moisCalcul = normalizeMonth(annee, mois);

        honorairesCalculsRepository.findByEnseignantIdAndMois(enseignantId, moisCalcul)
                .ifPresent(existing -> {
                    throw new RuntimeException("Les honoraires de cet enseignant ont déjà été calculés pour ce mois.");
                });

        List<Seance> seancesPayables = getSeancesPayables(enseignantId, moisCalcul);
        if (seancesPayables.isEmpty()) {
            throw new RuntimeException("Aucune séance payable trouvée pour cet enseignant sur ce mois.");
        }

        HonorairesCalculs calcul = new HonorairesCalculs();
        calcul.setMois(moisCalcul);
        calcul.setEnseignant(enseignant);
        calcul.setStatut(StatutHonoraire.BROUILLON);
        calcul.setDateCalcul(LocalDateTime.now());
        calcul.setTotalHeures(0F);
        calcul.setMontantBrut(0F);

        HonorairesCalculs savedCalcul = honorairesCalculsRepository.save(calcul);

        float totalHeures = 0F;
        float montantBrut = 0F;
        List<DetailHonoraire> details = new ArrayList<>();

        for (Seance seance : seancesPayables) {
            DetailHonoraire detail = buildDetail(savedCalcul, seance);
            totalHeures += detail.getNombreHeures();
            montantBrut += detail.getMontant();
            details.add(detail);
        }

        detailHonoraireRepository.saveAll(details);
        savedCalcul.setTotalHeures(totalHeures);
        savedCalcul.setMontantBrut(montantBrut);
        savedCalcul.setDetailsHonoraires(details);

        return toDto(honorairesCalculsRepository.save(savedCalcul), true);
    }

    @Transactional
    public HonorairesCalculDto validerHonoraires(Integer calculId) {
        verifyAdmin();
        HonorairesCalculs calcul = honorairesCalculsRepository.findById(calculId)
                .orElseThrow(() -> new RuntimeException("Calcul d'honoraires introuvable."));

        if (calcul.getStatut() == StatutHonoraire.PAYE) {
            throw new RuntimeException("Impossible de modifier un calcul déjà payé.");
        }

        calcul.setStatut(StatutHonoraire.VALIDE);
        calcul.setDateValidation(LocalDateTime.now());
        return toDto(honorairesCalculsRepository.save(calcul), true);
    }

    @Transactional
    public HonorairesCalculDto marquerCommePaye(Integer calculId) {
        verifyAdmin();
        HonorairesCalculs calcul = honorairesCalculsRepository.findById(calculId)
                .orElseThrow(() -> new RuntimeException("Calcul d'honoraires introuvable."));

        if (calcul.getStatut() != StatutHonoraire.VALIDE) {
            throw new RuntimeException("Seuls les honoraires validés peuvent être marqués comme payés.");
        }

        calcul.setStatut(StatutHonoraire.PAYE);
        return toDto(honorairesCalculsRepository.save(calcul), true);
    }

    public HonorairesCalculDto getHonorairesById(Integer id) {
        HonorairesCalculs calcul = honorairesCalculsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Calcul d'honoraires introuvable."));
        verifyCanRead(calcul.getEnseignant().getId());
        return toDto(calcul, true);
    }

    public List<HonorairesCalculDto> getHonorairesParMois(Integer annee, Integer mois) {
        verifyAdmin();
        LocalDate moisCalcul = normalizeMonth(annee, mois);
        return honorairesCalculsRepository.findByMois(moisCalcul).stream()
                .map(calcul -> toDto(calcul, false))
                .collect(Collectors.toList());
    }

    public List<HonorairesCalculDto> getHonorairesEnseignant(Integer enseignantId) {
        verifyCanRead(enseignantId);
        return honorairesCalculsRepository.findByEnseignantIdOrderByMoisDesc(enseignantId).stream()
                .map(calcul -> toDto(calcul, false))
                .collect(Collectors.toList());
    }

    public List<HonorairesCalculDto> getMesHonoraires() {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ENSEIGNANT) {
            throw new AccessDeniedException("Seuls les enseignants peuvent consulter leurs propres honoraires via cet endpoint.");
        }
        return getHonorairesEnseignant(currentUser.getId());
    }

    private HonorairesCalculDto buildPreviewDto(Enseignant enseignant, LocalDate moisCalcul, List<Seance> seancesPayables) {
        List<DetailHonoraireDto> details = seancesPayables.stream()
                .map(seance -> toDetailDto(null, seance, calculateNombreHeures(seance), getTauxHoraire(seance), null))
                .collect(Collectors.toList());

        float totalHeures = 0F;
        float montantBrut = 0F;
        for (DetailHonoraireDto detail : details) {
            totalHeures += detail.getNombreHeures();
            montantBrut += detail.getMontant();
        }

        HonorairesCalculDto dto = new HonorairesCalculDto();
        dto.setMois(moisCalcul);
        dto.setEnseignantId(enseignant.getId());
        dto.setEnseignantNomPrenom(formatEnseignant(enseignant));
        dto.setTotalHeures(totalHeures);
        dto.setMontantBrut(montantBrut);
        dto.setStatut(StatutHonoraire.BROUILLON);
        dto.setDetailsHonoraires(details);
        return dto;
    }

    private DetailHonoraire buildDetail(HonorairesCalculs calcul, Seance seance) {
        float nombreHeures = calculateNombreHeures(seance);
        float tauxHoraire = getTauxHoraire(seance);
        float montant = nombreHeures * tauxHoraire;

        DetailHonoraire detail = new DetailHonoraire();
        detail.setHonorairesCalculs(calcul);
        detail.setSeance(seance);
        detail.setNombreHeures(nombreHeures);
        detail.setTauxHoraire(tauxHoraire);
        detail.setMontant(montant);
        return detail;
    }

    private List<Seance> getSeancesPayables(Integer enseignantId, LocalDate moisCalcul) {
        LocalDate startDate = moisCalcul.withDayOfMonth(1);
        LocalDate endDate = moisCalcul.withDayOfMonth(moisCalcul.lengthOfMonth());

        return seanceRepository.findByEnseignantIdAndDateCoursBetween(enseignantId, startDate, endDate).stream()
                .filter(this::isSeancePayable)
                .filter(seance -> !detailHonoraireRepository.existsBySeanceId(seance.getId()))
                .collect(Collectors.toList());
    }

    private boolean isSeancePayable(Seance seance) {
        Emargement emargement = seance.getEmargement();
        FicheProgression fiche = seance.getFicheProgression();

        return emargement != null
                && emargement.getStatut() == StatutEmargement.VALIDE
                && fiche != null
                && Boolean.TRUE.equals(fiche.getEstValideAdmin())
                && seance.getHeureDebutReelle() != null
                && seance.getHeureFinReelle() != null
                && seance.getClasse() != null
                && seance.getClasse().getNiveauEnseignement() != null
                && seance.getClasse().getNiveauEnseignement().getPrixHoraire() != null;
    }

    private float calculateNombreHeures(Seance seance) {
        long minutes = Duration.between(seance.getHeureDebutReelle(), seance.getHeureFinReelle()).toMinutes();
        if (minutes <= 0) {
            throw new RuntimeException("Durée de séance invalide pour la séance " + seance.getId());
        }
        return minutes / 60F;
    }

    private float getTauxHoraire(Seance seance) {
        return seance.getClasse().getNiveauEnseignement().getPrixHoraire();
    }

    private HonorairesCalculDto toDto(HonorairesCalculs calcul, boolean includeDetails) {
        HonorairesCalculDto dto = new HonorairesCalculDto();
        dto.setId(calcul.getId());
        dto.setMois(calcul.getMois());
        dto.setTotalHeures(calcul.getTotalHeures());
        dto.setMontantBrut(calcul.getMontantBrut());
        dto.setStatut(calcul.getStatut());
        dto.setDateCalcul(calcul.getDateCalcul());
        dto.setDateValidation(calcul.getDateValidation());

        if (calcul.getEnseignant() != null) {
            dto.setEnseignantId(calcul.getEnseignant().getId());
            dto.setEnseignantNomPrenom(formatEnseignant(calcul.getEnseignant()));
        }

        if (includeDetails) {
            List<DetailHonoraire> details = detailHonoraireRepository.findByHonorairesCalculsId(calcul.getId());
            dto.setDetailsHonoraires(details.stream()
                    .map(this::toDetailDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private DetailHonoraireDto toDetailDto(DetailHonoraire detail) {
        return toDetailDto(
                detail.getId(),
                detail.getSeance(),
                detail.getNombreHeures(),
                detail.getTauxHoraire(),
                detail.getMontant()
        );
    }

    private DetailHonoraireDto toDetailDto(Integer detailId, Seance seance, Float nombreHeures, Float tauxHoraire, Float montant) {
        DetailHonoraireDto dto = new DetailHonoraireDto();
        dto.setId(detailId);
        dto.setNombreHeures(nombreHeures);
        dto.setTauxHoraire(tauxHoraire);
        dto.setMontant(montant != null ? montant : nombreHeures * tauxHoraire);

        if (seance != null) {
            dto.setSeanceId(seance.getId());
            dto.setDateCours(seance.getDateCours());
            dto.setHeureDebut(seance.getHeureDebutReelle());
            dto.setHeureFin(seance.getHeureFinReelle());

            if (seance.getEnseignant() != null) {
                dto.setEnseignantNomPrenom(formatEnseignant(seance.getEnseignant()));
            }
            if (seance.getClasse() != null) {
                dto.setClasseLibelle(seance.getClasse().getLibelle());
                if (seance.getClasse().getNiveauEnseignement() != null) {
                    dto.setNiveauLibelle(seance.getClasse().getNiveauEnseignement().getLibelle());
                }
            }
            if (seance.getEmploiDuTemps() != null && seance.getEmploiDuTemps().getMatiere() != null) {
                dto.setMatiereLibelle(seance.getEmploiDuTemps().getMatiere().getLibelle());
            }
        }

        return dto;
    }

    private LocalDate normalizeMonth(Integer annee, Integer mois) {
        if (annee == null || mois == null) {
            throw new RuntimeException("L'année et le mois sont obligatoires.");
        }
        if (mois < 1 || mois > 12) {
            throw new RuntimeException("Le mois doit être compris entre 1 et 12.");
        }
        return LocalDate.of(annee, mois, 1);
    }

    private Enseignant getEnseignant(Integer enseignantId) {
        if (enseignantId == null) {
            throw new RuntimeException("L'enseignant est obligatoire.");
        }
        return enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable."));
    }

    private String formatEnseignant(Enseignant enseignant) {
        return ((enseignant.getPrenom() != null ? enseignant.getPrenom() : "") + " " +
                (enseignant.getNom() != null ? enseignant.getNom() : "")).trim();
    }

    private void verifyAdmin() {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut effectuer cette action.");
        }
    }

    private void verifyCanRead(Integer enseignantId) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() == Role.ADMINISTRATEUR) {
            return;
        }
        if (currentUser.getRole() == Role.ENSEIGNANT && currentUser.getId().equals(enseignantId)) {
            return;
        }
        throw new AccessDeniedException("Vous n'avez pas les droits nécessaires pour consulter ces honoraires.");
    }

    private Utilisateur getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur courant introuvable."));
    }
}
