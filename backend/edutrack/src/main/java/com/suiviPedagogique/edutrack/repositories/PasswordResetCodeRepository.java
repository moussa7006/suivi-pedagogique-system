package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.PasswordResetCode;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, Integer> {
    Optional<PasswordResetCode> findFirstByUtilisateurOrderByExpiresAtDesc(Utilisateur utilisateur);
    void deleteByUtilisateur(Utilisateur utilisateur);
}
