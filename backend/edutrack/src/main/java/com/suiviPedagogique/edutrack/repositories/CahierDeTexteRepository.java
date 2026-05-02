package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.CahierDeTexte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CahierDeTexteRepository extends JpaRepository<CahierDeTexte, Integer> {
}
