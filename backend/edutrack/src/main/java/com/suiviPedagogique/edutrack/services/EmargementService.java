package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.EmargementRequest;
import com.suiviPedagogique.edutrack.Entities.Emargement;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.repositories.EmargementRepository;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class EmargementService {

    @Autowired
    private SeanceRepository seanceRepository;

    @Autowired
    private EmargementRepository emargementRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // Coordonnées de l'école (exemple fictif, à ajuster)
    private static final double ECOLE_LAT = 36.7525;
    private static final double ECOLE_LON = 3.04197;
    private static final double MAX_DISTANCE_KM = 0.5; // 500 mètres de tolérance

    public String faireEmargement(EmargementRequest request) {
        // 1. Trouver la séance par le QR code
        Seance seance = seanceRepository.findByTokenQRCode(request.getTokenQRCode())
                .orElseThrow(() -> new RuntimeException("QR Code invalide ou séance inexistante."));

        // 2. Vérifier que c'est bien l'enseignant de cette séance
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Utilisateur currentUser = utilisateurRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié."));
        
        if (seance.getEnseignant() == null || !seance.getEnseignant().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas l'enseignant assigné à cette séance.");
        }

        // 3. Vérification temporelle
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (!seance.getDate().equals(today)) {
            throw new RuntimeException("La séance n'est pas prévue pour aujourd'hui.");
        }
        if (now.isBefore(seance.getHeureDebut()) || now.isAfter(seance.getHeureFin())) {
            throw new RuntimeException("L'émargement doit se faire pendant les heures de la séance.");
        }

        // 4. Vérification GPS (formule de Haversine)
        double enseignantLat = Double.parseDouble(request.getLatitudeGPS());
        double enseignantLon = Double.parseDouble(request.getLongitudeGPS());

        double distance = calculateDistanceInKilometers(enseignantLat, enseignantLon, ECOLE_LAT, ECOLE_LON);
        if (distance > MAX_DISTANCE_KM) {
            throw new RuntimeException("Échec de la géolocalisation. Vous êtes trop loin de l'école (" + Math.round(distance * 1000) + "m).");
        }

        // 5. Valider l'émargement
        Emargement emargement = seance.getEmargement();
        if (emargement == null) {
            emargement = new Emargement();
        } else if (Boolean.TRUE.equals(emargement.getEstLocalisee())) {
            throw new RuntimeException("Émargement déjà effectué pour cette séance.");
        }
        
        emargement.setDateHeureScan(LocalDateTime.now());
        emargement.setLatitudeGPS(request.getLatitudeGPS());
        emargement.setLongitudeGPS(request.getLongitudeGPS());
        emargement.setEstLocalisee(true);

        emargementRepository.save(emargement);
        seance.setEmargement(emargement);
        seanceRepository.save(seance);

        return "Émargement validé avec succès !";
    }

    private double calculateDistanceInKilometers(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
