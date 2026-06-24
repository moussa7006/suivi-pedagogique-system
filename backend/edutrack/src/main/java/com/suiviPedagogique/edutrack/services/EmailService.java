package com.suiviPedagogique.edutrack.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetCode(String to, String code) {
        if (fromAddress == null || fromAddress.isBlank() || mailPassword == null || mailPassword.isBlank()) {
            System.out.println("[DEV] SMTP non configuré. Code de réinitialisation EduTrack pour " + to + " : " + code);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject("Code de réinitialisation EduTrack");
        message.setText("Bonjour,\n\n"
                + "Vous avez demandé la réinitialisation de votre mot de passe EduTrack.\n\n"
                + "Votre code de réinitialisation est : " + code + "\n\n"
                + "Ce code expire dans 10 minutes.\n\n"
                + "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.\n\n"
                + "EduTrack");
        mailSender.send(message);
    }
}
