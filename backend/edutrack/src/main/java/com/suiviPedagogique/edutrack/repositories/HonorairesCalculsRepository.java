package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.HonorairesCalculs;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HonorairesCalculsRepository extends JpaRepository<HonorairesCalculs, Integer> {
    @EntityGraph(attributePaths = {"detailsHonoraires"})
    Optional<HonorairesCalculs> findByEnseignantIdAndMois(Integer enseignantId, LocalDate mois);

    @EntityGraph(attributePaths = {"detailsHonoraires"})
    List<HonorairesCalculs> findByMois(LocalDate mois);

    @EntityGraph(attributePaths = {"detailsHonoraires"})
    List<HonorairesCalculs> findByEnseignantIdOrderByMoisDesc(Integer enseignantId);
}
