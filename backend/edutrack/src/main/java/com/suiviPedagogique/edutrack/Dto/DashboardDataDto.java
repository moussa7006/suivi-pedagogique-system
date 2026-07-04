package com.suiviPedagogique.edutrack.Dto;

import java.util.List;
import java.util.Map;

public class DashboardDataDto {
    private long totalTeachers;
    private long totalClasses;
    private long sessionsToday;
    private long pendingEmargements;
    private long totalMatieres;
    private long totalSeances;
    private long emargementsValides;
    private double tauxValidationGlobal;

    private Map<String, Long> emargementsParJour;
    private Map<String, Long> seancesParStatut;

    // Vues analytiques pour les tableaux de bord.
    private List<Map<String, Object>> topEnseignants;
    private List<Map<String, Object>> matieresVolumetrie;
    private List<Map<String, Object>> classesEmargement;

    public DashboardDataDto() {}

    public long getTotalTeachers() {
        return totalTeachers;
    }

    public void setTotalTeachers(long totalTeachers) {
        this.totalTeachers = totalTeachers;
    }

    public long getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    public long getSessionsToday() {
        return sessionsToday;
    }

    public void setSessionsToday(long sessionsToday) {
        this.sessionsToday = sessionsToday;
    }

    public long getPendingEmargements() {
        return pendingEmargements;
    }

    public void setPendingEmargements(long pendingEmargements) {
        this.pendingEmargements = pendingEmargements;
    }

    public long getTotalMatieres() {
        return totalMatieres;
    }

    public void setTotalMatieres(long totalMatieres) {
        this.totalMatieres = totalMatieres;
    }

    public long getTotalSeances() {
        return totalSeances;
    }

    public void setTotalSeances(long totalSeances) {
        this.totalSeances = totalSeances;
    }

    public long getEmargementsValides() {
        return emargementsValides;
    }

    public void setEmargementsValides(long emargementsValides) {
        this.emargementsValides = emargementsValides;
    }

    public double getTauxValidationGlobal() {
        return tauxValidationGlobal;
    }

    public void setTauxValidationGlobal(double tauxValidationGlobal) {
        this.tauxValidationGlobal = tauxValidationGlobal;
    }

    public Map<String, Long> getEmargementsParJour() {
        return emargementsParJour;
    }

    public void setEmargementsParJour(Map<String, Long> emargementsParJour) {
        this.emargementsParJour = emargementsParJour;
    }

    public Map<String, Long> getSeancesParStatut() {
        return seancesParStatut;
    }

    public void setSeancesParStatut(Map<String, Long> seancesParStatut) {
        this.seancesParStatut = seancesParStatut;
    }

    public List<Map<String, Object>> getTopEnseignants() {
        return topEnseignants;
    }

    public void setTopEnseignants(List<Map<String, Object>> topEnseignants) {
        this.topEnseignants = topEnseignants;
    }

    public List<Map<String, Object>> getMatieresVolumetrie() {
        return matieresVolumetrie;
    }

    public void setMatieresVolumetrie(List<Map<String, Object>> matieresVolumetrie) {
        this.matieresVolumetrie = matieresVolumetrie;
    }

    public List<Map<String, Object>> getClassesEmargement() {
        return classesEmargement;
    }

    public void setClassesEmargement(List<Map<String, Object>> classesEmargement) {
        this.classesEmargement = classesEmargement;
    }
}
