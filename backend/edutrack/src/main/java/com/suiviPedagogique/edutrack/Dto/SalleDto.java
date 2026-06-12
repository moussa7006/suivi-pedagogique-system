package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalleDto {
    private Integer id;
    private String nom;
    private String batiment;
    private Integer capacite;
    private String equipement;
    private String adresseIp;
    private String tokenAffichage;
}
