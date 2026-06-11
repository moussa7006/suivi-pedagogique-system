package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HonorairesCalculRequest {
    private Integer enseignantId;
    private Integer annee;
    private Integer mois;
}
