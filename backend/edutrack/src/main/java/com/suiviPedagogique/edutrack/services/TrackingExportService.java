package com.suiviPedagogique.edutrack.services;

import com.suiviPedagogique.edutrack.Dto.EmargementDto;
import com.suiviPedagogique.edutrack.Dto.SeanceDto;
import com.suiviPedagogique.edutrack.Entities.Seance;
import com.suiviPedagogique.edutrack.repositories.SeanceRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TrackingExportService {

    private final SeanceService seanceService;
    private final EmargementService emargementService;
    private final SeanceRepository seanceRepository;

    public TrackingExportService(SeanceService seanceService, EmargementService emargementService, SeanceRepository seanceRepository) {
        this.seanceService = seanceService;
        this.emargementService = emargementService;
        this.seanceRepository = seanceRepository;
    }

    public byte[] exportSeancesExcel() throws IOException {
        List<SeanceDto> seances = seanceService.getAllSeances();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Suivi Pédagogique (Séances)");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Module", "Date", "Heure Début", "Heure Fin", "Enseignant", "Statut"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

            for (SeanceDto s : seances) {
                Row row = sheet.createRow(rowIdx++);

                String moduleNom = "";
                String enseignantNom = "";
                if (s.getId() != null) {
                    Seance entity = seanceRepository.findById(s.getId()).orElse(null);
                    if (entity != null) {
                        if (entity.getEmploiDuTemps() != null && entity.getEmploiDuTemps().getMatiere() != null) {
                            moduleNom = entity.getEmploiDuTemps().getMatiere().getLibelle();
                        }
                        if (entity.getEnseignant() != null) {
                            enseignantNom = entity.getEnseignant().getNom() + " " + entity.getEnseignant().getPrenom();
                        }
                    }
                }

                row.createCell(0).setCellValue(s.getId() != null ? s.getId() : 0);
                row.createCell(1).setCellValue(moduleNom);
                row.createCell(2).setCellValue(s.getDateCours() != null ? s.getDateCours().format(dateFormatter) : "");
                row.createCell(3).setCellValue(s.getHeureDebutReelle() != null ? s.getHeureDebutReelle().format(timeFormatter) : "");
                row.createCell(4).setCellValue(s.getHeureFinReelle() != null ? s.getHeureFinReelle().format(timeFormatter) : "");
                row.createCell(5).setCellValue(enseignantNom);
                row.createCell(6).setCellValue(s.getStatut() != null ? s.getStatut().name() : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportEmargementsExcel() throws IOException {
        List<EmargementDto> emargements = emargementService.getAllEmargements();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Suivi Présences (Émargements)");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Séance ID", "Date Scan", "Localisation", "Statut"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            for (EmargementDto e : emargements) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(e.getId() != null ? e.getId() : 0);
                row.createCell(1).setCellValue(e.getEnseignantNomPrenom() != null ? e.getEnseignantNomPrenom() : "");
                row.createCell(2).setCellValue(e.getDateHeureScan() != null ? e.getDateHeureScan().format(formatter) : "");
                row.createCell(3).setCellValue(e.getAdresseApproximative() != null ? e.getAdresseApproximative() : "");
                row.createCell(4).setCellValue(e.getStatut() != null ? e.getStatut().name() : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
