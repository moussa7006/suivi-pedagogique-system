package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.UtilisateurDto;
import com.suiviPedagogique.edutrack.Entities.Enseignant;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

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

    @Transactional
    public void deleteUtilisateur(Integer id) {
        verifyAdmin();
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (u instanceof Enseignant) {
            deleteEnseignantDependencies(id);
        }

        utilisateurRepository.delete(u);
    }

    /**
     * Supprime toutes les données liées à un enseignant avant la suppression du
     * compte, sinon les contraintes FK font échouer le delete. Ordre respecté :
     * pièces jointes → justificatifs → émargements → détails honoraires →
     * fiches → séances → QR codes orphelins → emplois du temps → honoraires.
     */
    private void deleteEnseignantDependencies(Integer enseignantId) {
        jdbcTemplate.update("""
                DELETE FROM piece_jointe WHERE fiche_progression_id IN (
                    SELECT id FROM fiche_progression
                    WHERE enseignant_id = ?
                       OR seance_id IN (SELECT id FROM seance WHERE enseignant_id = ?))
                """, enseignantId, enseignantId);

        jdbcTemplate.update("""
                DELETE FROM justificatif
                WHERE enseignant_id = ?
                   OR emargement_id IN (SELECT id FROM emargement WHERE seance_id IN (
                        SELECT id FROM seance WHERE enseignant_id = ?))
                """, enseignantId, enseignantId);

        jdbcTemplate.update("""
                DELETE FROM emargement
                WHERE enseignant_id = ?
                   OR seance_id IN (SELECT id FROM seance WHERE enseignant_id = ?)
                """, enseignantId, enseignantId);

        jdbcTemplate.update("""
                DELETE FROM detail_honoraire
                WHERE seance_id IN (SELECT id FROM seance WHERE enseignant_id = ?)
                   OR honoraires_calculs_id IN (SELECT id FROM honoraires_calculs WHERE enseignant_id = ?)
                """, enseignantId, enseignantId);

        // Casser la référence circulaire seance ↔ fiche_progression et détacher les QR
        jdbcTemplate.update(
                "UPDATE seance SET fiche_progression_id = NULL WHERE enseignant_id = ?", enseignantId);
        jdbcTemplate.update(
                "UPDATE seance SET qr_code_id = NULL WHERE enseignant_id = ?", enseignantId);

        jdbcTemplate.update("""
                DELETE FROM fiche_progression
                WHERE enseignant_id = ?
                   OR seance_id IN (SELECT id FROM seance WHERE enseignant_id = ?)
                """, enseignantId, enseignantId);

        jdbcTemplate.update("DELETE FROM seance WHERE enseignant_id = ?", enseignantId);

        // QR codes devenus orphelins (plus référencés par aucune séance)
        jdbcTemplate.update(
                "DELETE FROM qrcode q WHERE NOT EXISTS (SELECT 1 FROM seance s WHERE s.qr_code_id = q.id)");

        jdbcTemplate.update("DELETE FROM emploi_du_temps WHERE enseignant_id = ?", enseignantId);
        jdbcTemplate.update("DELETE FROM honoraires_calculs WHERE enseignant_id = ?", enseignantId);
        jdbcTemplate.update("DELETE FROM password_reset_code WHERE utilisateur_id = ?", enseignantId);
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
