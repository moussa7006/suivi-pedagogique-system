package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.*;
import com.suiviPedagogique.edutrack.Entities.*;
import com.suiviPedagogique.edutrack.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArchiveService {
    private final AnneeUniversitaireRepository anneeRepository;
    private final ClasseRepository classeRepository;
    private final EmploiDuTempsRepository emploiRepository;
    private final SeanceRepository seanceRepository;
    private final EmargementRepository emargementRepository;
    private final FicheProgressionRepository ficheRepository;
    private final DetailHonoraireRepository detailHonoraireRepository;

    public ArchiveService(AnneeUniversitaireRepository anneeRepository,
                          ClasseRepository classeRepository,
                          EmploiDuTempsRepository emploiRepository,
                          SeanceRepository seanceRepository,
                          EmargementRepository emargementRepository,
                          FicheProgressionRepository ficheRepository,
                          DetailHonoraireRepository detailHonoraireRepository) {
        this.anneeRepository = anneeRepository;
        this.classeRepository = classeRepository;
        this.emploiRepository = emploiRepository;
        this.seanceRepository = seanceRepository;
        this.emargementRepository = emargementRepository;
        this.ficheRepository = ficheRepository;
        this.detailHonoraireRepository = detailHonoraireRepository;
    }

    @Transactional(readOnly = true)
    public ArchiveAnneeDto getArchive(Integer id) {
        AnneeUniversitaire annee = anneeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Année universitaire non trouvée"));
        if (!Boolean.TRUE.equals(annee.getArchivee())
                && (annee.getDateFin() == null || LocalDate.now().isBefore(annee.getDateFin()))) {
            throw new IllegalStateException("Cette année universitaire n'est pas encore archivée.");
        }

        List<Classe> classes = classeRepository.findByAnneeUniversitaireId(id);
        List<EmploiDuTemps> emplois = emploiRepository.findByAnneeUniversitaireId(id);
        List<Seance> seances = seanceRepository.findByAnneeUniversitaireId(id);

        return new ArchiveAnneeDto(
                toAnneeDto(annee),
                classes.stream().map(this::toClasseDto).collect(Collectors.toList()),
                emplois.stream().map(this::toEmploiDto).collect(Collectors.toList()),
                seances.stream().map(this::toSeanceDto).collect(Collectors.toList()),
                emargementRepository.findByAnneeUniversitaireId(id).stream().map(this::toEmargementDto).collect(Collectors.toList()),
                ficheRepository.findByAnneeUniversitaireId(id).stream().map(this::toFicheDto).collect(Collectors.toList()),
                detailHonoraireRepository.findByAnneeUniversitaireId(id).stream().map(this::toDetailDto).collect(Collectors.toList())
        );
    }

    private AnneeUniversitaireDto toAnneeDto(AnneeUniversitaire a) {
        return new AnneeUniversitaireDto(a.getId(), a.getLibelle(), a.getDateDebut(), a.getDateFin(), false, true);
    }

    private ClasseDto toClasseDto(Classe c) {
        return new ClasseDto(c.getId(), c.getLibelle(), c.getFiliere() == null ? null : c.getFiliere().getId(),
                c.getNiveauEnseignement() == null ? null : c.getNiveauEnseignement().getId(),
                c.getAnneeUniversitaire() == null ? null : c.getAnneeUniversitaire().getId());
    }

    private EmploiDuTempsDto toEmploiDto(EmploiDuTemps e) {
        EmploiDuTempsDto d = new EmploiDuTempsDto();
        d.setId(e.getId()); d.setTitre(e.getTitre()); d.setTypeRecurrence(e.getTypeRecurrence());
        d.setDateDebutValidite(e.getDateDebutValidite()); d.setDateFinValidite(e.getDateFinValidite());
        d.setJourSemaine(e.getJourSemaine()); d.setJourDuMois(e.getJourDuMois()); d.setDateSpecifique(e.getDateSpecifique());
        d.setHeureDebut(e.getHeureDebut()); d.setHeureFin(e.getHeureFin());
        d.setSalleId(e.getSalle() == null ? null : e.getSalle().getId());
        d.setEnseignantId(e.getEnseignant() == null ? null : e.getEnseignant().getId());
        d.setClasseId(e.getClasse() == null ? null : e.getClasse().getId());
        d.setMatiereId(e.getMatiere() == null ? null : e.getMatiere().getId()); d.setAnneeUniversitaireId(e.getAnneeUniversitaire().getId());
        return d;
    }

    private SeanceDto toSeanceDto(Seance s) {
        SeanceDto d = new SeanceDto(); d.setId(s.getId()); d.setDateCours(s.getDateCours());
        d.setHeureDebutReelle(s.getHeureDebutReelle()); d.setHeureFinReelle(s.getHeureFinReelle()); d.setStatut(s.getStatut());
        d.setSalleId(s.getSalle() == null ? null : s.getSalle().getId()); d.setQrCodeId(s.getQrCode() == null ? null : s.getQrCode().getId());
        d.setEnseignantId(s.getEnseignant() == null ? null : s.getEnseignant().getId()); d.setClasseId(s.getClasse() == null ? null : s.getClasse().getId());
        d.setEmploiDuTempsId(s.getEmploiDuTemps() == null ? null : s.getEmploiDuTemps().getId());
        d.setEmargementId(s.getEmargement() == null ? null : s.getEmargement().getId()); d.setFicheProgressionId(s.getFicheProgression() == null ? null : s.getFicheProgression().getId());
        return d;
    }

    private EmargementDto toEmargementDto(Emargement e) {
        EmargementDto d = new EmargementDto(e.getId(), e.getDateHeureScan(), e.getLatitude(), e.getLongitude(), e.getAdresseApproximative(), e.getStatut(), null, null, null);
        if (e.getSeance() != null) { d.setEnseignantNomPrenom(format(e.getSeance().getEnseignant())); if (e.getSeance().getSalle() != null) d.setLieu(e.getSeance().getSalle().getNom()); d.setHeureSeance(e.getSeance().getHeureDebutReelle() + " - " + e.getSeance().getHeureFinReelle()); }
        return d;
    }

    private FicheProgressionDto toFicheDto(FicheProgression f) {
        FicheProgressionDto d = new FicheProgressionDto(f.getId(), f.getDateSaisie(), f.getContenuDetaille(), f.getObjectifs(), f.getTravaux(), f.getEstValideAdmin(), f.getDateValidation(), null, null, null, null, null);
        if (f.getSeance() != null) { Seance s = f.getSeance(); d.setSeanceId(s.getId()); d.setEnseignantNomPrenom(format(s.getEnseignant())); d.setDateSeance(String.valueOf(s.getDateCours())); d.setHeureSeance(s.getHeureDebutReelle() + " - " + s.getHeureFinReelle()); if (s.getEmploiDuTemps() != null && s.getEmploiDuTemps().getMatiere() != null) d.setMatiereLibelle(s.getEmploiDuTemps().getMatiere().getLibelle()); }
        return d;
    }

    private DetailHonoraireDto toDetailDto(DetailHonoraire h) {
        Seance s = h.getSeance(); DetailHonoraireDto d = new DetailHonoraireDto(h.getId(), s == null ? null : s.getId(), s == null ? null : s.getDateCours(), s == null ? null : s.getHeureDebutReelle(), s == null ? null : s.getHeureFinReelle(), null, null, null, null, h.getNombreHeures(), h.getTauxHoraire(), h.getMontant());
        if (s != null) { d.setEnseignantNomPrenom(format(s.getEnseignant())); if (s.getClasse() != null) { d.setClasseLibelle(s.getClasse().getLibelle()); if (s.getClasse().getNiveauEnseignement() != null) d.setNiveauLibelle(s.getClasse().getNiveauEnseignement().getLibelle()); } if (s.getEmploiDuTemps() != null && s.getEmploiDuTemps().getMatiere() != null) d.setMatiereLibelle(s.getEmploiDuTemps().getMatiere().getLibelle()); }
        return d;
    }

    private String format(Enseignant e) { return e == null ? null : e.getPrenom() + " " + e.getNom(); }
}
