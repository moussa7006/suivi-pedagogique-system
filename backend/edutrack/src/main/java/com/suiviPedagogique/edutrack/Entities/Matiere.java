package com.suiviPedagogique.edutrack.Entities;

import jakarta.persistence.Entity;
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

    private String codeMatiere;
    private String libelle;
    private Integer coefficient;

    @OneToMany(mappedBy = "matiere")
    private List<Seance> seances;
}
