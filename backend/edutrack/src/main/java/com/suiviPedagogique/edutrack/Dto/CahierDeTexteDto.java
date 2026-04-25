package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CahierDeTexteDto {
    private Integer id;
    private String titreCours;
    private String contenu;
    private LocalDateTime dateCreation;
    private String pieceJointe;
    private String statutValidite;

    // Informations associées pour l'affichage Frontend
    private String enseignantNomPrenom;
    private String matiereLibelle;
    private String dateSeance;
    private String heureSeance;
    private Integer seanceId;
}
