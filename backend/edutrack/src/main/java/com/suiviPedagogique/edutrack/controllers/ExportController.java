package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.services.HonorairesExportService;
import com.suiviPedagogique.edutrack.services.TrackingExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final HonorairesExportService honorairesExportService;
    private final TrackingExportService trackingExportService;

    public ExportController(HonorairesExportService honorairesExportService, TrackingExportService trackingExportService) {
        this.honorairesExportService = honorairesExportService;
        this.trackingExportService = trackingExportService;
    }

    @GetMapping("/honoraires/excel")
    public ResponseEntity<byte[]> exportHonorairesExcel(
            @RequestParam Integer annee,
            @RequestParam Integer mois) throws IOException {

        byte[] excelBytes = honorairesExportService.exportHonorairesExcel(annee, mois);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"honoraires_" + annee + "_" + mois + ".xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    @GetMapping("/honoraires/{id}/pdf")
    public ResponseEntity<byte[]> exportFichePaiePdf(@PathVariable Integer id) {
        byte[] pdfBytes = honorairesExportService.exportFichePaiePdf(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"fiche_paie_" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/seances/excel")
    public ResponseEntity<byte[]> exportSeancesExcel() throws IOException {
        byte[] excelBytes = trackingExportService.exportSeancesExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"suivi_pedagogique_seances.xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    @GetMapping("/emargements/excel")
    public ResponseEntity<byte[]> exportEmargementsExcel() throws IOException {
        byte[] excelBytes = trackingExportService.exportEmargementsExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"suivi_presences_emargements.xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}
