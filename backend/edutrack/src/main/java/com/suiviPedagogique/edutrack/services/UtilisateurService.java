package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.UtilisateurDto;
import com.suiviPedagogique.edutrack.Entities.Enseignant;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    private void verifyAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Utilisateur currentUser = utilisateurRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur actuel non trouvé"));
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut effectuer cette action");
        }
    }

    public List<UtilisateurDto> getAllUtilisateurs() {
        verifyAdmin();
        return utilisateurRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UtilisateurDto getUtilisateurById(Integer id) {
        verifyAdmin();
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return convertToDto(u);
    }

    public UtilisateurDto updateUtilisateur(Integer id, UtilisateurDto dto) {
        verifyAdmin();
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if(dto.getNom() != null) u.setNom(dto.getNom());
        if(dto.getPrenom() != null) u.setPrenom(dto.getPrenom());
        if(dto.getEmail() != null) u.setEmail(dto.getEmail());
        if(dto.getTelephone() != null) u.setTelephone(dto.getTelephone());
        if(dto.getAdresse() != null) u.setAdresse(dto.getAdresse());
        if(dto.getMatricule() != null) u.setMatricule(dto.getMatricule());
        if(dto.getActif() != null) u.setActif(dto.getActif());
        if(dto.getPhotoUrl() != null) u.setPhotoUrl(dto.getPhotoUrl());

        if (u instanceof Enseignant enseignant) {
            if (dto.getSpecialite() != null) enseignant.setSpecialite(dto.getSpecialite());
            if (dto.getDateEmbauche() != null) enseignant.setDateEmbauche(dto.getDateEmbauche());
            if (dto.getGrade() != null) enseignant.setGrade(dto.getGrade());
        }

        return convertToDto(utilisateurRepository.save(u));
    }

    public UtilisateurDto updatePhotoProfil(Integer id, String photoUrl) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Utilisateur currentUser = utilisateurRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur actuel non trouvé"));

        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Vous ne pouvez modifier que votre propre photo de profil");
        }

        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        u.setPhotoUrl(photoUrl);
        return convertToDto(utilisateurRepository.save(u));
    }

    public void deleteUtilisateur(Integer id) {
        verifyAdmin();
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateurRepository.delete(u);
    }

    private UtilisateurDto convertToDto(Utilisateur u) {
        UtilisateurDto dto = new UtilisateurDto();
        dto.setId(u.getId());
        dto.setNom(u.getNom());
        dto.setPrenom(u.getPrenom());
        dto.setEmail(u.getEmail());
        dto.setTelephone(u.getTelephone());
        dto.setAdresse(u.getAdresse());
        dto.setMatricule(u.getMatricule());
        dto.setRole(u.getRole().name());
        dto.setActif(u.getActif());
        dto.setPhotoUrl(u.getPhotoUrl());

        if (u instanceof Enseignant enseignant) {
            dto.setSpecialite(enseignant.getSpecialite());
            dto.setDateEmbauche(enseignant.getDateEmbauche());
            dto.setGrade(enseignant.getGrade());
        }

        return dto;
    }
}
