package com.suiviPedagogique.edutrack.security;

import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ForcePasswordChangeFilter extends OncePerRequestFilter {

    private final UtilisateurRepository utilisateurRepository;

    public ForcePasswordChangeFilter(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || isAllowedPath(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getName() != null) {
            Utilisateur utilisateur = utilisateurRepository.findByEmail(authentication.getName()).orElse(null);
            if (utilisateur != null
                    && utilisateur.getRole() == Role.ENSEIGNANT
                    && Boolean.TRUE.equals(utilisateur.getForcePasswordChange())) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\":\"Changement de mot de passe obligatoire avant de continuer\",\"forcePasswordChange\":true}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAllowedPath(String uri) {
        return uri.startsWith("/api/auth/login")
                || uri.startsWith("/api/auth/change-password")
                || uri.startsWith("/api/auth/forgot-password")
                || uri.startsWith("/api/auth/reset-password")
                || uri.startsWith("/v3/api-docs")
                || uri.startsWith("/swagger-ui")
                || uri.equals("/swagger-ui.html");
    }
}
