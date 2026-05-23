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
            String token = jwtUtil.generateToken(utilisateur.getEmail(), utilisateur.getRole().name());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Connexion réussie !");
            response.put("token", token);
            response.put("id", utilisateur.getId());
            response.put("matricule", utilisateur.getMatricule());
            response.put("nom", utilisateur.getNom());
            response.put("prenom", utilisateur.getPrenom());
            response.put("email", utilisateur.getEmail());
            response.put("telephone", utilisateur.getTelephone());
            response.put("adresse", utilisateur.getAdresse());
            response.put("role", utilisateur.getRole());
            response.put("forcePasswordChange", utilisateur.getForcePasswordChange() != null ? utilisateur.getForcePasswordChange() : false);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Identifiants invalides");
            return ResponseEntity.status(401).body(error);
        }
    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        try {
            org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            String newPassword = request.get("newPassword");

            if (newPassword == null || newPassword.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Le nouveau mot de passe ne peut pas être vide");
                return ResponseEntity.badRequest().body(error);
            }

            if (newPassword.length() < 14) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Le mot de passe doit contenir au moins 14 caractères");
                return ResponseEntity.badRequest().body(error);
            }

            if (!newPassword.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{14,}$")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre");
                return ResponseEntity.badRequest().body(error);
            }

            authService.changePassword(email, newPassword);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Mot de passe modifié avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors du changement de mot de passe");
            return ResponseEntity.status(500).body(error);
        }
    }
}
