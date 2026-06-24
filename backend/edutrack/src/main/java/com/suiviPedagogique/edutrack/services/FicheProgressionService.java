package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.FicheProgressionRequest;
import com.suiviPedagogique.edutrack.Dto.FicheProgressionDto;
import com.suiviPedagogique.edutrack.Entities.FicheProgression;
import com.suiviPedagogique.edutrack.Entities.Emargement;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
import com.suiviPedagogique.edutrack.repositories.FicheProgressionRepository;
import com.suiviPedagogique.edutrack.repositories.EmargementRepository;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FicheProgressionService {

    @Autowired
    private FicheProgressionRepository ficheProgressionRepository;

    @Autowired
    private SeanceRepository seanceRepository;

    @Autowired
    private EmargementRepository emargementRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Transactional
    public FicheProgressionDto remplirFicheProgression(Integer seanceId, FicheProgressionRequest request) {
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new RuntimeException("Séance introuvable."));

        if (seance.getFicheProgression() != null) {
            throw new RuntimeException("La fiche de progression a déjà été remplie pour cette séance.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Utilisateur currentUser = utilisateurRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié."));

        if (seance.getEnseignant() == null || !seance.getEnseignant().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas l'enseignant assigné à cette séance.");
        }

        Emargement emargement = seance.getEmargement();
        if (emargement == null) {
            throw new RuntimeException("Vous devez d'abord scanner le QR Code de la séance avant de remplir la fiche de progression.");
        }

        FicheProgression fiche = new FicheProgression();
        fiche.setContenuDetaille(request.getContenuDetaille());
        fiche.setObjectifs(request.getObjectifs());
        fiche.setTravaux(request.getTravaux());
        fiche.setDateSaisie(LocalDate.now());
        fiche.setEstValideAdmin(true);
        fiche.setDateValidation(LocalDate.now());
        fiche.setEnseignant(seance.getEnseignant());
        fiche.setSeance(seance);

        ficheProgressionRepository.save(fiche);

        seance.setFicheProgression(fiche);
        seanceRepository.save(seance);

        emargement.setStatut(StatutEmargement.VALIDE);
        emargementRepository.save(emargement);

        return toDto(fiche);
    }

    public List<FicheProgressionDto> getAllFicheProgressions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Utilisateur currentUser = utilisateurRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié."));

        List<FicheProgression> fiches;
        if (currentUser.getRole() == Role.ADMINISTRATEUR) {
            fiches = ficheProgressionRepository.findAll();
        } else if (currentUser.getRole() == Role.ENSEIGNANT) {
            fiches = ficheProgressionRepository.findByEnseignantId(currentUser.getId());
        } else {
            throw new AccessDeniedException("Rôle non autorisé.");
        }

        return fiches.stream().map(this::toDto).collect(Collectors.toList());
    }

    private FicheProgressionDto toDto(FicheProgression fiche) {
        FicheProgressionDto dto = new FicheProgressionDto();
        dto.setId(fiche.getId());
        dto.setDateSaisie(fiche.getDateSaisie());
        dto.setContenuDetaille(fiche.getContenuDetaille());
        dto.setObjectifs(fiche.getObjectifs());
        dto.setTravaux(fiche.getTravaux());
        dto.setEstValideAdmin(fiche.getEstValideAdmin());
        dto.setDateValidation(fiche.getDateValidation());

        Seance seance = fiche.getSeance();
        if (seance != null) {
            dto.setSeanceId(seance.getId());
            if (seance.getEnseignant() != null) {
                dto.setEnseignantNomPrenom(seance.getEnseignant().getPrenom() + " " + seance.getEnseignant().getNom());
            }
            if (seance.getEmploiDuTemps() != null && seance.getEmploiDuTemps().getMatiere() != null) {
                dto.setMatiereLibelle(seance.getEmploiDuTemps().getMatiere().getLibelle());
            }
            if (seance.getDateCours() != null) {
                dto.setDateSeance(seance.getDateCours().toString());
            }
            if (seance.getHeureDebutReelle() != null && seance.getHeureFinReelle() != null) {
                dto.setHeureSeance(seance.getHeureDebutReelle() + " - " + seance.getHeureFinReelle());
            }
        }
        return dto;
    }

}
