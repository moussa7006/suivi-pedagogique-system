package com.suiviPedagogique.edutrack.security;

public final class PasswordPolicy {

    public static final String REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{14,}$";
    public static final String MESSAGE = "Le mot de passe doit contenir au moins 14 caractères, une majuscule, une minuscule, un chiffre et un symbole";

    private PasswordPolicy() {
    }

    public static boolean isValid(String password) {
        return password != null && password.matches(REGEX);
    }
}
