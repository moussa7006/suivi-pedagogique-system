package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SeanceDto {

    private Integer id;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String salle;
    private String tokenQRCode;

    // IDs des entités liées
    private Integer administrateurId;
    private Integer enseignantId;
    private Integer classeId;
    private Integer matiereId;
    private Integer emargementId;
    private Integer cahierDeTexteId;
}
