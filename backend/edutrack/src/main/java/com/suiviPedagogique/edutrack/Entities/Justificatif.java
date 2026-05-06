package com.suiviPedagogique.edutrack.Entities;
import com.suiviPedagogique.edutrack.Entities.enums.TypeAbsence;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Justificatif {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String fichier;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String commentaire;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeAbsence typeAbsence;

    @Column(nullable = false)
    private Boolean estValideAdmin;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @OneToOne
    @JoinColumn(name = "emargement_id", nullable = false)
    private Emargement emargement;
}
