package com.suiviPedagogique.edutrack.controllers;


import com.suiviPedagogique.edutrack.Dto.LoginRequest;
import com.suiviPedagogique.edutrack.Dto.RegistrationRequest;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.services.AuthService;
import com.suiviPedagogique.edutrack.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    /*public AuthController(AuthService authService) {
        this.authService = authService;
    }*/

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest request) {
        try {
            Utilisateur nouvelUtilisateur = authService.inscription(request);
            Map<String, Object> response = new HashMap<>();
            response.put("id", nouvelUtilisateur.getId());
            response.put("role", nouvelUtilisateur.getRole());
            response.put("message", "Succès ! Utilisateur inscrit.");
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(409).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Utilisateur utilisateur = authService.authentifier(loginRequest);
            String token = jwtUtil.generateToken(utilisateur.getEmail(), utilisateur.getRole());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Connexion réussie !");
            response.put("token", token);
            response.put("role", utilisateur.getRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Identifiants invalides");
            return ResponseEntity.status(401).body(error);
        }
    }
}
