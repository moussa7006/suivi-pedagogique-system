package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FicheProgressionDto {
    private Integer id;
    private LocalDate dateSaisie;
    private String contenuDetaille;
    private String objectifs;
    private String travaux;
    private Boolean estValideAdmin;
    private LocalDate dateValidation;

    // Informations associées pour l'affichage Frontend
    private String enseignantNomPrenom;
    private String matiereLibelle;
    private String dateSeance;
    private String heureSeance;
    private Integer seanceId;
}
