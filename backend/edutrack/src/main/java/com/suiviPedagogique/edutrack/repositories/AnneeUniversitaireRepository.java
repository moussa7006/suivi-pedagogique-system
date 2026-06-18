package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.AnneeUniversitaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface AnneeUniversitaireRepository extends JpaRepository<AnneeUniversitaire, Integer> {

    @Query("SELECT COUNT(a) > 0 FROM AnneeUniversitaire a WHERE a.dateDebut <= :dateFin AND a.dateFin >= :dateDebut AND (:id IS NULL OR a.id != :id)")
    boolean existsOverlapping(@Param("dateDebut") LocalDate dateDebut, @Param("dateFin") LocalDate dateFin, @Param("id") Integer id);
}
