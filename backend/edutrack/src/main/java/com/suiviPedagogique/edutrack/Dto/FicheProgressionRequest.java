package com.suiviPedagogique.edutrack.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FicheProgressionRequest {
    private LocalDate dateSaisie;
    private String contenuDetaille;
    private String objectifs;
    private String travaux;
}
