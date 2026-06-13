package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.NiveauEnseignementDto;
import com.suiviPedagogique.edutrack.Entities.NiveauEnseignement;
import com.suiviPedagogique.edutrack.repositories.NiveauEnseignementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NiveauEnseignementService {

    private final NiveauEnseignementRepository niveauEnseignementRepository;

    public NiveauEnseignementService(NiveauEnseignementRepository niveauEnseignementRepository) {
        this.niveauEnseignementRepository = niveauEnseignementRepository;
    }

    public List<NiveauEnseignementDto> getAllNiveaux() {
        return niveauEnseignementRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public NiveauEnseignementDto getNiveauById(Integer id) {
        NiveauEnseignement niveau = niveauEnseignementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Niveau d'enseignement non trouvé"));
        return convertToDto(niveau);
    }

    public NiveauEnseignementDto createNiveau(NiveauEnseignementDto dto) {
        NiveauEnseignement niveau = new NiveauEnseignement();
        niveau.setLibelle(dto.getLibelle());
        niveau.setPrixHoraire(dto.getPrixHoraire());

        NiveauEnseignement saved = niveauEnseignementRepository.save(niveau);
        return convertToDto(saved);
    }

    public NiveauEnseignementDto updateNiveau(Integer id, NiveauEnseignementDto dto) {
        NiveauEnseignement niveau = niveauEnseignementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Niveau d'enseignement non trouvé"));

        if (dto.getLibelle() != null) niveau.setLibelle(dto.getLibelle());
        if (dto.getPrixHoraire() != null) niveau.setPrixHoraire(dto.getPrixHoraire());

        NiveauEnseignement updated = niveauEnseignementRepository.save(niveau);
        return convertToDto(updated);
    }

    public void deleteNiveau(Integer id) {
        NiveauEnseignement niveau = niveauEnseignementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Niveau d'enseignement non trouvé"));
        niveauEnseignementRepository.delete(niveau);
    }

    private NiveauEnseignementDto convertToDto(NiveauEnseignement niveau) {
        NiveauEnseignementDto dto = new NiveauEnseignementDto();
        dto.setId(niveau.getId());
        dto.setLibelle(niveau.getLibelle());
        dto.setPrixHoraire(niveau.getPrixHoraire());
        return dto;
    }
}
