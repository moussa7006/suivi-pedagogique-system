package com.suiviPedagogique.edutrack.Entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Salle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(nullable = false)
    private String batiment;

    @Column(nullable = false)
    private Integer capacite;

    @Column(nullable = false)
    private String equipement;

    @Column(nullable = true)
    private String adresseIp;

    @Column(unique = true)
    private String tokenAffichage;
}
