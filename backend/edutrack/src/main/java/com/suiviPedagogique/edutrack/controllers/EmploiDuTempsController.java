package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.EmploiDuTempsDto;
import com.suiviPedagogique.edutrack.services.EmploiDuTempsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emploi-du-temps")
@Tag(name = "Emploi Du Temps", description = "Endpoints pour la gestion des emplois du temps récurrents")
@SecurityRequirement(name = "bearerAuth")
public class EmploiDuTempsController {

    @Autowired
    private EmploiDuTempsService emploiDuTempsService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Créer un emploi du temps", description = "Seul l'administrateur peut créer")
    public ResponseEntity<EmploiDuTempsDto> create(@RequestBody EmploiDuTempsDto dto) {
        return ResponseEntity.ok(emploiDuTempsService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Modifier un emploi du temps", description = "Seul l'administrateur peut modifier")
    public ResponseEntity<EmploiDuTempsDto> update(@PathVariable Integer id, @RequestBody EmploiDuTempsDto dto) {
        return ResponseEntity.ok(emploiDuTempsService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer un emploi du temps", description = "Seul l'administrateur peut supprimer")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        emploiDuTempsService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Lister les emplois du temps", description = "L'admin voit tout, l'enseignant voit ses emplois du temps")
    public ResponseEntity<List<EmploiDuTempsDto>> getAll() {
        return ResponseEntity.ok(emploiDuTempsService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un emploi du temps par ID")
    public ResponseEntity<EmploiDuTempsDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(emploiDuTempsService.getById(id));
    }
}
