package com.suiviPedagogique.edutrack.services;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Image;
import org.springframework.core.io.ClassPathResource;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.suiviPedagogique.edutrack.Dto.HonorairesCalculDto;
import com.suiviPedagogique.edutrack.Dto.DetailHonoraireDto;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.suiviPedagogique.edutrack.repositories.EnseignantRepository;
import com.suiviPedagogique.edutrack.Entities.Enseignant;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class HonorairesExportService {

    private final HonorairesService honorairesService;
    private final EnseignantRepository enseignantRepository;

    public HonorairesExportService(HonorairesService honorairesService, EnseignantRepository enseignantRepository) {
        this.honorairesService = honorairesService;
        this.enseignantRepository = enseignantRepository;
    }

    private String formatStatut(com.suiviPedagogique.edutrack.Entities.enums.StatutHonoraire statut) {
        if (statut == null) return "";
        if ("BROUILLON".equals(statut.name())) return "EN ATTENTE";
        return statut.name();
    }

    private String formatMoisAnnee(Integer annee, Integer mois) {
        java.time.YearMonth ym = java.time.YearMonth.of(annee, mois);
        String moisStr = ym.getMonth().getDisplayName(TextStyle.FULL, Locale.FRANCE);
        return moisStr.substring(0, 1).toUpperCase() + moisStr.substring(1) + " " + annee;
    }

    private String formatMoisAnneeFromLocalDate(java.time.LocalDate date) {
        if (date == null) return "";
        String moisStr = date.getMonth().getDisplayName(TextStyle.FULL, Locale.FRANCE);
        return moisStr.substring(0, 1).toUpperCase() + moisStr.substring(1) + " " + date.getYear();
    }

    public byte[] exportHonorairesExcel(Integer annee, Integer mois) throws IOException {
        List<HonorairesCalculDto> honoraires = honorairesService.getHonorairesParMois(annee, mois);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Honoraires " + formatMoisAnnee(annee, mois));

            // Style de l'en-tête
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            String[] headers = {"Matricule", "Nom complet", "Total Heures", "Montant Brut", "Statut Honoraire"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Lignes de données
            int rowIdx = 1;
            for (HonorairesCalculDto h : honoraires) {
                Row row = sheet.createRow(rowIdx++);

                String matricule = "N/A";
                if (h.getEnseignantId() != null) {
                    Enseignant e = enseignantRepository.findById(h.getEnseignantId()).orElse(null);
                    if (e != null && e.getMatricule() != null) {
                        matricule = e.getMatricule();
                    }
                }

                row.createCell(0).setCellValue(matricule);
                row.createCell(1).setCellValue(h.getEnseignantNomPrenom() != null ? h.getEnseignantNomPrenom() : "");
                row.createCell(2).setCellValue(h.getTotalHeures() != null ? h.getTotalHeures().doubleValue() : 0.0);
                row.createCell(3).setCellValue(h.getMontantBrut() != null ? h.getMontantBrut().doubleValue() : 0.0);
                row.createCell(4).setCellValue(formatStatut(h.getStatut()));
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportFichePaiePdf(Integer id) {
        HonorairesCalculDto h = honorairesService.getHonorairesById(id);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            try {
                ClassPathResource logoResource = new ClassPathResource("images/logo_INTEC_nom_Horizon-1-3-1.png");
                if (logoResource.exists()) {
                    Image logo = Image.getInstance(logoResource.getURL());
                    // Agrandi pour prendre presque toute la largeur (une page A4 fait environ 595 points de large)
                    logo.scaleToFit(500, 200);
                    logo.setAlignment(Element.ALIGN_CENTER);
                    document.add(logo);
                    document.add(new Paragraph(" "));
                }
            } catch (Exception e) {
                // Ignore s'il y a un problème de chargement d'image
            }

            com.lowagie.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Fiche de Paie - Honoraires", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Enseignant: " + (h.getEnseignantNomPrenom() != null ? h.getEnseignantNomPrenom() : "N/A")));
            document.add(new Paragraph("Période: " + formatMoisAnneeFromLocalDate(h.getMois())));
            document.add(new Paragraph("Statut: " + formatStatut(h.getStatut())));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);

            addTableHeader(table, "Module");
            addTableHeader(table, "Date & Heure");
            addTableHeader(table, "Durée (H)");
            addTableHeader(table, "Montant");

            if (h.getDetailsHonoraires() != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
                for (DetailHonoraireDto d : h.getDetailsHonoraires()) {
                    table.addCell(d.getMatiereLibelle() != null ? d.getMatiereLibelle() : "N/A");

                    String dateTimeStr = "";
                    if (d.getDateCours() != null) {
                        dateTimeStr += d.getDateCours().format(formatter);
                    }
                    if (d.getHeureDebut() != null && d.getHeureFin() != null) {
                        dateTimeStr += " " + d.getHeureDebut().format(timeFormatter) + " - " + d.getHeureFin().format(timeFormatter);
                    }
                    table.addCell(dateTimeStr);
                    table.addCell(String.valueOf(d.getNombreHeures() != null ? d.getNombreHeures() : 0));
                    table.addCell(String.valueOf(d.getMontant() != null ? d.getMontant() : 0));
                }
            }
            document.add(table);

            document.add(new Paragraph(" "));

            com.lowagie.text.Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            document.add(new Paragraph("Total Heures: " + h.getTotalHeures(), totalFont));
            document.add(new Paragraph("Montant Total Brut: " + h.getMontantBrut() + " F CFA", totalFont));

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }

    private void addTableHeader(PdfPTable table, String headerTitle) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
        header.setBorderWidth(1);
        header.setPhrase(new Phrase(headerTitle));
        table.addCell(header);
    }
}
