package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.QrSalleDisplayDto;
import com.suiviPedagogique.edutrack.services.SeanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ecrans")
public class EcranSalleController {

    private final SeanceService seanceService;

    public EcranSalleController(SeanceService seanceService) {
        this.seanceService = seanceService;
    }

    @GetMapping("/salles/{tokenAffichage}/qr-actif")
    public ResponseEntity<QrSalleDisplayDto> getQrActifPourSalle(@PathVariable String tokenAffichage) {
        QrSalleDisplayDto qr = seanceService.getQrCodeActifPourSalle(tokenAffichage);

        if (qr == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(qr);
    }
}
