package com.suiviPedagogique.edutrack.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String libelle;

    @ManyToOne
    @JoinColumn(name = "filiere_id", nullable = false)
    private Filiere filiere;

    @ManyToOne
    @JoinColumn(name = "niveau_enseignement_id", nullable = false)
    private NiveauEnseignement niveauEnseignement;

    @OneToMany(mappedBy = "classe")
    private List<Seance> seances;

    @OneToMany(mappedBy = "classe")
    private List<EmploiDuTemps> emploisDuTemps;

    @ManyToOne
    @JoinColumn(name = "annee_universitaire_id", nullable = true)
    private AnneeUniversitaire anneeUniversitaire;
}
