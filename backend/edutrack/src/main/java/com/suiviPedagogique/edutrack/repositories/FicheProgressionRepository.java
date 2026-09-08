package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.FicheProgression;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface FicheProgressionRepository extends JpaRepository<FicheProgression, Integer> {
    @EntityGraph(attributePaths = {
            "enseignant",
            "seance.enseignant",
            "seance.emploiDuTemps.matiere"
    })
    List<FicheProgression> findByEnseignantId(Integer enseignantId);

    @EntityGraph(attributePaths = {
            "enseignant", "seance.enseignant", "seance.classe",
            "seance.emploiDuTemps.matiere"
    })
    @Query("SELECT f FROM FicheProgression f WHERE f.seance.emploiDuTemps.anneeUniversitaire.id = :anneeUniversitaireId")
    List<FicheProgression> findByAnneeUniversitaireId(@Param("anneeUniversitaireId") Integer anneeUniversitaireId);

    List<FicheProgression> findAll();
}
