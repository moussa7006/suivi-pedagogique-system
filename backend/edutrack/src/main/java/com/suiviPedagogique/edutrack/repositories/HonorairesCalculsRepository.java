package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.HonorairesCalculs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HonorairesCalculsRepository extends JpaRepository<HonorairesCalculs, Integer> {
    Optional<HonorairesCalculs> findByEnseignantIdAndMois(Integer enseignantId, LocalDate mois);

    List<HonorairesCalculs> findByMois(LocalDate mois);

    List<HonorairesCalculs> findByEnseignantIdOrderByMoisDesc(Integer enseignantId);
}
