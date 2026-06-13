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
public class Matiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false, unique = true)
    private String libelle;

    @Column(nullable = false)
    private Integer volumeHoraireTotal;

    @ManyToOne
    @JoinColumn(name = "departement_id", nullable = false)
    private Departement departement;


    @OneToMany(mappedBy = "matiere")
    private List<EmploiDuTemps> emploisDuTemps;
}
