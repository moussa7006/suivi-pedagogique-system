package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NiveauEnseignementDto {
    private Integer id;
    private String libelle;
    private Float prixHoraire;
}
