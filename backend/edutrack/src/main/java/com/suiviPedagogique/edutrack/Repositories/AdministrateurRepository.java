package com.suiviPedagogique.edutrack.Repositories;

import com.suiviPedagogique.edutrack.Entities.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Integer> {

}
