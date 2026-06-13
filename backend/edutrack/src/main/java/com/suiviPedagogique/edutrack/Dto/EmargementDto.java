package com.suiviPedagogique.edutrack.Dto;

import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmargementDto {
    private Integer id;
    private LocalDateTime dateHeureScan;
    private Float latitude;
    private Float longitude;
    private String adresseApproximative;
    private StatutEmargement statut;
    
    // Informations associées pour l'affichage Frontend
    private String enseignantNomPrenom;
    private String lieu;
    private String heureSeance;
}
