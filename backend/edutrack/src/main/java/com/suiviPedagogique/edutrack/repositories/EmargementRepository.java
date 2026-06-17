package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.Emargement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmargementRepository extends JpaRepository<Emargement, Integer> {
    List<Emargement> findByEnseignantId(Integer enseignantId);
}
