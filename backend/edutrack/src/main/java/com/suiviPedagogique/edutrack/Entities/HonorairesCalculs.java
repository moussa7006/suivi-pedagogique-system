package com.suiviPedagogique.edutrack.Entities;

import com.suiviPedagogique.edutrack.Entities.enums.StatutHonoraire;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"enseignant_id", "mois"})
})
public class HonorairesCalculs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDate mois;

    @Column(nullable = false)
    private Float totalHeures;

    @Column(nullable = false)
    private Float montantBrut;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutHonoraire statut = StatutHonoraire.BROUILLON;

    @Column(nullable = false)
    private LocalDateTime dateCalcul = LocalDateTime.now();

    private LocalDateTime dateValidation;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @OneToMany(mappedBy = "honorairesCalculs", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetailHonoraire> detailsHonoraires;
}
