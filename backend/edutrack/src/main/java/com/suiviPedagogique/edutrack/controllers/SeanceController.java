package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.SeanceDto;
import com.suiviPedagogique.edutrack.services.SeanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seances")
public class SeanceController {


    private  final SeanceService seanceService;

    public SeanceController(SeanceService seanceService) {
        this.seanceService = seanceService;
    }

    @PostMapping("/creer")
    public ResponseEntity<SeanceDto> createSeance(@RequestBody SeanceDto dto) {
        SeanceDto created = seanceService.createSeance(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/modifier")
    public ResponseEntity<SeanceDto> updateSeance(@PathVariable Integer id, @RequestBody SeanceDto dto) {
        SeanceDto updated = seanceService.updateSeance(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/supprimer")
    public ResponseEntity<Void> deleteSeance(@PathVariable Integer id) {
        seanceService.deleteSeance(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lister")
    public ResponseEntity<List<SeanceDto>> getAllSeances() {
        List<SeanceDto> seances = seanceService.getAllSeances();
        return ResponseEntity.ok(seances);
    }

    @GetMapping("/lister par id")
    public ResponseEntity<SeanceDto> getSeanceById(@PathVariable Integer id) {
        SeanceDto seance = seanceService.getSeanceById(id);
        return ResponseEntity.ok(seance);
    }
}
