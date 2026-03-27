package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.ClasseDto;
import com.suiviPedagogique.edutrack.Entities.Classe;
import com.suiviPedagogique.edutrack.Entities.Utilisateur;
import com.suiviPedagogique.edutrack.repositories.ClasseRepository;
import com.suiviPedagogique.edutrack.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClasseService {

    @Autowired
    private ClasseRepository classeRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    private void verifyAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Utilisateur currentUser = utilisateurRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if (!"ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Seul l'administrateur peut effectuer cette action");
        }
    }

    public ClasseDto createClasse(ClasseDto dto) {
        verifyAdmin();
        Classe classe = new Classe();
        classe.setFiliere(dto.getFiliere());
        classe.setAnneeScolaire(dto.getAnneeScolaire());
        Classe saved = classeRepository.save(classe);
        return convertToDto(saved);
    }

    public List<ClasseDto> getAllClasses() {
        return classeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ClasseDto getClasseById(Integer id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        return convertToDto(classe);
    }

    public ClasseDto updateClasse(Integer id, ClasseDto dto) {
        verifyAdmin();
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        
        if (dto.getFiliere() != null) classe.setFiliere(dto.getFiliere());
        if (dto.getAnneeScolaire() != null) classe.setAnneeScolaire(dto.getAnneeScolaire());

        Classe updated = classeRepository.save(classe);
        return convertToDto(updated);
    }

    public void deleteClasse(Integer id) {
        verifyAdmin();
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        classeRepository.delete(classe);
    }

    private ClasseDto convertToDto(Classe classe) {
        ClasseDto dto = new ClasseDto();
        dto.setId(classe.getId());
        dto.setFiliere(classe.getFiliere());
        dto.setAnneeScolaire(classe.getAnneeScolaire());
        return dto;
    }
}
