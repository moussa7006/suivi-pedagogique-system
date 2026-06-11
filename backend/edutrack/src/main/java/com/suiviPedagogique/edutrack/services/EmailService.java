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

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        if (fromAddress != null && !fromAddress.isBlank()) {
            message.setFrom(fromAddress);
        }
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
