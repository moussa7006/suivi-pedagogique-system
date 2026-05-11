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
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Créer un emploi du temps", description = "Seul l'administrateur peut créer")
    public ResponseEntity<EmploiDuTempsDto> create(@RequestBody EmploiDuTempsDto dto) {
        return ResponseEntity.ok(emploiDuTempsService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Modifier un emploi du temps", description = "Seul l'administrateur peut modifier")
    public ResponseEntity<EmploiDuTempsDto> update(@PathVariable Integer id, @RequestBody EmploiDuTempsDto dto) {
        return ResponseEntity.ok(emploiDuTempsService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
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

    @PostMapping(value = "/import", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Importer des emplois du temps via Excel")
    public ResponseEntity<?> importSchedules(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            int count = com.suiviPedagogique.edutrack.services.ExcelImportService.class.cast(
                org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext(
                    ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()).getRequest().getServletContext()
                ).getBean(com.suiviPedagogique.edutrack.services.ExcelImportService.class)
            ).importSchedules(file);
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("message", count + " planifications importées avec succès.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("error", "Erreur d'importation: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
