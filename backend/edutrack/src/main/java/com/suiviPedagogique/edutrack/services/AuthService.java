package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.LoginRequest;
import com.suiviPedagogique.edutrack.Dto.RegistrationRequest;
import com.suiviPedagogique.edutrack.Entities.Enseignant;
import com.suiviPedagogique.edutrack.Entities.PasswordResetCode;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.EnseignantRepository;
import com.suiviPedagogique.edutrack.repositories.PasswordResetCodeRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import com.suiviPedagogique.edutrack.security.PasswordPolicy;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final int RESET_CODE_EXPIRATION_MINUTES = 10;
    private static final int MAX_RESET_ATTEMPTS = 5;

    private final EnseignantRepository enseignantRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordResetCodeRepository passwordResetCodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(EnseignantRepository enseignantRepository,
                       UtilisateurRepository utilisateurRepository,
                       PasswordResetCodeRepository passwordResetCodeRepository,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.enseignantRepository = enseignantRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordResetCodeRepository = passwordResetCodeRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public Utilisateur inscription(RegistrationRequest requestdto) {
        String email = normalizeEmail(requestdto.getEmail());
        requestdto.setEmail(email);

        if (utilisateurRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Erreur : Cet email est déjà utilisé !");
        }

        if (requestdto.getTelephone() != null && !requestdto.getTelephone().trim().isEmpty()
                && utilisateurRepository.findByTelephone(requestdto.getTelephone().trim()).isPresent()) {
            throw new RuntimeException("Erreur : Ce numéro de téléphone est déjà utilisé !");
        }

        validatePassword(requestdto.getMotDePasse());
        String motDePasseCrypte = passwordEncoder.encode(requestdto.getMotDePasse());
        String roleDemande = requestdto.getRole().toUpperCase();

        if (roleDemande.equals("ADMIN") || roleDemande.equals("ADMINISTRATEUR")) {
            Utilisateur admin = new Utilisateur();
            requestdto.setMatricule(genererMatricule(Role.ADMINISTRATEUR));
            remplirDonneesDeBase(admin, requestdto, motDePasseCrypte);
            admin.setRole(Role.ADMINISTRATEUR);
            admin.setForcePasswordChange(false);
            return utilisateurRepository.save(admin);

        } else if (roleDemande.equals("ENSEIGNANT")) {
            Enseignant enseignant = new Enseignant();
            requestdto.setMatricule(genererMatricule(Role.ENSEIGNANT));
            remplirDonneesDeBase(enseignant, requestdto, motDePasseCrypte);
            enseignant.setRole(Role.ENSEIGNANT);
            enseignant.setForcePasswordChange(true);
            enseignant.setSpecialite(requestdto.getSpecialite() != null ? requestdto.getSpecialite() : "Non spécifié");
            enseignant.setDateEmbauche(requestdto.getDateEmbauche() != null ? requestdto.getDateEmbauche() : LocalDate.now());
            enseignant.setGrade(requestdto.getGrade() != null ? requestdto.getGrade() : "Non spécifié");
            return enseignantRepository.save(enseignant);

        } else {
            throw new IllegalArgumentException("Erreur : Rôle non valide. Utilisez ADMIN ou ENSEIGNANT.");
        }
    }

    public String genererMatricule(Role role) {
        String prefix = role == Role.ADMINISTRATEUR ? "INTEC-ADM-" : "INTEC-ENS-";
        String matricule;
        do {
            int randomDigits = 1000 + secureRandom.nextInt(9000); // 1000 to 9999
            matricule = prefix + randomDigits;
        } while (utilisateurRepository.findByMatricule(matricule).isPresent());
        return matricule;
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
        Utilisateur utilisateur = utilisateurRepository.findByEmail(normalizeEmail(loginRequest.getEmail()))
                .orElseThrow(() -> new RuntimeException("Identifiants invalides"));
        boolean match = passwordEncoder.matches(loginRequest.getMotDePasse(), utilisateur.getMotDePasse());
        if (!match) {
            throw new RuntimeException("Identifiants invalides");
        }
        return utilisateur;
    }

    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        validatePassword(newPassword);

        Utilisateur utilisateur = utilisateurRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(currentPassword, utilisateur.getMotDePasse())) {
            throw new RuntimeException("L'ancien mot de passe est incorrect");
        }

        if (passwordEncoder.matches(newPassword, utilisateur.getMotDePasse())) {
            throw new RuntimeException("Le nouveau mot de passe doit être différent de l'ancien");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateur.setForcePasswordChange(false);
        utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public void createPasswordResetCode(String email) {
        utilisateurRepository.findByEmail(normalizeEmail(email)).ifPresent(utilisateur -> {
            passwordResetCodeRepository.deleteByUtilisateur(utilisateur);

            String code = generateSixDigitCode();
            PasswordResetCode resetCode = new PasswordResetCode();
            resetCode.setCodeHash(passwordEncoder.encode(code));
            resetCode.setUtilisateur(utilisateur);
            resetCode.setExpiresAt(LocalDateTime.now().plusMinutes(RESET_CODE_EXPIRATION_MINUTES));
            resetCode.setAttempts(0);
            passwordResetCodeRepository.save(resetCode);

            emailService.sendPasswordResetCode(utilisateur.getEmail(), code);
        });
    }

    @Transactional
    public void resetPassword(String email, String code, String newPassword) {
        validatePassword(newPassword);

        Utilisateur utilisateur = utilisateurRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new RuntimeException("Code de réinitialisation invalide ou expiré"));

        PasswordResetCode resetCode = passwordResetCodeRepository.findFirstByUtilisateurOrderByExpiresAtDesc(utilisateur)
                .orElseThrow(() -> new RuntimeException("Code de réinitialisation invalide ou expiré"));

        if (resetCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            passwordResetCodeRepository.delete(resetCode);
            throw new RuntimeException("Code de réinitialisation invalide ou expiré");
        }

        if (resetCode.getAttempts() >= MAX_RESET_ATTEMPTS) {
            passwordResetCodeRepository.delete(resetCode);
            throw new RuntimeException("Nombre de tentatives dépassé. Demandez un nouveau code.");
        }

        if (!passwordEncoder.matches(code, resetCode.getCodeHash())) {
            resetCode.setAttempts(resetCode.getAttempts() + 1);
            passwordResetCodeRepository.save(resetCode);
            throw new RuntimeException("Code de réinitialisation invalide ou expiré");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateur.setForcePasswordChange(false);
        utilisateurRepository.save(utilisateur);
        passwordResetCodeRepository.delete(resetCode);
    }

    private String generateSixDigitCode() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }

    private void validatePassword(String password) {
        if (!PasswordPolicy.isValid(password)) {
            throw new RuntimeException(PasswordPolicy.MESSAGE);
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
