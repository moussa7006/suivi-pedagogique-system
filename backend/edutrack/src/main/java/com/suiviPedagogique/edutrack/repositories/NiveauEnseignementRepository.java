package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.NiveauEnseignement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NiveauEnseignementRepository extends JpaRepository<NiveauEnseignement, Integer> {
}
