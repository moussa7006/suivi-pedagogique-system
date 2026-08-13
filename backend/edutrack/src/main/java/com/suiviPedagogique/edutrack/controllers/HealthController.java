package com.suiviPedagogique.edutrack.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Endpoint de santé public, utilisé par l'application mobile pour
 * auto-détecter le serveur backend sur le même réseau local (LAN).
 * Ne nécessite pas d'authentification.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "service", "edutrack-backend"
        ));
    }
}
