package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.UtilisateurDto;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
                .filter(u -> Boolean.TRUE.equals(u.getActif()))
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
        if(dto.getRole() != null) u.setRole(normalizeRole(dto.getRole()));
        if(dto.getActif() != null) u.setActif(dto.getActif());
        if(dto.getMotDePasse() != null && !dto.getMotDePasse().isBlank()) {
            validatePassword(dto.getMotDePasse());
            u.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
            u.setForcePasswordChange(false);
        }

        return convertToDto(utilisateurRepository.save(u));
    }

    public void deleteUtilisateur(Integer id) {
        verifyAdmin();
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        u.setActif(false);
        utilisateurRepository.save(u);
    }

    private void validatePassword(String motDePasse) {
        if (motDePasse.length() < 14) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 14 caractères");
        }
        if (!motDePasse.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{14,}$")) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre");
        }
    }

    private Role normalizeRole(String role) {
        if (role == null) {
            throw new IllegalArgumentException("Le rôle est obligatoire");
        }

        String normalizedRole = role.trim().toUpperCase();
        if (normalizedRole.equals("ADMIN")) {
            return Role.ADMINISTRATEUR;
        }

        return Role.valueOf(normalizedRole);
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
        return dto;
    }
}
