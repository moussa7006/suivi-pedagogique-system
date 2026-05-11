package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FiliereDto {
    private Integer id;
    private String libelle;
    private Integer departementId;
    private String departementLibelle;
}
