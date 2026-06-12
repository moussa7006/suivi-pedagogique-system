package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.SalleDto;
import com.suiviPedagogique.edutrack.Entities.Salle;
import com.suiviPedagogique.edutrack.repositories.SalleRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SalleService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String TOKEN_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final SalleRepository salleRepository;

    public SalleService(SalleRepository salleRepository) {
        this.salleRepository = salleRepository;
    }

    public List<SalleDto> getAll() {
        return salleRepository.findAll().stream()
                .map(this::ensureDisplayToken)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public SalleDto getById(Integer id) {
        return toDto(ensureDisplayToken(salleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée"))));
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
        if (isBlank(salle.getTokenAffichage())) salle.setTokenAffichage(generateUniqueDisplayToken());
    }

    private Salle ensureDisplayToken(Salle salle) {
        if (isBlank(salle.getTokenAffichage())) {
            salle.setTokenAffichage(generateUniqueDisplayToken());
            return salleRepository.save(salle);
        }
        return salle;
    }

    private String generateUniqueDisplayToken() {
        String token;
        do {
            token = generateDisplayToken();
        } while (salleRepository.findByTokenAffichage(token).isPresent());
        return token;
    }

    private String generateDisplayToken() {
        StringBuilder token = new StringBuilder("SALLE-");
        for (int i = 0; i < 12; i++) {
            if (i > 0 && i % 4 == 0) {
                token.append('-');
            }
            token.append(TOKEN_ALPHABET.charAt(SECURE_RANDOM.nextInt(TOKEN_ALPHABET.length())));
        }
        return token.toString();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private SalleDto toDto(Salle salle) {
        return new SalleDto(
                salle.getId(),
                salle.getNom(),
                salle.getBatiment(),
                salle.getCapacite(),
                salle.getEquipement(),
                salle.getAdresseIp(),
                salle.getTokenAffichage()
        );
    }
}
