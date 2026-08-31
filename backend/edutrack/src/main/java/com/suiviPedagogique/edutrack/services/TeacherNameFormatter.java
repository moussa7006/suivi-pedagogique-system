package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Entities.Enseignant;

/** Formats teacher names for display without altering persisted identity data. */
public final class TeacherNameFormatter {

    private TeacherNameFormatter() {
    }

    public static String format(Enseignant enseignant) {
        if (enseignant == null) {
            return "Pr.";
        }

        String prenom = enseignant.getPrenom() == null ? "" : enseignant.getPrenom().trim();
        String nom = enseignant.getNom() == null ? "" : enseignant.getNom().trim();
        String fullName = (prenom + " " + nom).trim();

        return fullName.isEmpty() ? "Pr." : "Pr. " + fullName;
    }
}
