package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.MatiereDto;
import com.suiviPedagogique.edutrack.Entities.Matiere;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.repositories.MatiereRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatiereService {

    @Autowired
    private MatiereRepository matiereRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    private void verifyAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Utilisateur currentUser = utilisateurRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if (!"ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Seul l'administrateur peut effectuer cette action");
        }
    }

    public MatiereDto createMatiere(MatiereDto dto) {
        verifyAdmin();
        Matiere matiere = new Matiere();
        matiere.setCodeMatiere(dto.getCodeMatiere());
        matiere.setLibelle(dto.getLibelle());
        matiere.setCoefficient(dto.getCoefficient());
        Matiere saved = matiereRepository.save(matiere);
        return convertToDto(saved);
    }

    public List<MatiereDto> getAllMatieres() {
        return matiereRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public MatiereDto getMatiereById(Integer id) {
        Matiere matiere = matiereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matière non trouvée"));
        return convertToDto(matiere);
    }

    public MatiereDto updateMatiere(Integer id, MatiereDto dto) {
        verifyAdmin();
        Matiere matiere = matiereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matière non trouvée"));
        
        if (dto.getCodeMatiere() != null) matiere.setCodeMatiere(dto.getCodeMatiere());
        if (dto.getLibelle() != null) matiere.setLibelle(dto.getLibelle());
        if (dto.getCoefficient() != null) matiere.setCoefficient(dto.getCoefficient());

        Matiere updated = matiereRepository.save(matiere);
        return convertToDto(updated);
    }

    public void deleteMatiere(Integer id) {
        verifyAdmin();
        Matiere matiere = matiereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matière non trouvée"));
        matiereRepository.delete(matiere);
    }

    private MatiereDto convertToDto(Matiere matiere) {
        MatiereDto dto = new MatiereDto();
        dto.setId(matiere.getId());
        dto.setCodeMatiere(matiere.getCodeMatiere());
        dto.setLibelle(matiere.getLibelle());
        dto.setCoefficient(matiere.getCoefficient());
        return dto;
    }
}
