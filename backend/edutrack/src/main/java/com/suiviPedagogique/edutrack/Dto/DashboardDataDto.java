package com.suiviPedagogique.edutrack.Dto;

import java.util.List;
import java.util.Map;

public class DashboardDataDto {
    private long totalTeachers;
    private long totalClasses;
    private long sessionsToday;
    private long pendingEmargements;
    
    private Map<String, Long> emargementsParJour;
    private Map<String, Long> seancesParStatut;

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
}
