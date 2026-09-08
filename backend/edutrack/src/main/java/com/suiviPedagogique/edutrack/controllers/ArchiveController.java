package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.ArchiveAnneeDto;
import com.suiviPedagogique.edutrack.services.ArchiveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/archives")
public class ArchiveController {
    private final ArchiveService archiveService;

    public ArchiveController(ArchiveService archiveService) { this.archiveService = archiveService; }

    @GetMapping("/{anneeId}")
    public ResponseEntity<ArchiveAnneeDto> getArchive(@PathVariable Integer anneeId) {
        return ResponseEntity.ok(archiveService.getArchive(anneeId));
    }
}
