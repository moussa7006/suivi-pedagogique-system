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

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @OneToMany(mappedBy = "honorairesCalculs")
    private List<LignesHonoraires> lignesHonoraires;
}
