package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnneeUniversitaireDto {
    private Integer id;
    private String libelle;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Boolean active;
}
