package com.suiviPedagogique.edutrack.config;

import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initDatabase(UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (utilisateurRepository.findByEmail("moussa.b.keita223@gmail.com").isEmpty()) {
                Utilisateur admin = new Utilisateur();
                admin.setNom("KEITA");
                admin.setPrenom("Moussa Balla");
                admin.setEmail("moussa.b.keita223@gmail.com");
                admin.setMotDePasse(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMINISTRATEUR);
                admin.setAdresse("Bacodjicoroni ACI");
                admin.setTelephone("70 06 01 45");
                admin.setMatricule("2026-ADM-001");
                admin.setActif(true);
                utilisateurRepository.save(admin);
                System.out.println("=== Compte Administrateur par défaut créé (moussa.b.keita223@gmail.com / admin123) ===");
            }
        };
    }
}
