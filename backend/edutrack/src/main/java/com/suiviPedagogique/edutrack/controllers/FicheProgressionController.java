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
import java.util.Map;

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
            String resultat = ficheProgressionService.remplirFicheProgression(seanceId, request);
            return ResponseEntity.ok(resultat);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @Operation(summary = "Lister les fiches de progression", description = "Retourne la liste de toutes les fiches de progression")
    public ResponseEntity<List<FicheProgressionDto>> getAllFicheProgressions() {
        return ResponseEntity.ok(ficheProgressionService.getAllFicheProgressions());
    }

    @PutMapping("/{id}/valider")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Valider ou rejeter une fiche de progression", description = "Permet à l'admin d'approuver ou rejeter la fiche de progression")
    public ResponseEntity<FicheProgressionDto> validerFicheProgression(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> body) {
        Boolean estValideAdmin = body.get("estValideAdmin");
        return ResponseEntity.ok(ficheProgressionService.validerFicheProgression(id, estValideAdmin));
    }
}
