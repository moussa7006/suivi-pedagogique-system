package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.FiliereDto;
import com.suiviPedagogique.edutrack.services.FiliereService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filieres")
public class FiliereController {

    private final FiliereService filiereService;

    public FiliereController(FiliereService filiereService) {
        this.filiereService = filiereService;
    }

    @GetMapping
    public ResponseEntity<List<FiliereDto>> getAllFilieres() {
        return ResponseEntity.ok(filiereService.getAllFilieres());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FiliereDto> getFiliereById(@PathVariable Integer id) {
        return ResponseEntity.ok(filiereService.getFiliereById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<FiliereDto> createFiliere(@RequestBody FiliereDto dto) {
        return ResponseEntity.status(201).body(filiereService.createFiliere(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<FiliereDto> updateFiliere(@PathVariable Integer id, @RequestBody FiliereDto dto) {
        return ResponseEntity.ok(filiereService.updateFiliere(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<Void> deleteFiliere(@PathVariable Integer id) {
        filiereService.deleteFiliere(id);
        return ResponseEntity.noContent().build();
    }
}
