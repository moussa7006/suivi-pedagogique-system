package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Integer> {

}
