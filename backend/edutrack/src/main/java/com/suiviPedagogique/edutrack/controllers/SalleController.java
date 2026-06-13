package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.SalleDto;
import com.suiviPedagogique.edutrack.services.SalleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salles")
public class SalleController {

    private final SalleService salleService;

    public SalleController(SalleService salleService) {
        this.salleService = salleService;
    }

    @GetMapping
    public ResponseEntity<List<SalleDto>> getAll() {
        return ResponseEntity.ok(salleService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalleDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(salleService.getById(id));
    }

    @PostMapping
    public ResponseEntity<SalleDto> create(@RequestBody SalleDto dto) {
        return ResponseEntity.status(201).body(salleService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalleDto> update(@PathVariable Integer id, @RequestBody SalleDto dto) {
        return ResponseEntity.ok(salleService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        salleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
