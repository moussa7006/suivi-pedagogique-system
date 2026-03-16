package com.suiviPedagogique.edutrack.Repositories;

import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {

    // Recherche par email (retourne un Optional pour éviter les NullPointerException)
    Optional<Utilisateur> findByEmail(String email);

    // Recherche par matricule (puisque tu l'as ajouté)
    Optional<Utilisateur> findByMatricule(String matricule);
}
