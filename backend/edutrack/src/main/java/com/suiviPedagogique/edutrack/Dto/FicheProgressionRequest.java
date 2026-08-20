package com.suiviPedagogique.edutrack.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FicheProgressionRequest {
    private LocalDate dateSaisie;
    private String contenuDetaille;
    private String objectifs;
    private String travaux;
    
    // Nouveaux champs pour intégrer l'émargement
    private String tokenQRCode;
    private Float latitude;
    private Float longitude;
    private String adresseApproximative;
}
