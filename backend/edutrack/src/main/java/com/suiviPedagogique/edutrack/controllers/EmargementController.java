package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.EmargementRequest;
import com.suiviPedagogique.edutrack.services.EmargementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/emargements")
public class EmargementController {

    @Autowired
    private EmargementService emargementService;

    @PostMapping("/scan")
    public ResponseEntity<?> scanQRCode(@RequestBody EmargementRequest request) {
        try {
            com.suiviPedagogique.edutrack.Entities.Emargement emargement = emargementService.faireEmargement(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Émargement validé avec succès !");
            response.put("statut", emargement.getStatut().name());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<java.util.List<com.suiviPedagogique.edutrack.Dto.EmargementDto>> getAllEmargements() {
        return ResponseEntity.ok(emargementService.getAllEmargements());
    }
}
