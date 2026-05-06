package com.suiviPedagogique.edutrack.Dto;

import com.suiviPedagogique.edutrack.Entities.enums.JourSemaine;
import com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EmploiDuTempsDto {
    private Integer id;
    private String titre;
    private TypeRecurrence typeRecurrence;
    private LocalDate dateDebutValidite;
    private LocalDate dateFinValidite;
    private JourSemaine jourSemaine;
    private Integer jourDuMois;
    private LocalDate dateSpecifique;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private Integer salleId;
    
    private Integer enseignantId;
    private Integer classeId;
    private Integer matiereId;
    private Integer anneeUniversitaireId;
}
