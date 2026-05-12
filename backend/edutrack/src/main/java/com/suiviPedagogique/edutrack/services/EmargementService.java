package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.EmargementRequest;
import com.suiviPedagogique.edutrack.Entities.Emargement;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.Entities.enums.StatutEmargement;
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
import java.util.List;
import java.util.stream.Collectors;
import com.suiviPedagogique.edutrack.Dto.EmargementDto;

@Service
public class EmargementService {

    @Autowired
    private SeanceRepository seanceRepository;

    @Autowired
    private EmargementRepository emargementRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    private static final double ECOLE_LAT = 12.6392; // Bamako, Mali
    private static final double ECOLE_LON = -8.0029;
    private static final double MAX_DISTANCE_KM = 0.5;

    public Emargement faireEmargement(EmargementRequest request) {
        Seance seance = seanceRepository.findByTokenQRCode(request.getTokenQRCode())
                .orElseThrow(() -> new RuntimeException("QR Code invalide ou séance inexistante."));

        if (seance.getQrCode() == null || Boolean.FALSE.equals(seance.getQrCode().getEstValide())) {
            throw new RuntimeException("QR Code expiré ou désactivé.");
        }
        if (seance.getQrCode().getDateHeureExpiration().isBefore(LocalDateTime.now())) {
            seance.getQrCode().setEstValide(false);
            throw new RuntimeException("QR Code expiré.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Utilisateur currentUser = utilisateurRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié."));

        if (seance.getEnseignant() == null || !seance.getEnseignant().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas l'enseignant assigné à cette séance.");
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (!seance.getDateCours().equals(today)) {
            throw new RuntimeException("La séance n'est pas prévue pour aujourd'hui.");
        }
        if (now.isBefore(seance.getHeureDebutReelle()) || now.isAfter(seance.getHeureFinReelle())) {
            throw new RuntimeException("L'émargement doit se faire pendant les heures de la séance.");
        }

        double enseignantLat = request.getLatitude() != null ? request.getLatitude().doubleValue() : 0.0;
        double enseignantLon = request.getLongitude() != null ? request.getLongitude().doubleValue() : 0.0;

        double distance = calculateDistanceInKilometers(enseignantLat, enseignantLon, ECOLE_LAT, ECOLE_LON);
        if (distance > MAX_DISTANCE_KM) {
            throw new RuntimeException("Échec de la géolocalisation. Vous êtes trop loin de l'école (" + Math.round(distance * 1000) + "m).");
        }

        Emargement emargement = seance.getEmargement();
        if (emargement == null) {
            emargement = new Emargement();
        } else if (emargement.getStatut() == StatutEmargement.VALIDE) {
            throw new RuntimeException("Émargement déjà effectué pour cette séance.");
        }

        emargement.setDateHeureScan(LocalDateTime.now());
        emargement.setLatitude(request.getLatitude());
        emargement.setLongitude(request.getLongitude());
        emargement.setAdresseApproximative(request.getAdresseApproximative() != null ? request.getAdresseApproximative() : "QR Code");
        emargement.setStatut(StatutEmargement.VALIDE);
        emargement.setEnseignant(seance.getEnseignant());
        emargement.setSeance(seance);

        emargementRepository.save(emargement);
        seance.setEmargement(emargement);
        seanceRepository.save(seance);

        return emargement;
    }

    private double calculateDistanceInKilometers(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<EmargementDto> getAllEmargements() {
        return emargementRepository.findAll().stream().map(e -> {
            EmargementDto dto = new EmargementDto();
            dto.setId(e.getId());
            dto.setDateHeureScan(e.getDateHeureScan());
            dto.setLatitude(e.getLatitude());
            dto.setLongitude(e.getLongitude());
            dto.setAdresseApproximative(e.getAdresseApproximative());
            dto.setStatut(e.getStatut());

            Seance seance = e.getSeance();
            if (seance != null) {
                if (seance.getEnseignant() != null) {
                    dto.setEnseignantNomPrenom(seance.getEnseignant().getPrenom() + " " + seance.getEnseignant().getNom());
                }
                if (seance.getSalle() != null) {
                    dto.setLieu(seance.getSalle().getNom());
                }
                dto.setHeureSeance(seance.getHeureDebutReelle() + " - " + seance.getHeureFinReelle());
            }
            return dto;
        }).collect(Collectors.toList());
    }
}
