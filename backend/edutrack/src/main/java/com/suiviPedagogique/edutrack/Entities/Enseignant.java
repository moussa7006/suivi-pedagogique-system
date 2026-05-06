package com.suiviPedagogique.edutrack.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Enseignant extends Utilisateur {

    @Column(nullable = false)
    private String specialite;

    @Column(nullable = false)
    private LocalDate dateEmbauche;

    @Column(nullable = false)
    private String grade;

    @OneToMany(mappedBy = "enseignant")
    private List<Seance> seancesAnimees;

    @OneToMany(mappedBy = "enseignant")
    private List<HonorairesCalculs> honorairesCalculs;

    @OneToMany(mappedBy = "enseignant")
    private List<FicheProgression> fichesProgression;

    @OneToMany(mappedBy = "enseignant")
    private List<EmploiDuTemps> emploisDuTemps;
}
