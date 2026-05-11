package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.NiveauEnseignementDto;
import com.suiviPedagogique.edutrack.services.NiveauEnseignementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/niveau-enseignement")
public class NiveauEnseignementController {

    private final NiveauEnseignementService niveauEnseignementService;

    public NiveauEnseignementController(NiveauEnseignementService niveauEnseignementService) {
        this.niveauEnseignementService = niveauEnseignementService;
    }

    @GetMapping
    public ResponseEntity<List<NiveauEnseignementDto>> getAllNiveaux() {
        return ResponseEntity.ok(niveauEnseignementService.getAllNiveaux());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NiveauEnseignementDto> getNiveauById(@PathVariable Integer id) {
        return ResponseEntity.ok(niveauEnseignementService.getNiveauById(id));
    }

    @PostMapping
    public ResponseEntity<NiveauEnseignementDto> createNiveau(@RequestBody NiveauEnseignementDto dto) {
        return ResponseEntity.status(201).body(niveauEnseignementService.createNiveau(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NiveauEnseignementDto> updateNiveau(@PathVariable Integer id, @RequestBody NiveauEnseignementDto dto) {
        return ResponseEntity.ok(niveauEnseignementService.updateNiveau(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNiveau(@PathVariable Integer id) {
        niveauEnseignementService.deleteNiveau(id);
        return ResponseEntity.noContent().build();
    }
}
