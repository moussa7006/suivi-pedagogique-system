package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatiereDto {
    private Integer id;
    private String codeMatiere;
    private String libelle;
    private Integer coefficient;
}
