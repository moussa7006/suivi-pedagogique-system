package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.ClasseDto;
import com.suiviPedagogique.edutrack.Entities.Classe;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.Filiere;
import com.suiviPedagogique.edutrack.Entities.NiveauEnseignement;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.ClasseRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import com.suiviPedagogique.edutrack.repositories.FiliereRepository;
import com.suiviPedagogique.edutrack.repositories.NiveauEnseignementRepository;
import com.suiviPedagogique.edutrack.repositories.AnneeUniversitaireRepository;
import com.suiviPedagogique.edutrack.Entities.AnneeUniversitaire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClasseService {

    @Autowired
    private ClasseRepository classeRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private FiliereRepository filiereRepository;

    @Autowired
    private NiveauEnseignementRepository niveauEnseignementRepository;

    @Autowired
    private AnneeUniversitaireRepository anneeUniversitaireRepository;

    private void verifyAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Utilisateur currentUser = utilisateurRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut effectuer cette action");
        }
    }

    public ClasseDto createClasse(ClasseDto dto) {
        verifyAdmin();
        Classe classe = new Classe();
        classe.setLibelle(dto.getLibelle());
        
        if (dto.getFiliereId() != null) {
            Filiere filiere = filiereRepository.findById(dto.getFiliereId())
                    .orElseThrow(() -> new RuntimeException("Filière non trouvée"));
            classe.setFiliere(filiere);
        }
        
        if (dto.getNiveauEnseignementId() != null) {
            NiveauEnseignement niveau = niveauEnseignementRepository.findById(dto.getNiveauEnseignementId())
                    .orElseThrow(() -> new RuntimeException("Niveau d'enseignement non trouvé"));
            classe.setNiveauEnseignement(niveau);
        }

        if (dto.getAnneeUniversitaireId() != null) {
            AnneeUniversitaire anneeUniversitaire = anneeUniversitaireRepository.findById(dto.getAnneeUniversitaireId())
                    .orElseThrow(() -> new RuntimeException("Année universitaire non trouvée"));
            classe.setAnneeUniversitaire(anneeUniversitaire);
        }

        Classe saved = classeRepository.save(classe);
        return convertToDto(saved);
    }

    public List<ClasseDto> getAllClasses() {
        return classeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ClasseDto getClasseById(Integer id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        return convertToDto(classe);
    }

    public ClasseDto updateClasse(Integer id, ClasseDto dto) {
        verifyAdmin();
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        
        if (dto.getLibelle() != null) classe.setLibelle(dto.getLibelle());
        
        if (dto.getFiliereId() != null) {
            Filiere filiere = filiereRepository.findById(dto.getFiliereId())
                    .orElseThrow(() -> new RuntimeException("Filière non trouvée"));
            classe.setFiliere(filiere);
        }
        
        if (dto.getNiveauEnseignementId() != null) {
            NiveauEnseignement niveau = niveauEnseignementRepository.findById(dto.getNiveauEnseignementId())
                    .orElseThrow(() -> new RuntimeException("Niveau d'enseignement non trouvé"));
            classe.setNiveauEnseignement(niveau);
        }

        if (dto.getAnneeUniversitaireId() != null) {
            AnneeUniversitaire anneeUniversitaire = anneeUniversitaireRepository.findById(dto.getAnneeUniversitaireId())
                    .orElseThrow(() -> new RuntimeException("Année universitaire non trouvée"));
            classe.setAnneeUniversitaire(anneeUniversitaire);
        }

        Classe updated = classeRepository.save(classe);
        return convertToDto(updated);
    }

    public void deleteClasse(Integer id) {
        verifyAdmin();
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        classeRepository.delete(classe);
    }

    private ClasseDto convertToDto(Classe classe) {
        ClasseDto dto = new ClasseDto();
        dto.setId(classe.getId());
        dto.setLibelle(classe.getLibelle());
        if (classe.getFiliere() != null) dto.setFiliereId(classe.getFiliere().getId());
        if (classe.getNiveauEnseignement() != null) dto.setNiveauEnseignementId(classe.getNiveauEnseignement().getId());
        if (classe.getAnneeUniversitaire() != null) dto.setAnneeUniversitaireId(classe.getAnneeUniversitaire().getId());
        return dto;
    }
}
