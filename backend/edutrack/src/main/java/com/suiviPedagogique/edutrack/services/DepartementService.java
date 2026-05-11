package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.DepartementDto;
import com.suiviPedagogique.edutrack.Entities.Departement;
import com.suiviPedagogique.edutrack.repositories.DepartementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartementService {

    private final DepartementRepository departementRepository;

    public DepartementService(DepartementRepository departementRepository) {
        this.departementRepository = departementRepository;
    }

    public List<DepartementDto> getAll() {
        return departementRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public DepartementDto getById(Integer id) {
        return toDto(departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département non trouvé")));
    }

    public DepartementDto create(DepartementDto dto) {
        Departement departement = new Departement();
        departement.setLibelle(dto.getLibelle());
        return toDto(departementRepository.save(departement));
    }

    public DepartementDto update(Integer id, DepartementDto dto) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département non trouvé"));
        if (dto.getLibelle() != null) {
            departement.setLibelle(dto.getLibelle());
        }
        return toDto(departementRepository.save(departement));
    }

    public void delete(Integer id) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département non trouvé"));
        departementRepository.delete(departement);
    }

    private DepartementDto toDto(Departement departement) {
        return new DepartementDto(departement.getId(), departement.getLibelle());
    }
}
