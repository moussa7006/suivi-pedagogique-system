package com.suiviPedagogique.edutrack.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArchiveAnneeDto {
    private AnneeUniversitaireDto annee;
    private List<ClasseDto> classes;
    private List<EmploiDuTempsDto> emploisDuTemps;
    private List<SeanceDto> seances;
    private List<EmargementDto> emargements;
    private List<FicheProgressionDto> fichesProgression;
    private List<DetailHonoraireDto> honoraires;
}
