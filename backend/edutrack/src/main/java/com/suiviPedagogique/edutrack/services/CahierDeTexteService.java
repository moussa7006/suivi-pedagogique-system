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
}
