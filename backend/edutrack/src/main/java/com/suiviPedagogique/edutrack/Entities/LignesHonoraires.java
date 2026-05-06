package com.suiviPedagogique.edutrack.Entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LignesHonoraires {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Float nombreHeures;

    @Column(nullable = false)
    private Float tauxHoraire;

    @Column(nullable = false)
    private Float montant;

    @ManyToOne
    @JoinColumn(name = "honoraires_calculs_id", nullable = false)
    private HonorairesCalculs honorairesCalculs;

    @OneToOne
    @JoinColumn(name = "seance_id", nullable = false, unique = true)
    private Seance seance;
}
