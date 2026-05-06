package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.LoginRequest;
import com.suiviPedagogique.edutrack.Dto.RegistrationRequest;
import com.suiviPedagogique.edutrack.Entities.Enseignant;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.EnseignantRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {

    private final EnseignantRepository enseignantRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(EnseignantRepository enseignantRepository,
                       UtilisateurRepository utilisateurRepository,
                       PasswordEncoder passwordEncoder) {
        this.enseignantRepository = enseignantRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Utilisateur inscription(RegistrationRequest requestdto) {

        // Vérification de l'existence de l'email
        if (utilisateurRepository.findByEmail(requestdto.getEmail()).isPresent()) {
            throw new RuntimeException("Erreur : Cet email est déjà utilisé !");
        }

        // Vérification de l'existence du matricule
        if (utilisateurRepository.findByMatricule(requestdto.getMatricule()).isPresent()) {
            throw new RuntimeException("Erreur : Ce matricule est déjà utilisé !");
        }

        // Vérification de l'existence du téléphone
        if (requestdto.getTelephone() != null && !requestdto.getTelephone().trim().isEmpty()
                && utilisateurRepository.findByTelephone(requestdto.getTelephone().trim()).isPresent()) {
            throw new RuntimeException("Erreur : Ce numéro de téléphone est déjà utilisé !");
        }

        // Cryptage du mot de passe
        String motDePasseCrypte = passwordEncoder.encode(requestdto.getMotDePasse());

        // Création polymorphe selon le rôle
        String roleDemande = requestdto.getRole().toUpperCase();

        if (roleDemande.equals("ADMIN") || roleDemande.equals("ADMINISTRATEUR")) {
            Utilisateur admin = new Utilisateur();
            remplirDonneesDeBase(admin, requestdto, motDePasseCrypte);
            admin.setRole(Role.ADMINISTRATEUR);
            return utilisateurRepository.save(admin);

        } else if (roleDemande.equals("ENSEIGNANT")) {
            Enseignant enseignant = new Enseignant();
            remplirDonneesDeBase(enseignant, requestdto, motDePasseCrypte);
            enseignant.setRole(Role.ENSEIGNANT);
            enseignant.setSpecialite(requestdto.getSpecialite() != null ? requestdto.getSpecialite() : "Non spécifié");
            enseignant.setDateEmbauche(requestdto.getDateEmbauche() != null ? requestdto.getDateEmbauche() : LocalDate.now());
            enseignant.setGrade(requestdto.getGrade() != null ? requestdto.getGrade() : "Non spécifié");
            return enseignantRepository.save(enseignant);

        } else {
            throw new IllegalArgumentException("Erreur : Rôle non valide. Utilisez ADMIN ou ENSEIGNANT.");
        }
    }

    private void remplirDonneesDeBase(Utilisateur utilisateur, RegistrationRequest request, String mdpCrypte) {
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMatricule(request.getMatricule());
        utilisateur.setTelephone(request.getTelephone());
        utilisateur.setAdresse(request.getAdresse());
        utilisateur.setMotDePasse(mdpCrypte);
        utilisateur.setActif(true);
        utilisateur.setForcePasswordChange(false);
    }

    public Utilisateur authentifier(LoginRequest loginRequest) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Identifiants invalides"));
        boolean match = passwordEncoder.matches(loginRequest.getMotDePasse(), utilisateur.getMotDePasse());
        if (!match) {
            throw new RuntimeException("Identifiants invalides");
        }
        return utilisateur;
    }

    @Transactional
    public void changePassword(String email, String newPassword) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateur.setForcePasswordChange(false);
        utilisateurRepository.save(utilisateur);
    }
}
