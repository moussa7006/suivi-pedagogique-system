package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.Seance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    boolean existsByEmploiDuTempsIdAndDateCours(Integer emploiDuTempsId, LocalDate dateCours);

    @Query("""
            SELECT s FROM Seance s
            WHERE s.enseignant.id = :enseignantId
              AND s.dateCours = :dateCours
              AND (:excludeId IS NULL OR s.id <> :excludeId)
              AND s.heureDebutReelle < :heureFin
              AND s.heureFinReelle > :heureDebut
            """)
    List<Seance> findOverlappingSeancesForTeacher(
            @Param("enseignantId") Integer enseignantId,
            @Param("dateCours") LocalDate dateCours,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin,
            @Param("excludeId") Integer excludeId
    );

    @Query("""
            SELECT s FROM Seance s
            WHERE s.enseignant.id = :enseignantId
              AND s.dateCours = :dateCours
              AND (:excludeId IS NULL OR s.id <> :excludeId)
              AND s.heureDebutReelle < :heureFin
              AND s.heureFinReelle > :heureDebut
              AND s.qrCode IS NOT NULL
              AND s.qrCode.estValide = true
              AND s.qrCode.dateHeureExpiration > :now
            """)
    List<Seance> findOverlappingSeancesWithActiveQrForTeacher(
            @Param("enseignantId") Integer enseignantId,
            @Param("dateCours") LocalDate dateCours,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin,
            @Param("excludeId") Integer excludeId,
            @Param("now") LocalDateTime now
    );
}
