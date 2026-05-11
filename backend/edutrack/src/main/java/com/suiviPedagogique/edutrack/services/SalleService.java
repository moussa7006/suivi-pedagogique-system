package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.SalleDto;
import com.suiviPedagogique.edutrack.Entities.Salle;
import com.suiviPedagogique.edutrack.repositories.SalleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SalleService {

    private final SalleRepository salleRepository;

    public SalleService(SalleRepository salleRepository) {
        this.salleRepository = salleRepository;
    }

    public List<SalleDto> getAll() {
        return salleRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public SalleDto getById(Integer id) {
        return toDto(salleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée")));
    }

    public SalleDto create(SalleDto dto) {
        Salle salle = new Salle();
        hydrate(salle, dto);
        return toDto(salleRepository.save(salle));
    }

    public SalleDto update(Integer id, SalleDto dto) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
        hydrate(salle, dto);
        return toDto(salleRepository.save(salle));
    }

    public void delete(Integer id) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
        salleRepository.delete(salle);
    }

    private void hydrate(Salle salle, SalleDto dto) {
        if (dto.getNom() != null) salle.setNom(dto.getNom());
        if (dto.getBatiment() != null) salle.setBatiment(dto.getBatiment());
        if (dto.getCapacite() != null) salle.setCapacite(dto.getCapacite());
        if (dto.getEquipement() != null) salle.setEquipement(dto.getEquipement());
        if (dto.getAdresseIp() != null) salle.setAdresseIp(dto.getAdresseIp());
    }

    private SalleDto toDto(Salle salle) {
        return new SalleDto(
                salle.getId(),
                salle.getNom(),
                salle.getBatiment(),
                salle.getCapacite(),
                salle.getEquipement(),
                salle.getAdresseIp()
        );
    }
}
