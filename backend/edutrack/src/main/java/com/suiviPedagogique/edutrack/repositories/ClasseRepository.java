package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.Classe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClasseRepository extends JpaRepository<Classe, Integer> {
}
