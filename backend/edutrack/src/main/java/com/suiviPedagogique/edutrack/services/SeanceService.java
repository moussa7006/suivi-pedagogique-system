package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.QrSalleDisplayDto;
import com.suiviPedagogique.edutrack.Dto.SeanceDto;
import com.suiviPedagogique.edutrack.Entities.*;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SeanceService {

    @Autowired
    private SeanceRepository seanceRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private ClasseRepository classeRepository;

    @Autowired
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Autowired
    private EmargementRepository emargementRepository;

    @Autowired
    private FicheProgressionRepository ficheProgressionRepository;

    @Autowired
    private SalleRepository salleRepository;

    @Autowired
    private QRCodeRepository qrCodeRepository;

    private Utilisateur getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public SeanceDto createSeance(SeanceDto dto) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut créer des séances");
        }

        Seance seance = new Seance();
        hydrateSeance(seance, dto, null);

        Seance saved = seanceRepository.save(seance);
        return convertToDto(saved);
    }

    public SeanceDto updateSeance(Integer id, SeanceDto dto) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut modifier des séances");
        }

        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));

        hydrateSeance(seance, dto, id);

        Seance updated = seanceRepository.save(seance);
        return convertToDto(updated);
    }

    private void hydrateSeance(Seance seance, SeanceDto dto, Integer seanceId) {
        seance.setDateCours(dto.getDateCours());
        seance.setHeureDebutReelle(dto.getHeureDebutReelle());
        seance.setHeureFinReelle(dto.getHeureFinReelle());
        seance.setStatut(dto.getStatut());

        if (dto.getSalleId() != null) {
            Salle salle = salleRepository.findById(dto.getSalleId())
                    .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
            seance.setSalle(salle);
        }

        if (dto.getEnseignantId() != null) {
            Enseignant enseignant = enseignantRepository.findById(dto.getEnseignantId())
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
            checkProfAvailability(enseignant, dto, seanceId);
            seance.setEnseignant(enseignant);
        }

        if (dto.getEmploiDuTempsId() != null) {
            EmploiDuTemps emploiDuTemps = emploiDuTempsRepository.findById(dto.getEmploiDuTempsId())
                    .orElseThrow(() -> new RuntimeException("Emploi du temps non trouvé"));
            seance.setEmploiDuTemps(emploiDuTemps);
            if (emploiDuTemps.getClasse() != null) {
                seance.setClasse(emploiDuTemps.getClasse());
            }
        }

        if (dto.getClasseId() != null) {
            Classe classe = classeRepository.findById(dto.getClasseId())
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
            seance.setClasse(classe);
        }

        if (dto.getEmargementId() != null) {
            Emargement emargement = emargementRepository.findById(dto.getEmargementId())
                    .orElseThrow(() -> new RuntimeException("Emargement non trouvé"));
            seance.setEmargement(emargement);
        }

        if (dto.getFicheProgressionId() != null) {
            FicheProgression ficheProgression = ficheProgressionRepository.findById(dto.getFicheProgressionId())
                    .orElseThrow(() -> new RuntimeException("Fiche de progression non trouvée"));
            seance.setFicheProgression(ficheProgression);
        }
    }

    public void deleteSeance(Integer id) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut supprimer des séances");
        }

        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));
        seanceRepository.delete(seance);
    }

    public List<SeanceDto> getAllSeances() {
        Utilisateur currentUser = getCurrentUser();
        List<Seance> seances;
        if (currentUser.getRole() == Role.ADMINISTRATEUR) {
            seances = seanceRepository.findAll();
        } else if (currentUser.getRole() == Role.ENSEIGNANT) {
            seances = seanceRepository.findByEnseignantId(currentUser.getId());
        } else {
            throw new AccessDeniedException("Rôle non autorisé");
        }
        return seances.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public SeanceDto getSeanceById(Integer id) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));

        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() == Role.ENSEIGNANT && !seance.getEnseignant().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Vous ne pouvez voir que vos propres séances");
        }

        return convertToDto(seance);
    }

    @Transactional
    public SeanceDto generateQrCode(Integer id) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut générer un QR code");
        }

        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));

        validateNoActiveQrOverlapForTeacher(seance);

        QRCode qrCode = seance.getQrCode();
        if (qrCode == null) {
            qrCode = new QRCode();
        }

        qrCode.setCode(UUID.randomUUID().toString());
        qrCode.setDateHeureCreation(LocalDateTime.now());
        qrCode.setDateHeureExpiration(LocalDateTime.of(seance.getDateCours(), seance.getHeureFinReelle()));
        qrCode.setEstValide(true);

        qrCodeRepository.save(qrCode);
        seance.setQrCode(qrCode);
        return convertToDto(seanceRepository.save(seance));
    }

    public QrSalleDisplayDto getQrCodeActifPourSalle(String tokenAffichage) {
        Salle salle = salleRepository.findByTokenAffichage(tokenAffichage)
                .orElseThrow(() -> new RuntimeException("Écran de salle non autorisé"));

        List<Seance> seances = seanceRepository.findActiveQrCodesBySalle(
                salle.getId(),
                LocalDate.now(),
                LocalTime.now(),
                LocalDateTime.now()
        );

        if (seances.isEmpty()) {
            return null;
        }

        Seance seance = seances.get(0);
        return new QrSalleDisplayDto(
                seance.getId(),
                salle.getId(),
                salle.getNom(),
                seance.getQrCode().getCode(),
                seance.getQrCode().getDateHeureExpiration(),
                seance.getEnseignant() != null
                        ? seance.getEnseignant().getPrenom() + " " + seance.getEnseignant().getNom()
                        : null,
                seance.getClasse() != null ? seance.getClasse().getLibelle() : null
        );
    }

    public SeanceDto getQrCode(Integer id) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));

        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() == Role.ENSEIGNANT && !seance.getEnseignant().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Vous ne pouvez voir que vos propres QR codes");
        }

        if (seance.getQrCode() == null) {
            throw new RuntimeException("Aucun QR code généré pour cette séance");
        }

        return convertToDto(seance);
    }

    private SeanceDto convertToDto(Seance seance) {
        SeanceDto dto = new SeanceDto();
        dto.setId(seance.getId());
        dto.setDateCours(seance.getDateCours());
        dto.setHeureDebutReelle(seance.getHeureDebutReelle());
        dto.setHeureFinReelle(seance.getHeureFinReelle());
        dto.setStatut(seance.getStatut());

        if (seance.getSalle() != null) {
            dto.setSalleId(seance.getSalle().getId());
        }
        if (seance.getQrCode() != null) {
            dto.setQrCodeId(seance.getQrCode().getId());
            dto.setQrCodeToken(seance.getQrCode().getCode());
        }
        if (seance.getEnseignant() != null) {
            dto.setEnseignantId(seance.getEnseignant().getId());
        }
        if (seance.getClasse() != null) {
            dto.setClasseId(seance.getClasse().getId());
        }
        if (seance.getEmploiDuTemps() != null) {
            dto.setEmploiDuTempsId(seance.getEmploiDuTemps().getId());
        }
        if (seance.getEmargement() != null) {
            dto.setEmargementId(seance.getEmargement().getId());
        }
        if (seance.getFicheProgression() != null) {
            dto.setFicheProgressionId(seance.getFicheProgression().getId());
        }
        return dto;
    }

    private void checkProfAvailability(Enseignant enseignant, SeanceDto dto, Integer excludeId) {
        if (dto.getDateCours() == null || dto.getHeureDebutReelle() == null || dto.getHeureFinReelle() == null) {
            return;
        }

        List<Seance> overlaps = seanceRepository.findOverlappingSeancesForTeacher(
                enseignant.getId(),
                dto.getDateCours(),
                dto.getHeureDebutReelle(),
                dto.getHeureFinReelle(),
                excludeId
        );

        if (!overlaps.isEmpty()) {
            throw new RuntimeException("L'enseignant a déjà une séance programmée sur ce créneau horaire le " + dto.getDateCours() + ".");
        }
    }

    private void validateNoActiveQrOverlapForTeacher(Seance seance) {
        if (seance.getEnseignant() == null || seance.getDateCours() == null
                || seance.getHeureDebutReelle() == null || seance.getHeureFinReelle() == null) {
            throw new RuntimeException("La séance est incomplète : impossible de générer un QR code.");
        }

        List<Seance> overlaps = seanceRepository.findOverlappingSeancesWithActiveQrForTeacher(
                seance.getEnseignant().getId(),
                seance.getDateCours(),
                seance.getHeureDebutReelle(),
                seance.getHeureFinReelle(),
                seance.getId(),
                LocalDateTime.now()
        );

        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Impossible de générer le QR code : cet enseignant possède déjà un QR code actif sur un autre cours simultané.");
        }
    }
}
