package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.CahierDeTexteRequest;
import com.suiviPedagogique.edutrack.services.CahierDeTexteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cahier-texte")
@Tag(name = "Cahier de Texte", description = "Endpoints pour la gestion des cahiers de texte")
@SecurityRequirement(name = "bearerAuth")
public class CahierDeTexteController {

    @Autowired
    private CahierDeTexteService cahierDeTexteService;

    @PostMapping("/{seanceId}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    @Operation(summary = "Remplir le cahier de texte", description = "Permet à l'enseignant de remplir le cahier de texte d'une séance. Confirme l'émargement si rempli avant la fin de la séance.")
    public ResponseEntity<?> remplirCahierDeTexte(
            @PathVariable Integer seanceId,
            @RequestBody CahierDeTexteRequest request) {
        try {
            String resultat = cahierDeTexteService.remplirCahierDeTexte(seanceId, request);
            return ResponseEntity.ok(resultat);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
