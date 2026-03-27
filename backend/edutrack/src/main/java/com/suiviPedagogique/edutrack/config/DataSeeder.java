package com.suiviPedagogique.edutrack.config;

import com.suiviPedagogique.edutrack.Entities.Administrateur;
import com.suiviPedagogique.edutrack.repositories.AdministrateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initDatabase(AdministrateurRepository administrateurRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (administrateurRepository.count() == 0) {
                Administrateur admin = new Administrateur();
                admin.setNom("KEITA");
                admin.setPrenom("Moussa Balla");
                admin.setEmail("moussa.b.keita223@gmail.com");
                admin.setMotDePasse(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                admin.setAdresse("Bacodjicoroni ACI");
                admin.setTelephone("70 06 01 45");
                admin.setMatricule("2026-ADM-001");
                administrateurRepository.save(admin);
                System.out.println("=== Compte Administrateur par défaut créé (moussa.b.keita223@gmail.com / admin123) ===");
            }
        };
    }
}
