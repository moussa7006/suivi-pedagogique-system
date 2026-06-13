package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.AnneeUniversitaireDto;
import com.suiviPedagogique.edutrack.services.AnneeUniversitaireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/annee-universitaire")
public class AnneeUniversitaireController {

    private final AnneeUniversitaireService anneeUniversitaireService;

    public AnneeUniversitaireController(AnneeUniversitaireService anneeUniversitaireService) {
        this.anneeUniversitaireService = anneeUniversitaireService;
    }

    @GetMapping
    public ResponseEntity<List<AnneeUniversitaireDto>> getAll() {
        return ResponseEntity.ok(anneeUniversitaireService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnneeUniversitaireDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(anneeUniversitaireService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AnneeUniversitaireDto> create(@RequestBody AnneeUniversitaireDto dto) {
        return ResponseEntity.status(201).body(anneeUniversitaireService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnneeUniversitaireDto> update(@PathVariable Integer id, @RequestBody AnneeUniversitaireDto dto) {
        return ResponseEntity.ok(anneeUniversitaireService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        anneeUniversitaireService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
