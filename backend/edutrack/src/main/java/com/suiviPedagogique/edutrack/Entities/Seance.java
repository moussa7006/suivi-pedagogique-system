package com.suiviPedagogique.edutrack.Entities;

import com.suiviPedagogique.edutrack.Entities.enums.StatutSeance;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Seance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDate dateCours;

    @Column(nullable = false)
    private LocalTime heureDebutReelle;

    @Column(nullable = false)
    private LocalTime heureFinReelle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutSeance statut;

    @ManyToOne
    @JoinColumn(name = "emploi_du_temps_id", nullable = false)
    private EmploiDuTemps emploiDuTemps;

    @ManyToOne
    @JoinColumn(name = "salle_id", nullable = false)
    private Salle salle;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe classe;

    @OneToOne
    @JoinColumn(name = "qr_code_id", nullable = true) // 0..1
    private QRCode qrCode;

    @OneToOne(mappedBy = "seance")
    private Emargement emargement;

    @OneToOne
    @JoinColumn(name = "fiche_progression_id", nullable = true) // 0..1
    private FicheProgression ficheProgression;

    @OneToOne(mappedBy = "seance")
    private LignesHonoraires ligneHonoraire;
}
