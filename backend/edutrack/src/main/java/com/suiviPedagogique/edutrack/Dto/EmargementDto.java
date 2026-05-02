package com.suiviPedagogique.edutrack.Dto;

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
    private String latitudeGPS;
    private String longitudeGPS;
    private Boolean estLocalisee;
    private Boolean estConfirme;
    
    // Informations associées pour l'affichage Frontend
    private String enseignantNomPrenom;
    private String matiereLibelle;
    private String lieu;
    private String heureSeance;
    private String statutAffichage;
    private String methode;
}
