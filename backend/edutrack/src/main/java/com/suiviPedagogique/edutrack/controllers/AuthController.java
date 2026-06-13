package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.ChangePasswordRequest;
import com.suiviPedagogique.edutrack.Dto.ForgotPasswordRequest;
import com.suiviPedagogique.edutrack.Dto.LoginRequest;
import com.suiviPedagogique.edutrack.Dto.RegistrationRequest;
import com.suiviPedagogique.edutrack.Dto.ResetPasswordRequest;
import com.suiviPedagogique.edutrack.Entities.Enseignant;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.security.JwtUtil;
import com.suiviPedagogique.edutrack.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest request) {
        try {
            Utilisateur nouvelUtilisateur = authService.inscription(request);
            Map<String, Object> response = new HashMap<>();
            response.put("id", nouvelUtilisateur.getId());
            response.put("matricule", nouvelUtilisateur.getMatricule());
            response.put("nom", nouvelUtilisateur.getNom());
            response.put("prenom", nouvelUtilisateur.getPrenom());
            response.put("email", nouvelUtilisateur.getEmail());
            response.put("telephone", nouvelUtilisateur.getTelephone());
            response.put("adresse", nouvelUtilisateur.getAdresse());
            response.put("role", nouvelUtilisateur.getRole());
            response.put("actif", nouvelUtilisateur.getActif());
            response.put("photoUrl", nouvelUtilisateur.getPhotoUrl());
            response.put("forcePasswordChange", nouvelUtilisateur.getForcePasswordChange());

            if (nouvelUtilisateur instanceof Enseignant enseignant) {
                response.put("specialite", enseignant.getSpecialite());
                response.put("dateEmbauche", enseignant.getDateEmbauche());
                response.put("grade", enseignant.getGrade());
            }

            response.put("message", "Succès ! Utilisateur inscrit.");
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            return conflict(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
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
            response.put("photoUrl", utilisateur.getPhotoUrl());
            response.put("forcePasswordChange", utilisateur.getForcePasswordChange() != null ? utilisateur.getForcePasswordChange() : false);

            if (utilisateur instanceof Enseignant enseignant) {
                response.put("specialite", enseignant.getSpecialite());
                response.put("dateEmbauche", enseignant.getDateEmbauche());
                response.put("grade", enseignant.getGrade());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Identifiants invalides");
            return ResponseEntity.status(401).body(error);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            authService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Mot de passe modifié avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            authService.createPasswordResetCode(request.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Si cet email est associé à un compte, un code de réinitialisation a été envoyé.");
            response.put("expiresInMinutes", 10);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return badRequest(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getEmail(), request.getCode(), request.getNewPassword());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Mot de passe réinitialisé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return badRequest(e.getMessage());
        }
    }

    private ResponseEntity<Map<String, String>> conflict(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(409).body(error);
    }

    private ResponseEntity<Map<String, String>> badRequest(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.badRequest().body(error);
    }
}
