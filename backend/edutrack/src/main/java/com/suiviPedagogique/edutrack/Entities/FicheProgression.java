package com.suiviPedagogique.edutrack.Entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FicheProgression {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDate dateSaisie;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenuDetaille;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String objectifs;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String travaux;

    @Column(nullable = false)
    private Boolean estValideAdmin;

    @Column(nullable = true)
    private LocalDate dateValidation;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @OneToOne
    @JoinColumn(name = "seance_id", nullable = true) // 0..1 relationship
    private Seance seance;

    @OneToMany(mappedBy = "ficheProgression")
    private List<PieceJointe> piecesJointes;
}
