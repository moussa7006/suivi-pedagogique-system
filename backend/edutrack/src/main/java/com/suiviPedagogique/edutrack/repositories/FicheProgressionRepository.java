package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.FicheProgression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FicheProgressionRepository extends JpaRepository<FicheProgression, Integer> {
}
