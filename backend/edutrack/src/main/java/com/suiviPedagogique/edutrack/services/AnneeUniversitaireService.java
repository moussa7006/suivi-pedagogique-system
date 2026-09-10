package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.AnneeUniversitaireDto;
import com.suiviPedagogique.edutrack.Entities.AnneeUniversitaire;
import com.suiviPedagogique.edutrack.repositories.AnneeUniversitaireRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnneeUniversitaireService {

    private final AnneeUniversitaireRepository anneeUniversitaireRepository;

    public AnneeUniversitaireService(AnneeUniversitaireRepository anneeUniversitaireRepository) {
        this.anneeUniversitaireRepository = anneeUniversitaireRepository;
    }

    public List<AnneeUniversitaireDto> getAll() {
        return anneeUniversitaireRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public AnneeUniversitaireDto getById(Integer id) {
        return toDto(anneeUniversitaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Année universitaire non trouvée")));
    }

    public AnneeUniversitaireDto create(AnneeUniversitaireDto dto) {
        AnneeUniversitaire annee = new AnneeUniversitaire();
        hydrate(annee, dto);
        return toDto(anneeUniversitaireRepository.save(annee));
    }

    public AnneeUniversitaireDto update(Integer id, AnneeUniversitaireDto dto) {
        AnneeUniversitaire annee = anneeUniversitaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Année universitaire non trouvée"));
        ensureNotArchived(annee);

        hydrate(annee, dto);
        return toDto(anneeUniversitaireRepository.save(annee));
    }

    public void delete(Integer id) {
        AnneeUniversitaire annee = anneeUniversitaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Année universitaire non trouvée"));
        ensureNotArchived(annee);
        anneeUniversitaireRepository.delete(annee);
    }

    public void archiveYearsThatHaveEnded() {
        LocalDate today = LocalDate.now();
        anneeUniversitaireRepository.findAll().stream()
                .filter(annee -> Boolean.FALSE.equals(annee.getArchivee()))
                .filter(annee -> annee.getDateFin() != null && today.isAfter(annee.getDateFin()))
                .forEach(annee -> {
                    annee.setArchivee(true);
                    annee.setActive(false);
                    anneeUniversitaireRepository.save(annee);
                });
    }

    private void ensureNotArchived(AnneeUniversitaire annee) {
        if (Boolean.TRUE.equals(annee.getArchivee())
                || (annee.getDateFin() != null && LocalDate.now().isAfter(annee.getDateFin()))) {
            throw new IllegalStateException("Cette année universitaire est archivée et ne peut plus être modifiée.");
        }
    }

    private void hydrate(AnneeUniversitaire annee, AnneeUniversitaireDto dto) {
        if (annee.getArchivee() == null) annee.setArchivee(false);
        if (dto.getLibelle() != null) annee.setLibelle(dto.getLibelle());
        if (dto.getDateDebut() != null) annee.setDateDebut(dto.getDateDebut());
        if (dto.getDateFin() != null) annee.setDateFin(dto.getDateFin());

        if (annee.getDateDebut() == null || annee.getDateFin() == null) {
            throw new IllegalArgumentException("Les dates de début et de fin sont obligatoires");
        }
        if (!annee.getDateDebut().isBefore(annee.getDateFin())) {
            throw new IllegalArgumentException("La date de début doit être antérieure à la date de fin");
        }
        if (annee.getDateFin().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La date de fin doit être aujourd'hui ou une date future. Veuillez saisir une date valide.");
        }

        // Vérification de chevauchement
        if (anneeUniversitaireRepository.existsOverlapping(annee.getDateDebut(), annee.getDateFin(), annee.getId())) {
            throw new IllegalArgumentException("L'intervalle de cette année universitaire chevauche une autre année déjà enregistrée.");
        }

        annee.setActive(isActive(annee.getDateDebut(), annee.getDateFin()));
    }

    private boolean isActive(LocalDate dateDebut, LocalDate dateFin) {
        LocalDate today = LocalDate.now();
        return !today.isBefore(dateDebut) && !today.isAfter(dateFin);
    }

    private AnneeUniversitaireDto toDto(AnneeUniversitaire annee) {
        Boolean active = annee.getDateDebut() != null && annee.getDateFin() != null
                ? isActive(annee.getDateDebut(), annee.getDateFin())
                : annee.getActive();

        return new AnneeUniversitaireDto(
                annee.getId(),
                annee.getLibelle(),
                annee.getDateDebut(),
                annee.getDateFin(),
                active,
                Boolean.TRUE.equals(annee.getArchivee())
                        || (annee.getDateFin() != null && LocalDate.now().isAfter(annee.getDateFin()))
        );
    }
}
