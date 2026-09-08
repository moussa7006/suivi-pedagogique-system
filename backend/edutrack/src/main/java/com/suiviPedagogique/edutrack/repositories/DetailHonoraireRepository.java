package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.DetailHonoraire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface DetailHonoraireRepository extends JpaRepository<DetailHonoraire, Integer> {
    @EntityGraph(attributePaths = {
            "seance.enseignant", "seance.classe.niveauEnseignement",
            "seance.emploiDuTemps.matiere", "honorairesCalculs.enseignant"
    })
    @Query("SELECT d FROM DetailHonoraire d WHERE d.seance.emploiDuTemps.anneeUniversitaire.id = :anneeUniversitaireId")
    List<DetailHonoraire> findByAnneeUniversitaireId(@Param("anneeUniversitaireId") Integer anneeUniversitaireId);

    boolean existsBySeanceId(Integer seanceId);

    List<DetailHonoraire> findByHonorairesCalculsId(Integer honorairesCalculsId);
}
