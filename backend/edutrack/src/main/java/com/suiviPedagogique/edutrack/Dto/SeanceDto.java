package com.suiviPedagogique.edutrack.Dto;

import com.suiviPedagogique.edutrack.Entities.enums.StatutSeance;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeanceDto {

    private Integer id;
    private LocalDate dateCours;
    private LocalTime heureDebutReelle;
    private LocalTime heureFinReelle;
    private Integer salleId;
    private Integer qrCodeId;
    private StatutSeance statut;

    // IDs des entités liées
    private Integer emploiDuTempsId;
    private Integer enseignantId;
    private Integer classeId;
    private Integer emargementId;
    private Integer ficheProgressionId;
}
