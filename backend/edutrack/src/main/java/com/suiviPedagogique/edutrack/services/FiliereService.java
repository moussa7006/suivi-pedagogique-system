package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.FiliereDto;
import com.suiviPedagogique.edutrack.Entities.Departement;
import com.suiviPedagogique.edutrack.Entities.Filiere;
import com.suiviPedagogique.edutrack.repositories.DepartementRepository;
import com.suiviPedagogique.edutrack.repositories.FiliereRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FiliereService {

    private final FiliereRepository filiereRepository;
    private final DepartementRepository departementRepository;

    public FiliereService(FiliereRepository filiereRepository, DepartementRepository departementRepository) {
        this.filiereRepository = filiereRepository;
        this.departementRepository = departementRepository;
    }

    public List<FiliereDto> getAllFilieres() {
        return filiereRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public FiliereDto getFiliereById(Integer id) {
        Filiere filiere = filiereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filière non trouvée"));
        return convertToDto(filiere);
    }

    public FiliereDto createFiliere(FiliereDto dto) {
        Filiere filiere = new Filiere();
        filiere.setLibelle(dto.getLibelle());

        if (dto.getDepartementId() != null) {
            Departement departement = departementRepository.findById(dto.getDepartementId())
                    .orElseThrow(() -> new RuntimeException("Département non trouvé"));
            filiere.setDepartement(departement);
        }

        Filiere saved = filiereRepository.save(filiere);
        return convertToDto(saved);
    }

    public FiliereDto updateFiliere(Integer id, FiliereDto dto) {
        Filiere filiere = filiereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filière non trouvée"));

        if (dto.getLibelle() != null) filiere.setLibelle(dto.getLibelle());

        if (dto.getDepartementId() != null) {
            Departement departement = departementRepository.findById(dto.getDepartementId())
                    .orElseThrow(() -> new RuntimeException("Département non trouvé"));
            filiere.setDepartement(departement);
        }

        Filiere updated = filiereRepository.save(filiere);
        return convertToDto(updated);
    }

    public void deleteFiliere(Integer id) {
        Filiere filiere = filiereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filière non trouvée"));
        filiereRepository.delete(filiere);
    }

    private FiliereDto convertToDto(Filiere filiere) {
        FiliereDto dto = new FiliereDto();
        dto.setId(filiere.getId());
        dto.setLibelle(filiere.getLibelle());
        if (filiere.getDepartement() != null) {
            dto.setDepartementId(filiere.getDepartement().getId());
            dto.setDepartementLibelle(filiere.getDepartement().getLibelle());
        }
        return dto;
    }
}
