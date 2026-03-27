package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.MatiereDto;
import com.suiviPedagogique.edutrack.services.MatiereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matieres")
public class MatiereController {

    @Autowired
    private MatiereService matiereService;

    @PostMapping
    public ResponseEntity<MatiereDto> createMatiere(@RequestBody MatiereDto dto) {
        return ResponseEntity.status(201).body(matiereService.createMatiere(dto));
    }

    @GetMapping("/lister toutes les matieres")
    public ResponseEntity<List<MatiereDto>> getAllMatieres() {
        return ResponseEntity.ok(matiereService.getAllMatieres());
    }

    @GetMapping("/lister par classe")
    public ResponseEntity<MatiereDto> getMatiereById(@PathVariable Integer id) {
        return ResponseEntity.ok(matiereService.getMatiereById(id));
    }

    @PutMapping("/modifier une matiere")
    public ResponseEntity<MatiereDto> updateMatiere(@PathVariable Integer id, @RequestBody MatiereDto dto) {
        return ResponseEntity.ok(matiereService.updateMatiere(id, dto));
    }

    @DeleteMapping("/supprimer une matiere")
    public ResponseEntity<Void> deleteMatiere(@PathVariable Integer id) {
        matiereService.deleteMatiere(id);
        return ResponseEntity.noContent().build();
    }
}
