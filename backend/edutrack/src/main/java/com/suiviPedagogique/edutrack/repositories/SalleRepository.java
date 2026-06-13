package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalleRepository extends JpaRepository<Salle, Integer> {
    Optional<Salle> findByTokenAffichage(String tokenAffichage);
}
