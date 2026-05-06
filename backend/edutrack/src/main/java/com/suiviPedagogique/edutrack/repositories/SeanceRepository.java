package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.Seance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeanceRepository extends JpaRepository<Seance, Integer> {

    List<Seance> findByEnseignantId(Integer enseignantId);

    List<Seance> findByDateCours(LocalDate dateCours);

    @Query("SELECT s FROM Seance s WHERE s.qrCode.code = :token")
    Optional<Seance> findByTokenQRCode(String token);

    @Query("SELECT s FROM Seance s WHERE s.dateCours = CURRENT_DATE AND s.qrCode IS NULL")
    List<Seance> findSeancesForTodayWithoutToken();
}
