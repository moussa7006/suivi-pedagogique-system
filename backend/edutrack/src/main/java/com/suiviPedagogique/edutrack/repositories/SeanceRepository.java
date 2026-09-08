package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.Seance;
import org.springframework.data.jpa.repository.EntityGraph;
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

    @EntityGraph(attributePaths = {
            "enseignant",
            "classe.filiere",
            "classe.niveauEnseignement",
            "emploiDuTemps.matiere.departement",
            "emargement",
            "ficheProgression",
            "qrCode"
    })
    @Query("SELECT s FROM Seance s")
    List<Seance> findAllForDashboard();

    @EntityGraph(attributePaths = {
            "enseignant",
            "classe",
            "emploiDuTemps.matiere",
            "emargement",
            "ficheProgression",
            "qrCode"
    })
    List<Seance> findTop8ByOrderByDateCoursDescHeureDebutReelleDesc();

    @EntityGraph(attributePaths = {
            "enseignant",
            "classe",
            "salle",
            "emploiDuTemps.matiere",
            "emargement",
            "ficheProgression",
            "qrCode"
    })
    List<Seance> findByEnseignantId(Integer enseignantId);

    @EntityGraph(attributePaths = {
            "enseignant",
            "classe",
            "salle",
            "emploiDuTemps.matiere",
            "emargement",
            "ficheProgression",
            "qrCode"
    })
    List<Seance> findAll();

    @EntityGraph(attributePaths = {
            "enseignant",
            "classe",
            "salle",
            "emploiDuTemps.matiere",
            "emargement",
            "ficheProgression",
            "qrCode"
    })
    List<Seance> findByDateCours(LocalDate dateCours);

    @EntityGraph(attributePaths = {
            "enseignant",
            "classe",
            "salle",
            "emploiDuTemps.matiere",
            "emargement",
            "ficheProgression",
            "qrCode"
    })
    Optional<Seance> findById(Integer id);

    long countByDateCours(LocalDate dateCours);

    List<Seance> findByEnseignantIdAndDateCoursBetween(Integer enseignantId, LocalDate startDate, LocalDate endDate);

    @EntityGraph(attributePaths = {
            "enseignant",
            "classe",
            "salle",
            "emploiDuTemps.matiere",
            "emargement",
            "ficheProgression",
            "qrCode"
    })
    @Query("SELECT s FROM Seance s WHERE s.qrCode.code = :token")
    Optional<Seance> findByTokenQRCode(String token);

    @Query("SELECT s FROM Seance s WHERE s.dateCours = CURRENT_DATE AND s.qrCode IS NULL")
    List<Seance> findSeancesForTodayWithoutToken();

    boolean existsByEmploiDuTempsIdAndDateCours(Integer emploiDuTempsId, LocalDate dateCours);

    @EntityGraph(attributePaths = {
            "enseignant", "classe.niveauEnseignement", "salle",
            "emploiDuTemps.matiere", "emargement", "ficheProgression", "qrCode"
    })
    @Query("SELECT s FROM Seance s WHERE s.emploiDuTemps.anneeUniversitaire.id = :anneeUniversitaireId ORDER BY s.dateCours DESC, s.heureDebutReelle DESC")
    List<Seance> findByAnneeUniversitaireId(@Param("anneeUniversitaireId") Integer anneeUniversitaireId);

    List<Seance> findByEmploiDuTempsId(Integer emploiDuTempsId);

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
            WHERE s.salle.id = :salleId
              AND s.dateCours = :dateCours
              AND (:excludeId IS NULL OR s.id <> :excludeId)
              AND s.heureDebutReelle < :heureFin
              AND s.heureFinReelle > :heureDebut
            """)
    List<Seance> findOverlappingSeancesForSalle(
            @Param("salleId") Integer salleId,
            @Param("dateCours") LocalDate dateCours,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin,
            @Param("excludeId") Integer excludeId
    );

    @Query("""
            SELECT s FROM Seance s
            WHERE s.salle.id = :salleId
              AND s.dateCours = :dateCours
              AND s.heureDebutReelle <= :currentTime
              AND s.heureFinReelle >= :currentTime
              AND s.qrCode IS NOT NULL
              AND s.qrCode.estValide = true
              AND s.qrCode.dateHeureExpiration > :now
            ORDER BY s.heureDebutReelle ASC
            """)
    List<Seance> findActiveQrCodesBySalle(
            @Param("salleId") Integer salleId,
            @Param("dateCours") LocalDate dateCours,
            @Param("currentTime") LocalTime currentTime,
            @Param("now") LocalDateTime now
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
