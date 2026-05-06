package com.suiviPedagogique.edutrack.Entities;
import com.suiviPedagogique.edutrack.Entities.enums.TypePieceJointe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PieceJointe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String urlChemin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePieceJointe type;

    @ManyToOne
    @JoinColumn(name = "fiche_progression_id", nullable = false)
    private FicheProgression ficheProgression;
}
