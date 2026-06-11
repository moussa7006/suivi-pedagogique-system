package com.suiviPedagogique.edutrack.Dto;

import com.suiviPedagogique.edutrack.security.PasswordPolicy;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotBlank(message = "L'email est obligatoire")
    @Email(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le code de réinitialisation est obligatoire")
    @Pattern(regexp = "^\\d{6}$", message = "Le code doit contenir 6 chiffres")
    private String code;

    @NotBlank(message = "Le nouveau mot de passe est obligatoire")
    @Pattern(regexp = PasswordPolicy.REGEX, message = PasswordPolicy.MESSAGE)
    private String newPassword;
}
