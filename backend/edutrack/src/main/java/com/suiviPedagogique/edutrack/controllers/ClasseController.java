package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.ClasseDto;
import com.suiviPedagogique.edutrack.services.ClasseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClasseController {

    @Autowired
    private ClasseService classeService;

    @PostMapping
    public ResponseEntity<ClasseDto> createClasse(@RequestBody ClasseDto dto) {
        return ResponseEntity.status(201).body(classeService.createClasse(dto));
    }

    @GetMapping
    public ResponseEntity<List<ClasseDto>> getAllClasses() {
        return ResponseEntity.ok(classeService.getAllClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClasseDto> getClasseById(@PathVariable Integer id) {
        return ResponseEntity.ok(classeService.getClasseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClasseDto> updateClasse(@PathVariable Integer id, @RequestBody ClasseDto dto) {
        return ResponseEntity.ok(classeService.updateClasse(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClasse(@PathVariable Integer id) {
        classeService.deleteClasse(id);
        return ResponseEntity.noContent().build();
    }
}
