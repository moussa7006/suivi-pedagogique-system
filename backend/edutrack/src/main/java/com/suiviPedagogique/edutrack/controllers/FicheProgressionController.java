package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.FicheProgressionRequest;
import com.suiviPedagogique.edutrack.Dto.FicheProgressionDto;
import com.suiviPedagogique.edutrack.services.FicheProgressionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fiche-progression")
@Tag(name = "Fiche de Progression", description = "Endpoints pour la gestion des fiches de progression")
@SecurityRequirement(name = "bearerAuth")
public class FicheProgressionController {

    @Autowired
    private FicheProgressionService ficheProgressionService;

    @PostMapping("/{seanceId}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    @Operation(summary = "Remplir la fiche de progression", description = "Permet à l'enseignant de remplir la fiche de progression d'une séance. Confirme l'émargement si rempli avant la fin de la séance.")
    public ResponseEntity<?> remplirFicheProgression(
            @PathVariable Integer seanceId,
            @RequestBody FicheProgressionRequest request) {
        try {
            FicheProgressionDto resultat = ficheProgressionService.remplirFicheProgression(seanceId, request);
            return ResponseEntity.ok(resultat);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Lister les fiches de progression", description = "Retourne la liste de toutes les fiches de progression")
    public ResponseEntity<List<FicheProgressionDto>> getAllFicheProgressions() {
        return ResponseEntity.ok(ficheProgressionService.getAllFicheProgressions());
    }

}
