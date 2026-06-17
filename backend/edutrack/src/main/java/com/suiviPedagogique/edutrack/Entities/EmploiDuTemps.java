package com.suiviPedagogique.edutrack.Entities;

import com.suiviPedagogique.edutrack.Entities.enums.JourSemaine;
import com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmploiDuTemps {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = true)
    private String titre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeRecurrence typeRecurrence;

    @Column(nullable = false)
    private LocalDate dateDebutValidite;

    @Column(nullable = false)
    private LocalDate dateFinValidite;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true) // Only for weekly
    private JourSemaine jourSemaine;

    @Column(nullable = true) // Only for monthly
    private Integer jourDuMois;

    @Column(nullable = true) // Only for unique
    private LocalDate dateSpecifique;

    @Column(nullable = false)
    private LocalTime heureDebut;

    @Column(nullable = false)
    private LocalTime heureFin;

    @ManyToOne
    @JoinColumn(name = "salle_id", nullable = false)
    private Salle salle;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe classe;

    @ManyToOne
    @JoinColumn(name = "matiere_id", nullable = false)
    private Matiere matiere;

    @ManyToOne
    @JoinColumn(name = "annee_universitaire_id", nullable = false)
    private AnneeUniversitaire anneeUniversitaire;

    @OneToMany(mappedBy = "emploiDuTemps")
    private List<Seance> seances;
}
