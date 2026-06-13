package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.DepartementDto;
import com.suiviPedagogique.edutrack.services.DepartementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departements")
public class DepartementController {

    private final DepartementService departementService;

    public DepartementController(DepartementService departementService) {
        this.departementService = departementService;
    }

    @GetMapping
    public ResponseEntity<List<DepartementDto>> getAll() {
        return ResponseEntity.ok(departementService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartementDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(departementService.getById(id));
    }

    @PostMapping
    public ResponseEntity<DepartementDto> create(@RequestBody DepartementDto dto) {
        return ResponseEntity.status(201).body(departementService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartementDto> update(@PathVariable Integer id, @RequestBody DepartementDto dto) {
        return ResponseEntity.ok(departementService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        departementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
