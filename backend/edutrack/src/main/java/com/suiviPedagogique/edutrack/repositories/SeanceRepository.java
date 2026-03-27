package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.Seance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import java.util.Optional;

@Repository
public interface SeanceRepository extends JpaRepository<Seance, Integer> {

    // Trouver toutes les séances d'un professeur précis
    List<Seance> findByEnseignantId(Integer enseignantId);

    // Trouver les séances d'une date précise
    List<Seance> findByDate(LocalDate date);

    // Trouver une séance par son Token QR Code
    Optional<Seance> findByTokenQRCode(String tokenQRCode);
}
