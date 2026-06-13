package com.suiviPedagogique.edutrack.config;

import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initDatabase(UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed-admin.enabled}") boolean seedAdminEnabled,
            @Value("${app.seed-admin.reset-existing}") boolean resetExistingAdmin,
            @Value("${app.seed-admin.email}") String adminEmail,
            @Value("${app.seed-admin.password}") String adminPassword,
            @Value("${app.seed-admin.nom}") String adminNom,
            @Value("${app.seed-admin.prenom}") String adminPrenom,
            @Value("${app.seed-admin.matricule}") String adminMatricule,
            @Value("${app.seed-admin.telephone}") String adminTelephone,
            @Value("${app.seed-admin.adresse}") String adminAdresse) {
        return args -> {
            if (!seedAdminEnabled) {
                return;
            }

            Optional<Utilisateur> existingAdmin = utilisateurRepository.findByEmail(adminEmail);
            if (existingAdmin.isEmpty()) {
                existingAdmin = utilisateurRepository.findByMatricule(adminMatricule);
            }

            if (existingAdmin.isPresent()) {
                if (resetExistingAdmin) {
                    Utilisateur admin = existingAdmin.get();
                    applyAdminSeedData(admin, passwordEncoder, adminEmail, adminPassword, adminNom, adminPrenom,
                            adminMatricule, adminTelephone, adminAdresse);
                    utilisateurRepository.save(admin);
                    System.out.println("=== Compte Administrateur par defaut reinitialise (" + adminEmail + ") ===");
                }
                return;
            }

            Utilisateur admin = new Utilisateur();
            applyAdminSeedData(admin, passwordEncoder, adminEmail, adminPassword, adminNom, adminPrenom,
                    adminMatricule, adminTelephone, adminAdresse);
            utilisateurRepository.save(admin);
            System.out.println("=== Compte Administrateur par defaut cree (" + adminEmail + ") ===");
        };
    }

    private void applyAdminSeedData(Utilisateur admin,
                                    PasswordEncoder passwordEncoder,
                                    String adminEmail,
                                    String adminPassword,
                                    String adminNom,
                                    String adminPrenom,
                                    String adminMatricule,
                                    String adminTelephone,
                                    String adminAdresse) {
        admin.setNom(adminNom);
        admin.setPrenom(adminPrenom);
        admin.setEmail(adminEmail);
        admin.setMotDePasse(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMINISTRATEUR);
        admin.setAdresse(adminAdresse);
        admin.setTelephone(adminTelephone);
        admin.setMatricule(adminMatricule);
        admin.setActif(true);
        admin.setForcePasswordChange(false);
    }
}
