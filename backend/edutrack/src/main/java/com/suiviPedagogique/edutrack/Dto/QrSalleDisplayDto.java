package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QrSalleDisplayDto {
    private Integer seanceId;
    private Integer salleId;
    private String salleNom;
    private String qrCodeToken;
    private LocalDateTime dateHeureExpiration;
    private String enseignantNomPrenom;
    private String classeLibelle;
}
