package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.SeanceDto;
import com.suiviPedagogique.edutrack.Entities.*;
import com.suiviPedagogique.edutrack.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeanceService {

    @Autowired
    private SeanceRepository seanceRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private AdministrateurRepository administrateurRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private ClasseRepository classeRepository;

    @Autowired
    private MatiereRepository matiereRepository;

    @Autowired
    private EmargementRepository emargementRepository;

    @Autowired
    private CahierDeTexteRepository cahierDeTexteRepository;

    private Utilisateur getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public SeanceDto createSeance(SeanceDto dto) {
        Utilisateur currentUser = getCurrentUser();
        if (!"ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Seul l'administrateur peut créer des séances");
        }

        Seance seance = new Seance();
        seance.setDate(dto.getDate());
        seance.setHeureDebut(dto.getHeureDebut());
        seance.setHeureFin(dto.getHeureFin());
        seance.setSalle(dto.getSalle());
        seance.setTokenQRCode(java.util.UUID.randomUUID().toString());

        // Set administrateur to current admin
        Administrateur admin = administrateurRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));
        seance.setAdministrateur(admin);

        // Set enseignant
        if (dto.getEnseignantId() != null) {
            Enseignant enseignant = enseignantRepository.findById(dto.getEnseignantId())
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
            seance.setEnseignant(enseignant);
        }

        // Set classe
        if (dto.getClasseId() != null) {
            Classe classe = classeRepository.findById(dto.getClasseId())
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
            seance.setClasse(classe);
        }

        // Set matiere
        if (dto.getMatiereId() != null) {
            Matiere matiere = matiereRepository.findById(dto.getMatiereId())
                    .orElseThrow(() -> new RuntimeException("Matière non trouvée"));
            seance.setMatiere(matiere);
        }

        // Initialize empty Emargement
        Emargement emargement = new Emargement();
        emargement.setEstLocalisee(false);
        seance.setEmargement(emargement);

        // Set cahierDeTexte
        if (dto.getCahierDeTexteId() != null) {
            CahierDeTexte cahierDeTexte = cahierDeTexteRepository.findById(dto.getCahierDeTexteId())
                    .orElseThrow(() -> new RuntimeException("Cahier de texte non trouvé"));
            seance.setCahierDeTexte(cahierDeTexte);
        }

        Seance saved = seanceRepository.save(seance);
        return convertToDto(saved);
    }

    public SeanceDto updateSeance(Integer id, SeanceDto dto) {
        Utilisateur currentUser = getCurrentUser();
        if (!"ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Seul l'administrateur peut modifier des séances");
        }

        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));

        seance.setDate(dto.getDate());
        seance.setHeureDebut(dto.getHeureDebut());
        seance.setHeureFin(dto.getHeureFin());
        seance.setSalle(dto.getSalle());
        seance.setTokenQRCode(dto.getTokenQRCode());

        // Update enseignant if provided
        if (dto.getEnseignantId() != null) {
            Enseignant enseignant = enseignantRepository.findById(dto.getEnseignantId())
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
            seance.setEnseignant(enseignant);
        }

        // Update classe if provided
        if (dto.getClasseId() != null) {
            Classe classe = classeRepository.findById(dto.getClasseId())
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
            seance.setClasse(classe);
        }

        // Update matiere if provided
        if (dto.getMatiereId() != null) {
            Matiere matiere = matiereRepository.findById(dto.getMatiereId())
                    .orElseThrow(() -> new RuntimeException("Matière non trouvée"));
            seance.setMatiere(matiere);
        }

        // Update emargement if provided
        if (dto.getEmargementId() != null) {
            Emargement emargement = emargementRepository.findById(dto.getEmargementId())
                    .orElseThrow(() -> new RuntimeException("Emargement non trouvé"));
            seance.setEmargement(emargement);
        }

        // Update cahierDeTexte if provided
        if (dto.getCahierDeTexteId() != null) {
            CahierDeTexte cahierDeTexte = cahierDeTexteRepository.findById(dto.getCahierDeTexteId())
                    .orElseThrow(() -> new RuntimeException("Cahier de texte non trouvé"));
            seance.setCahierDeTexte(cahierDeTexte);
        }

        Seance updated = seanceRepository.save(seance);
        return convertToDto(updated);
    }

    public void deleteSeance(Integer id) {
        Utilisateur currentUser = getCurrentUser();
        if (!"ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Seul l'administrateur peut supprimer des séances");
        }

        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));
        seanceRepository.delete(seance);
    }

    public List<SeanceDto> getAllSeances() {
        Utilisateur currentUser = getCurrentUser();
        List<Seance> seances;
        if ("ADMIN".equals(currentUser.getRole())) {
            seances = seanceRepository.findAll();
        } else if ("ENSEIGNANT".equals(currentUser.getRole())) {
            seances = seanceRepository.findByEnseignantId(currentUser.getId());
        } else {
            throw new AccessDeniedException("Rôle non autorisé");
        }
        return seances.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public SeanceDto getSeanceById(Integer id) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));

        Utilisateur currentUser = getCurrentUser();
        if ("ENSEIGNANT".equals(currentUser.getRole()) && !seance.getEnseignant().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Vous ne pouvez voir que vos propres séances");
        }

        return convertToDto(seance);
    }

    private SeanceDto convertToDto(Seance seance) {
        SeanceDto dto = new SeanceDto();
        dto.setId(seance.getId());
        dto.setDate(seance.getDate());
        dto.setHeureDebut(seance.getHeureDebut());
        dto.setHeureFin(seance.getHeureFin());
        dto.setSalle(seance.getSalle());
        dto.setTokenQRCode(seance.getTokenQRCode());
        if (seance.getAdministrateur() != null) {
            dto.setAdministrateurId(seance.getAdministrateur().getId());
        }
        if (seance.getEnseignant() != null) {
            dto.setEnseignantId(seance.getEnseignant().getId());
        }
        if (seance.getClasse() != null) {
            dto.setClasseId(seance.getClasse().getId());
        }
        if (seance.getMatiere() != null) {
            dto.setMatiereId(seance.getMatiere().getId());
        }
        if (seance.getEmargement() != null) {
            dto.setEmargementId(seance.getEmargement().getId());
        }
        if (seance.getCahierDeTexte() != null) {
            dto.setCahierDeTexteId(seance.getCahierDeTexte().getId());
        }
        return dto;
    }
}
