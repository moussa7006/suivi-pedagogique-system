package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.MatiereDto;
import com.suiviPedagogique.edutrack.Entities.Matiere;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.Departement;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.MatiereRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import com.suiviPedagogique.edutrack.repositories.DepartementRepository;
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

    @Autowired
    private DepartementRepository departementRepository;

    private void verifyAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Utilisateur currentUser = utilisateurRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut effectuer cette action");
        }
    }

    public MatiereDto createMatiere(MatiereDto dto) {
        verifyAdmin();
        Matiere matiere = new Matiere();
        matiere.setCode(dto.getCode());
        matiere.setLibelle(dto.getLibelle());
        matiere.setVolumeHoraireTotal(dto.getVolumeHoraireTotal() != null ? dto.getVolumeHoraireTotal() : 0);
        
        if (dto.getDepartementId() != null) {
            Departement departement = departementRepository.findById(dto.getDepartementId())
                    .orElseThrow(() -> new RuntimeException("Département non trouvé"));
            matiere.setDepartement(departement);
        }

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
        
        if (dto.getCode() != null) matiere.setCode(dto.getCode());
        if (dto.getLibelle() != null) matiere.setLibelle(dto.getLibelle());
        if (dto.getVolumeHoraireTotal() != null) matiere.setVolumeHoraireTotal(dto.getVolumeHoraireTotal());
        
        if (dto.getDepartementId() != null) {
            Departement departement = departementRepository.findById(dto.getDepartementId())
                    .orElseThrow(() -> new RuntimeException("Département non trouvé"));
            matiere.setDepartement(departement);
        }

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
        dto.setCode(matiere.getCode());
        dto.setLibelle(matiere.getLibelle());
        dto.setVolumeHoraireTotal(matiere.getVolumeHoraireTotal());
        if (matiere.getDepartement() != null) dto.setDepartementId(matiere.getDepartement().getId());
        return dto;
    }
}
