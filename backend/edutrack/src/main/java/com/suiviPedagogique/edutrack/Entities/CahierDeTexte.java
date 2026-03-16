package com.suiviPedagogique.edutrack.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class CahierDeTexte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String titreCours;
    @Column(columnDefinition = "TEXT")
    private String contenu;
    private LocalDateTime dateCreation;
    private String pieceJointe;

    @OneToOne(mappedBy = "cahierDeTexte")
    private Seance seance;
}
