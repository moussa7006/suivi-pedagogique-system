package com.suiviPedagogique.edutrack.Entities;

import com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.DayOfWeek;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmploiDuTemps {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String titre; // Optionnel (ex: "Mathématiques Semestre 1")

    @Enumerated(EnumType.STRING)
    private TypeRecurrence typeRecurrence;

    private LocalDate dateDebutValidite;
    private LocalDate dateFinValidite;

    // Pour "HEBDOMADAIRE"
    @Enumerated(EnumType.STRING)
    private DayOfWeek jourDeSemaine;

    // Pour "MENSUEL"
    private Integer jourDuMois;

    // Pour "UNIQUE"
    private LocalDate dateSpecifique;

    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String salle;

    @ManyToOne
    @JoinColumn(name = "administrateur_id")
    private Administrateur administrateur;

    @ManyToOne
    @JoinColumn(name = "enseignant_id")
    private Enseignant enseignant;

    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe;

    @ManyToOne
    @JoinColumn(name = "matiere_id")
    private Matiere matiere;
}
