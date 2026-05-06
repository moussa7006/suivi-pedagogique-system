package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.LignesHonoraires;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LignesHonorairesRepository extends JpaRepository<LignesHonoraires, Integer> {
}
