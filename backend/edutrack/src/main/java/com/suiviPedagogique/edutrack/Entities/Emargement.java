package com.suiviPedagogique.edutrack.Entities;

import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Emargement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDateTime dateHeureScan;

    @Column(nullable = false)
    private Float latitude;

    @Column(nullable = false)
    private Float longitude;

    @Column(nullable = false)
    private String adresseApproximative;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutEmargement statut;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @OneToOne
    @JoinColumn(name = "seance_id", nullable = false, unique = true)
    private Seance seance;

    @OneToOne(mappedBy = "emargement")
    private Justificatif justificatif;
}
