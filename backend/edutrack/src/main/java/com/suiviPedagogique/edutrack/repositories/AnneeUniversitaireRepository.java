package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.AnneeUniversitaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnneeUniversitaireRepository extends JpaRepository<AnneeUniversitaire, Integer> {
}
