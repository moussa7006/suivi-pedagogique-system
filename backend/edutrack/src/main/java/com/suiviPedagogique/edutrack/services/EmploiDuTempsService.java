package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.EmploiDuTempsDto;
import com.suiviPedagogique.edutrack.Entities.*;
import com.suiviPedagogique.edutrack.Entities.enums.Role;
import com.suiviPedagogique.edutrack.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmploiDuTempsService {

    @Autowired
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private ClasseRepository classeRepository;

    @Autowired
    private MatiereRepository matiereRepository;
    
    @Autowired
    private SalleRepository salleRepository;

    @Autowired
    private AnneeUniversitaireRepository anneeUniversitaireRepository;

    @Autowired
    private ScheduleJobService scheduleJobService;

    private Utilisateur getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public EmploiDuTempsDto create(EmploiDuTempsDto dto) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut créer un emploi du temps");
        }

        EmploiDuTemps emploi = new EmploiDuTemps();
        hydrateEntity(emploi, dto, null);

        EmploiDuTemps saved = emploiDuTempsRepository.save(emploi);
        scheduleJobService.checkAndGenerateSeanceForToday(saved);
        return convertToDto(saved);
    }

    public EmploiDuTempsDto update(Integer id, EmploiDuTempsDto dto) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut modifier un emploi du temps");
        }

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emploi du temps non trouvé"));
        
        hydrateEntity(emploi, dto, id);

        EmploiDuTemps updated = emploiDuTempsRepository.save(emploi);
        scheduleJobService.checkAndGenerateSeanceForToday(updated);
        return convertToDto(updated);
    }

    public void delete(Integer id) {
        Utilisateur currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMINISTRATEUR) {
            throw new AccessDeniedException("Seul l'administrateur peut supprimer un emploi du temps");
        }

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emploi du temps non trouvé"));
        emploiDuTempsRepository.delete(emploi);
    }

    public List<EmploiDuTempsDto> getAll() {
        Utilisateur currentUser = getCurrentUser();
        List<EmploiDuTemps> list;
        if (currentUser.getRole() == Role.ADMINISTRATEUR) {
            list = emploiDuTempsRepository.findAll();
        } else if (currentUser.getRole() == Role.ENSEIGNANT) {
            list = emploiDuTempsRepository.findByEnseignantId(currentUser.getId());
        } else {
            throw new AccessDeniedException("Rôle non autorisé");
        }
        return list.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public EmploiDuTempsDto getById(Integer id) {
        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emploi du temps non trouvé"));
        return convertToDto(emploi);
    }

    private void hydrateEntity(EmploiDuTemps emploi, EmploiDuTempsDto dto, Integer emploiId) {
        emploi.setTitre(dto.getTitre());
        emploi.setTypeRecurrence(dto.getTypeRecurrence());
        emploi.setDateDebutValidite(dto.getDateDebutValidite());
        emploi.setDateFinValidite(dto.getDateFinValidite());
        emploi.setJourSemaine(dto.getJourSemaine());
        emploi.setJourDuMois(dto.getJourDuMois());
        emploi.setDateSpecifique(dto.getDateSpecifique());
        emploi.setHeureDebut(dto.getHeureDebut());
        emploi.setHeureFin(dto.getHeureFin());
        
        if (dto.getSalleId() != null) {
            Salle salle = salleRepository.findById(dto.getSalleId())
                    .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
            emploi.setSalle(salle);
        }

        if (dto.getEnseignantId() != null) {
            Enseignant enseignant = enseignantRepository.findById(dto.getEnseignantId())
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
            checkProfAvailability(enseignant, dto, emploiId);
            emploi.setEnseignant(enseignant);
        }
        if (dto.getClasseId() != null) {
            Classe classe = classeRepository.findById(dto.getClasseId())
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
            emploi.setClasse(classe);
        }
        if (dto.getMatiereId() != null) {
            Matiere matiere = matiereRepository.findById(dto.getMatiereId())
                    .orElseThrow(() -> new RuntimeException("Matière non trouvée"));
            emploi.setMatiere(matiere);
        }
        if (dto.getAnneeUniversitaireId() != null) {
            AnneeUniversitaire annee = anneeUniversitaireRepository.findById(dto.getAnneeUniversitaireId())
                    .orElseThrow(() -> new RuntimeException("Année universitaire non trouvée"));
            emploi.setAnneeUniversitaire(annee);
        }
    }

    private EmploiDuTempsDto convertToDto(EmploiDuTemps emploi) {
        EmploiDuTempsDto dto = new EmploiDuTempsDto();
        dto.setId(emploi.getId());
        dto.setTitre(emploi.getTitre());
        dto.setTypeRecurrence(emploi.getTypeRecurrence());
        dto.setDateDebutValidite(emploi.getDateDebutValidite());
        dto.setDateFinValidite(emploi.getDateFinValidite());
        dto.setJourSemaine(emploi.getJourSemaine());
        dto.setJourDuMois(emploi.getJourDuMois());
        dto.setDateSpecifique(emploi.getDateSpecifique());
        dto.setHeureDebut(emploi.getHeureDebut());
        dto.setHeureFin(emploi.getHeureFin());
        
        if (emploi.getSalle() != null) dto.setSalleId(emploi.getSalle().getId());
        if (emploi.getEnseignant() != null) dto.setEnseignantId(emploi.getEnseignant().getId());
        if (emploi.getClasse() != null) dto.setClasseId(emploi.getClasse().getId());
        if (emploi.getMatiere() != null) dto.setMatiereId(emploi.getMatiere().getId());
        if (emploi.getAnneeUniversitaire() != null) dto.setAnneeUniversitaireId(emploi.getAnneeUniversitaire().getId());
        
        return dto;
    }

    private com.suiviPedagogique.edutrack.Entities.enums.JourSemaine toJourSemaine(java.time.DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.LUNDI;
            case TUESDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.MARDI;
            case WEDNESDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.MERCREDI;
            case THURSDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.JEUDI;
            case FRIDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.VENDREDI;
            case SATURDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.SAMEDI;
            case SUNDAY: return com.suiviPedagogique.edutrack.Entities.enums.JourSemaine.DIMANCHE;
            default: return null;
        }
    }

    private void checkProfAvailability(Enseignant enseignant, EmploiDuTempsDto dto, Integer excludeId) {
        List<EmploiDuTemps> emplois = emploiDuTempsRepository.findByEnseignantId(enseignant.getId());
        for (EmploiDuTemps e : emplois) {
            if (excludeId != null && e.getId().equals(excludeId)) {
                continue;
            }
            
            if (e.getDateDebutValidite().isAfter(dto.getDateFinValidite()) || e.getDateFinValidite().isBefore(dto.getDateDebutValidite())) {
                continue;
            }
            if (!e.getHeureDebut().isBefore(dto.getHeureFin()) || !e.getHeureFin().isAfter(dto.getHeureDebut())) {
                continue;
            }
            
            boolean conflict = false;
            if (e.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE && dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE) {
                conflict = e.getDateSpecifique().equals(dto.getDateSpecifique());
            } else if (e.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.HEBDOMADAIRE && dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.HEBDOMADAIRE) {
                conflict = e.getJourSemaine() == dto.getJourSemaine();
            } else if (e.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.MENSUEL && dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.MENSUEL) {
                conflict = e.getJourDuMois().equals(dto.getJourDuMois());
            } else if (e.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE && dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.HEBDOMADAIRE) {
                conflict = toJourSemaine(e.getDateSpecifique().getDayOfWeek()) == dto.getJourSemaine();
            } else if (e.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.HEBDOMADAIRE && dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE) {
                conflict = toJourSemaine(dto.getDateSpecifique().getDayOfWeek()) == e.getJourSemaine();
            } else if (e.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE && dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.MENSUEL) {
                conflict = e.getDateSpecifique().getDayOfMonth() == dto.getJourDuMois();
            } else if (e.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.MENSUEL && dto.getTypeRecurrence() == com.suiviPedagogique.edutrack.Entities.enums.TypeRecurrence.UNIQUE) {
                conflict = dto.getDateSpecifique().getDayOfMonth() == e.getJourDuMois();
            } else {
                conflict = true;
            }
            
            if (conflict) {
                throw new RuntimeException("L'enseignant a déjà un cours programmé sur ce créneau horaire.");
            }
        }
    }
}
