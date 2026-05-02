package com.suiviPedagogique.edutrack.Dto;

import com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EmploiDuTempsDto {
    private Integer id;
    private String titre;
    private TypeRecurrence typeRecurrence;
    private LocalDate dateDebutValidite;
    private LocalDate dateFinValidite;
    private DayOfWeek jourDeSemaine;
    private Integer jourDuMois;
    private LocalDate dateSpecifique;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String salle;
    
    private Integer administrateurId;
    private Integer enseignantId;
    private Integer classeId;
    private Integer matiereId;
}
