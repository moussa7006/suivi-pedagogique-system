package com.suiviPedagogique.edutrack.services;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
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
import java.awt.Color;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class HonorairesExportService {

    private final HonorairesService honorairesService;
    private final EnseignantRepository enseignantRepository;

    // Palette EduTrack (cohérente avec la présentation)
    private static final Color NAVY = new Color(0x0F, 0x42, 0x72);
    private static final Color BLUE = new Color(0x18, 0x68, 0xAB);
    private static final Color GREY_TXT = new Color(0x5A, 0x6E, 0x80);
    private static final Color LIGHT_BG = new Color(0xEF, 0xF6, 0xFF);
    private static final Color BORDER = new Color(0xD8, 0xE5, 0xEE);
    private static final Color WHITE = new Color(0xFF, 0xFF, 0xFF);
    private static final Color ORANGE = new Color(0xF5, 0x9E, 0x0B);
    private static final Color GREEN = new Color(0x1F, 0xA6, 0x5B);
    private static final Color RED = new Color(0xDC, 0x26, 0x26);

    public HonorairesExportService(HonorairesService honorairesService,
                                   EnseignantRepository enseignantRepository) {
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

    // ====================================================================
    //  FICHE DE PAIE PDF — redesign propre, gros titre, sans logo INTEC
    // ====================================================================
    public byte[] exportFichePaiePdf(Integer id) {
        HonorairesCalculDto h = honorairesService.getHonorairesById(id);

        NumberFormat intFmt = NumberFormat.getIntegerInstance(Locale.FRANCE);
        NumberFormat decFmt = NumberFormat.getNumberInstance(Locale.FRANCE);
        decFmt.setMaximumFractionDigits(2);
        decFmt.setMinimumFractionDigits(0);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 44, 44, 40, 40);
            PdfWriter.getInstance(document, out);
            document.open();

            // ---------- Bande d'en-tête ----------
            PdfPTable header = new PdfPTable(2);
            header.setWidthPercentage(100);
            header.setWidths(new float[]{1f, 1f});

            PdfPCell brand = new PdfPCell(new Phrase("EduTrack",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, Font.BOLD, NAVY)));
            brand.setBorder(Rectangle.BOTTOM);
            brand.setBorderWidth(1.4f);
            brand.setBorderColor(BLUE);
            brand.setPaddingBottom(6);
            header.addCell(brand);

            PdfPCell dateCell = new PdfPCell(new Phrase(
                    "Émis le " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, GREY_TXT)));
            dateCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            dateCell.setBorder(Rectangle.BOTTOM);
            dateCell.setBorderWidth(1.4f);
            dateCell.setBorderColor(BLUE);
            dateCell.setPaddingBottom(6);
            header.addCell(dateCell);
            document.add(header);

            document.add(new Paragraph(" "));

            // ---------- Gros titre ----------
            Paragraph title = new Paragraph("FICHE DE PAIE",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 30, Font.BOLD, NAVY));
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(8);
            title.setSpacingAfter(2);
            document.add(title);

            Paragraph subtitle = new Paragraph(
                    "Honoraires de l'enseignant — " + formatMoisAnneeFromLocalDate(h.getMois()),
                    FontFactory.getFont(FontFactory.HELVETICA, 13, Font.NORMAL, GREY_TXT));
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(16);
            document.add(subtitle);

            // ---------- Bloc enseignant (2 colonnes label/valeur) ----------
            String matricule = "N/A";
            if (h.getEnseignantId() != null) {
                Enseignant e = enseignantRepository.findById(h.getEnseignantId()).orElse(null);
                if (e != null && e.getMatricule() != null) {
                    matricule = e.getMatricule();
                }
            }

            PdfPTable info = new PdfPTable(4);
            info.setWidthPercentage(100);
            info.setWidths(new float[]{0.55f, 1f, 0.55f, 1f});

            infoRow(info, "Enseignant", h.getEnseignantNomPrenom() != null ? h.getEnseignantNomPrenom() : "N/A");
            infoRow(info, "Matricule", matricule);
            infoRow(info, "Période", formatMoisAnneeFromLocalDate(h.getMois()));
            infoRow(info, "Date d'édition", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

            // Statut en badge coloré
            PdfPCell lblStatut = infoLabelCell("Statut");
            info.addCell(lblStatut);
            PdfPCell valStatut = infoValueCell("");
            String statutTxt = formatStatut(h.getStatut());
            Color statutColor = GREEN;
            if (statutTxt.contains("ATTENTE")) statutColor = ORANGE;
            else if (statutTxt.contains("ANNULE")) statutColor = RED;
            Paragraph st = new Paragraph(statutTxt,
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Font.BOLD, statutColor));
            valStatut.setPhrase(st);
            info.addCell(valStatut);
            info.addCell(infoLabelCell(""));
            info.addCell(infoValueCell(""));

            document.add(info);
            document.add(new Paragraph(14f, " "));

            // ---------- Tableau des séances ----------
            Paragraph detailTitle = new Paragraph("Détail des séances émargées",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Font.BOLD, NAVY));
            detailTitle.setSpacingAfter(6);
            document.add(detailTitle);

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2.4f, 2.6f, 1f, 1.4f});

            // En-tête
            tableHeaderCell(table, "Module");
            tableHeaderCell(table, "Date & Heure");
            tableHeaderCell(table, "Durée");
            tableHeaderCell(table, "Montant");

            DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");

            int row = 0;
            if (h.getDetailsHonoraires() != null) {
                for (DetailHonoraireDto d : h.getDetailsHonoraires()) {
                    Color bg = (row % 2 == 0) ? LIGHT_BG : WHITE;

                    table.addCell(detailCell(d.getMatiereLibelle() != null ? d.getMatiereLibelle() : "N/A", bg));

                    String dateTimeStr = "";
                    if (d.getDateCours() != null) {
                        dateTimeStr += d.getDateCours().format(dateFmt);
                    }
                    if (d.getHeureDebut() != null && d.getHeureFin() != null) {
                        dateTimeStr += "  " + d.getHeureDebut().format(timeFmt) + " – " + d.getHeureFin().format(timeFmt);
                    }
                    table.addCell(detailCell(dateTimeStr, bg));

                    Float heures = d.getNombreHeures();
                    table.addCell(detailCell(heures != null ? decFmt.format(heures) + " h" : "0 h", bg));

                    Float montant = d.getMontant();
                    table.addCell(detailCell(montant != null ? intFmt.format(montant) + " F" : "0 F", bg));
                    row++;
                }
            }
            document.add(table);

            document.add(new Paragraph(10f, " "));

            // ---------- Total (encadré à droite) ----------
            PdfPTable total = new PdfPTable(2);
            total.setWidthPercentage(100);
            total.setWidths(new float[]{1.6f, 1f});

            PdfPCell totalLbl = new PdfPCell(new Phrase("TOTAL BRUT",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Font.BOLD, WHITE)));
            totalLbl.setBackgroundColor(NAVY);
            totalLbl.setBorderColor(NAVY);
            totalLbl.setHorizontalAlignment(Element.ALIGN_LEFT);
            totalLbl.setPadding(10);

            Paragraph amountP = new Paragraph();
            amountP.add(new Phrase(
                    h.getMontantBrut() != null ? intFmt.format(h.getMontantBrut()) : "0",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Font.BOLD, WHITE)));
            amountP.add(new Phrase("  F CFA",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Font.BOLD, WHITE)));

            PdfPCell totalVal = new PdfPCell(amountP);
            totalVal.setBackgroundColor(NAVY);
            totalVal.setBorderColor(NAVY);
            totalVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalVal.setPadding(10);

            // cellule gauche vide
            PdfPCell empty = new PdfPCell(new Phrase(" "));
            empty.setBorder(Rectangle.NO_BORDER);
            total.addCell(totalLbl);
            total.addCell(totalVal);
            document.add(total);

            // Total heures sous le bloc
            PdfPTable heuresTbl = new PdfPTable(2);
            heuresTbl.setWidthPercentage(100);
            heuresTbl.setWidths(new float[]{1.6f, 1f});
            PdfPCell hEmpty = new PdfPCell(new Phrase(
                    "Total heures enseignées : "
                            + (h.getTotalHeures() != null ? decFmt.format(h.getTotalHeures()) : "0") + " h",
                    FontFactory.getFont(FontFactory.HELVETICA, 10, Font.NORMAL, GREY_TXT)));
            hEmpty.setBorder(Rectangle.NO_BORDER);
            hEmpty.setHorizontalAlignment(Element.ALIGN_RIGHT);
            hEmpty.setPaddingTop(4);
            PdfPCell hEmpty2 = new PdfPCell(new Phrase(" "));
            hEmpty2.setBorder(Rectangle.NO_BORDER);
            heuresTbl.addCell(hEmpty);
            heuresTbl.addCell(hEmpty2);
            document.add(heuresTbl);

            document.add(new Paragraph(40f, " "));

            // ---------- Signatures ----------
            PdfPTable sign = new PdfPTable(2);
            sign.setWidthPercentage(100);
            sign.setWidths(new float[]{1f, 1f});
            sign.addCell(signatureCell("Signature de l'enseignant"));
            sign.addCell(signatureCell("Signature de l'administration"));
            document.add(sign);

            document.add(new Paragraph(18f, " "));

            // ---------- Pied de page ----------
            Paragraph footer = new Paragraph(
                    "Document généré automatiquement par EduTrack le "
                            + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")),
                    FontFactory.getFont(FontFactory.HELVETICA, 8, Font.ITALIC, GREY_TXT));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }

    // ---------- Helpers de mise en page ----------

    private void infoRow(PdfPTable info, String label, String value) {
        info.addCell(infoLabelCell(label));
        info.addCell(infoValueCell(value));
    }

    private PdfPCell infoLabelCell(String label) {
        PdfPCell c = new PdfPCell(new Phrase(label,
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Font.BOLD, GREY_TXT)));
        c.setBackgroundColor(LIGHT_BG);
        c.setBorderColor(BORDER);
        c.setBorderWidth(0.5f);
        c.setPadding(7);
        return c;
    }

    private PdfPCell infoValueCell(String value) {
        PdfPCell c = new PdfPCell(new Phrase(value != null ? value : "",
                FontFactory.getFont(FontFactory.HELVETICA, 10, Font.NORMAL, NAVY)));
        c.setBorderColor(BORDER);
        c.setBorderWidth(0.5f);
        c.setPadding(7);
        return c;
    }

    private void tableHeaderCell(PdfPTable table, String text) {
        PdfPCell c = new PdfPCell(new Phrase(text,
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Font.BOLD, WHITE)));
        c.setBackgroundColor(NAVY);
        c.setBorderColor(NAVY);
        c.setPadding(8);
        c.setHorizontalAlignment(Element.ALIGN_LEFT);
        table.addCell(c);
    }

    private PdfPCell detailCell(String text, Color bg) {
        PdfPCell c = new PdfPCell(new Phrase(text != null ? text : "",
                FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, new Color(0x30, 0x41, 0x52))));
        c.setBackgroundColor(bg);
        c.setBorderColor(BORDER);
        c.setBorderWidth(0.5f);
        c.setPadding(6);
        return c;
    }

    private PdfPCell signatureCell(String label) {
        PdfPCell c = new PdfPCell(new Phrase(label,
                FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, GREY_TXT)));
        c.setBorder(Rectangle.TOP);
        c.setBorderWidth(0.8f);
        c.setBorderColor(BORDER);
        c.setHorizontalAlignment(Element.ALIGN_CENTER);
        c.setPaddingTop(28);
        c.setPaddingBottom(4);
        return c;
    }
}
