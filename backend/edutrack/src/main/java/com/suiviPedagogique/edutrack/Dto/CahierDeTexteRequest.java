package com.suiviPedagogique.edutrack.Dto;

import lombok.Data;

@Data
public class CahierDeTexteRequest {
    private String titreCours;
    private String contenu;
    private String pieceJointe;
}
