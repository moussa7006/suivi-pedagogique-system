package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.Emargement;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface EmargementRepository extends JpaRepository<Emargement, Integer> {
    @EntityGraph(attributePaths = {
            "enseignant",
            "seance.enseignant",
            "seance.salle"
    })
    List<Emargement> findByEnseignantId(Integer enseignantId);

    @EntityGraph(attributePaths = {
            "enseignant",
            "seance.enseignant",
            "seance.salle"
    })
    List<Emargement> findAll();

    @EntityGraph(attributePaths = {
            "enseignant", "seance.enseignant", "seance.salle", "seance.classe",
            "seance.emploiDuTemps.matiere"
    })
    @Query("SELECT e FROM Emargement e WHERE e.seance.emploiDuTemps.anneeUniversitaire.id = :anneeUniversitaireId")
    List<Emargement> findByAnneeUniversitaireId(@Param("anneeUniversitaireId") Integer anneeUniversitaireId);

    long countByStatut(com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement statut);

    List<Emargement> findByDateHeureScanAfter(java.time.LocalDateTime date);
}
