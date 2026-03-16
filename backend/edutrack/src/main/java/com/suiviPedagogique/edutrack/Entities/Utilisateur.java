package com.suiviPedagogique.edutrack.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)

public class Utilisateur {

    @Id
    private String id;

    private String nom;

    private String prenom;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String telephone;

    private String addresse;

    private String motDePasse;

    private String role;
}
