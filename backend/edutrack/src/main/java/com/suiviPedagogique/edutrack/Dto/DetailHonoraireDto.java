package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailHonoraireDto {
    private Integer id;
    private Integer seanceId;
    private LocalDate dateCours;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String enseignantNomPrenom;
    private String classeLibelle;
    private String niveauLibelle;
    private String matiereLibelle;
    private Float nombreHeures;
    private Float tauxHoraire;
    private Float montant;
}
