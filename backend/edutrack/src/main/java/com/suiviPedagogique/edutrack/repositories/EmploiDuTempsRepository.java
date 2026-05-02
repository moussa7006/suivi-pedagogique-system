package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.EmploiDuTemps;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmploiDuTempsRepository extends JpaRepository<EmploiDuTemps, Integer> {
    
    // We can add queries here if we need to find active EmploiDuTemps for a specific date
    @Query("SELECT e FROM EmploiDuTemps e WHERE e.dateDebutValidite <= CURRENT_DATE AND (e.dateFinValidite IS NULL OR e.dateFinValidite >= CURRENT_DATE)")
    List<EmploiDuTemps> findAllActive();
    
    List<EmploiDuTemps> findByEnseignantId(Integer enseignantId);
}
