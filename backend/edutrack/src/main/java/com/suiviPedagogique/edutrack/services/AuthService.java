package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.LoginRequest;
import com.suiviPedagogique.edutrack.Dto.RegistrationRequest;
import com.suiviPedagogique.edutrack.Entities.Administrateur;
import com.suiviPedagogique.edutrack.Entities.Enseignant;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.repositories.AdministrateurRepository;
import com.suiviPedagogique.edutrack.repositories.EnseignantRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AdministrateurRepository administrateurRepository;
    private final EnseignantRepository enseignantRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AdministrateurRepository administrateurRepository,
                       EnseignantRepository enseignantRepository,
                       UtilisateurRepository utilisateurRepository,
                       PasswordEncoder passwordEncoder) {
        this.administrateurRepository = administrateurRepository;
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

        // Cryptage du mot de passe
        String motDePasseCrypte = passwordEncoder.encode(requestdto.getMotDePasse());

        // Création polymorphe selon le rôle
        String roleDemande = requestdto.getRole().toUpperCase();

        if (roleDemande.equals("ADMIN")) {
            Administrateur admin = new Administrateur();
            remplirDonneesDeBase(admin, requestdto, motDePasseCrypte);
            return administrateurRepository.save(admin);

        } else if (roleDemande.equals("ENSEIGNANT")) {
            Enseignant enseignant = new Enseignant();
            remplirDonneesDeBase(enseignant, requestdto, motDePasseCrypte);
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
        utilisateur.setRole(request.getRole().toUpperCase());
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
}
