package com.suiviPedagogique.edutrack.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Désactivation de la protection CSRF
                .csrf(csrf -> csrf.disable())

                // Configuration des autorisations d'URL
                .authorizeHttpRequests(auth -> auth
                        // Autorisation des accès public aux routes de Swagger
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Connection requise pour toutes les autres requetes
                        .anyRequest().authenticated()
                )

                // 3. Activation de l'authentification basique pour pouvoir tester le reste de l'API
                .httpBasic(Customizer.withDefaults());

        return http.build();

    }
}
