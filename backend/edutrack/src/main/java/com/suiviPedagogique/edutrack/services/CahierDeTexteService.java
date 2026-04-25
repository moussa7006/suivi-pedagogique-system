package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.CahierDeTexteRequest;
import com.suiviPedagogique.edutrack.Entities.CahierDeTexte;
import com.suiviPedagogique.edutrack.Entities.Emargement;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.repositories.CahierDeTexteRepository;
import com.suiviPedagogique.edutrack.repositories.EmargementRepository;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class CahierDeTexteService {

    @Autowired
    private CahierDeTexteRepository cahierDeTexteRepository;

    @Autowired
    private SeanceRepository seanceRepository;

    @Autowired
    private EmargementRepository emargementRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Transactional
    public String remplirCahierDeTexte(Integer seanceId, CahierDeTexteRequest request) {
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new RuntimeException("Séance introuvable."));

        if (seance.getCahierDeTexte() != null) {
            throw new RuntimeException("Le cahier de texte a déjà été rempli pour cette séance.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Utilisateur currentUser = utilisateurRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié."));

        if (seance.getEnseignant() == null || !seance.getEnseignant().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas l'enseignant assigné à cette séance.");
        }

        CahierDeTexte cahier = new CahierDeTexte();
        cahier.setTitreCours(request.getTitreCours());
        cahier.setContenu(request.getContenu());
        cahier.setPieceJointe(request.getPieceJointe());
        cahier.setDateCreation(LocalDateTime.now());

        cahierDeTexteRepository.save(cahier);

        seance.setCahierDeTexte(cahier);
        seanceRepository.save(seance);

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        boolean estDansLesTemps = true;
        if (!seance.getDate().equals(today)) {
            estDansLesTemps = false;
        } else if (now.isAfter(seance.getHeureFin())) {
            estDansLesTemps = false;
        }

        Emargement emargement = seance.getEmargement();
        if (emargement != null) {
            if (estDansLesTemps) {
                emargement.setEstConfirme(true);
                emargementRepository.save(emargement);
                return "Cahier de texte enregistré et émargement confirmé avec succès.";
            } else {
                return "Cahier de texte enregistré. L'émargement reste non confirmé car le délai est dépassé.";
            }
        }

        return "Cahier de texte enregistré. (Aucun émargement trouvé à confirmer).";
    }

    public java.util.List<com.suiviPedagogique.edutrack.Dto.CahierDeTexteDto> getAllCahierDeTextes() {
        return cahierDeTexteRepository.findAll().stream().map(c -> {
            com.suiviPedagogique.edutrack.Dto.CahierDeTexteDto dto = new com.suiviPedagogique.edutrack.Dto.CahierDeTexteDto();
            dto.setId(c.getId());
            dto.setTitreCours(c.getTitreCours());
            dto.setContenu(c.getContenu());
            dto.setDateCreation(c.getDateCreation());
            dto.setPieceJointe(c.getPieceJointe());
            dto.setStatutValidite(c.getStatutValidite());
            
            Seance seance = c.getSeance();
            if (seance != null) {
                dto.setSeanceId(seance.getId());
                if (seance.getEnseignant() != null) {
                    dto.setEnseignantNomPrenom(seance.getEnseignant().getPrenom() + " " + seance.getEnseignant().getNom());
                }
                if (seance.getMatiere() != null) {
                    dto.setMatiereLibelle(seance.getMatiere().getLibelle());
                }
                if (seance.getDate() != null) {
                    dto.setDateSeance(seance.getDate().toString());
                }
                if (seance.getHeureDebut() != null && seance.getHeureFin() != null) {
                    dto.setHeureSeance(seance.getHeureDebut() + " - " + seance.getHeureFin());
                }
            }
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public com.suiviPedagogique.edutrack.Dto.CahierDeTexteDto validerCahierDeTexte(Integer id, String statut) {
        CahierDeTexte c = cahierDeTexteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cahier de texte introuvable."));
        c.setStatutValidite(statut);
        cahierDeTexteRepository.save(c);
        
        // Return updated DTO
        com.suiviPedagogique.edutrack.Dto.CahierDeTexteDto dto = new com.suiviPedagogique.edutrack.Dto.CahierDeTexteDto();
        dto.setId(c.getId());
        dto.setTitreCours(c.getTitreCours());
        dto.setContenu(c.getContenu());
        dto.setDateCreation(c.getDateCreation());
        dto.setPieceJointe(c.getPieceJointe());
        dto.setStatutValidite(c.getStatutValidite());
        return dto;
    }
}
