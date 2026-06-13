package com.suiviPedagogique.edutrack.Dto;

import com.suiviPedagogique.edutrack.Entities.enums.StatutHonoraire;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HonorairesCalculDto {
    private Integer id;
    private LocalDate mois;
    private Integer enseignantId;
    private String enseignantNomPrenom;
    private Float totalHeures;
    private Float montantBrut;
    private StatutHonoraire statut;
    private LocalDateTime dateCalcul;
    private LocalDateTime dateValidation;
    private List<DetailHonoraireDto> detailsHonoraires;
}
