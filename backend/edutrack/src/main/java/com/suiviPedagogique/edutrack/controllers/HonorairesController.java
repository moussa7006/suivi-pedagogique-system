package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.HonorairesCalculDto;
import com.suiviPedagogique.edutrack.Dto.HonorairesCalculRequest;
import com.suiviPedagogique.edutrack.services.HonorairesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/honoraires")
public class HonorairesController {
    private final HonorairesService honorairesService;

    public HonorairesController(HonorairesService honorairesService) {
        this.honorairesService = honorairesService;
    }

    @GetMapping("/preview")
    public ResponseEntity<HonorairesCalculDto> previewHonoraires(
            @RequestParam Integer enseignantId,
            @RequestParam Integer annee,
            @RequestParam Integer mois
    ) {
        return ResponseEntity.ok(honorairesService.previewHonoraires(enseignantId, annee, mois));
    }

    @PostMapping("/calculer")
    public ResponseEntity<HonorairesCalculDto> calculerHonoraires(@RequestBody HonorairesCalculRequest request) {
        return ResponseEntity.ok(honorairesService.calculerHonoraires(
                request.getEnseignantId(),
                request.getAnnee(),
                request.getMois()
        ));
    }

    @GetMapping
    public ResponseEntity<List<HonorairesCalculDto>> getHonorairesParMois(
            @RequestParam Integer annee,
            @RequestParam Integer mois
    ) {
        return ResponseEntity.ok(honorairesService.getHonorairesParMois(annee, mois));
    }

    @GetMapping("/enseignant/{enseignantId}")
    public ResponseEntity<List<HonorairesCalculDto>> getHonorairesEnseignant(@PathVariable Integer enseignantId) {
        return ResponseEntity.ok(honorairesService.getHonorairesEnseignant(enseignantId));
    }

    @GetMapping("/mes-honoraires")
    public ResponseEntity<List<HonorairesCalculDto>> getMesHonoraires() {
        return ResponseEntity.ok(honorairesService.getMesHonoraires());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HonorairesCalculDto> getHonorairesById(@PathVariable Integer id) {
        return ResponseEntity.ok(honorairesService.getHonorairesById(id));
    }

    @PatchMapping("/{id}/valider")
    public ResponseEntity<HonorairesCalculDto> validerHonoraires(@PathVariable Integer id) {
        return ResponseEntity.ok(honorairesService.validerHonoraires(id));
    }

    @PatchMapping("/{id}/payer")
    public ResponseEntity<HonorairesCalculDto> marquerCommePaye(@PathVariable Integer id) {
        return ResponseEntity.ok(honorairesService.marquerCommePaye(id));
    }
}
