package com.suiviPedagogique.edutrack.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;

class JwtUtilTest {

    private static final String SECRET = "edutrack_test_secret_key_for_jwt_authentication_minimum_32_chars";

    @Test
    void generatedTokenContainsSubjectRoleAndIsValid() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, 60_000);

        String token = jwtUtil.generateToken("admin@edutrack.local", "ADMINISTRATEUR");
        Claims claims = jwtUtil.extractClaims(token);

        assertThat(claims.getSubject()).isEqualTo("admin@edutrack.local");
        assertThat(claims.get("role", String.class)).isEqualTo("ADMINISTRATEUR");
        assertThat(jwtUtil.isTokenValid(token, "admin@edutrack.local")).isTrue();
        assertThat(jwtUtil.isTokenValid(token, "other@edutrack.local")).isFalse();
    }

    @Test
    void expiredTokenIsRejected() throws InterruptedException {
        JwtUtil jwtUtil = new JwtUtil(SECRET, 1);

        String token = jwtUtil.generateToken("teacher@edutrack.local", "ENSEIGNANT");
        Thread.sleep(10);

        assertThat(jwtUtil.isTokenValid(token, "teacher@edutrack.local")).isFalse();
    }

    @Test
    void secretMustHaveAtLeastThirtyTwoBytes() {
        assertThatThrownBy(() -> new JwtUtil("short-secret", 60_000))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("au moins 32 octets");
    }
}
