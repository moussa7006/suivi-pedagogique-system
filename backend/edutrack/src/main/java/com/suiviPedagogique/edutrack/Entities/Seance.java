package com.suiviPedagogique.edutrack.Entities;

import jakarta.persistence.Entity;
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

    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String salle;
    private String tokenQRCode;

    // Relations
    @ManyToOne
    @JoinColumn(name = "administrateur_id")
    private Administrateur administrateur; // Relation "gerer"

    @ManyToOne
    @JoinColumn(name = "enseignant_id")
    private Enseignant enseignant; // Relation "animer"

    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe; // Relation "destinee a"

    @ManyToOne
    @JoinColumn(name = "matiere_id")
    private Matiere matiere; // Relation "concerner"

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "emargement_id", referencedColumnName = "id")
    private Emargement emargement; // Relation "contienir"

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cahier_de_texte_id", referencedColumnName = "id")
    private CahierDeTexte cahierDeTexte;
}
