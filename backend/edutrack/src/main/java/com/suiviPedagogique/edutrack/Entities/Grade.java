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
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String libelle;
    private float tauxHoraire;


    @OneToMany(mappedBy = "grade")
    private List<Enseignant> enseignants;

}
