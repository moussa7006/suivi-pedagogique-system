package com.suiviPedagogique.edutrack.Dto;

import java.util.ArrayList;
import java.util.List;

public class ImportResultDto {

    private String message;
    private int totalRows;
    private int importedCount;
    private int skippedCount;
    private List<String> errors = new ArrayList<>();

    public ImportResultDto() {
    }

    public ImportResultDto(String message, int totalRows, int importedCount, int skippedCount, List<String> errors) {
        this.message = message;
        this.totalRows = totalRows;
        this.importedCount = importedCount;
        this.skippedCount = skippedCount;
        this.errors = errors != null ? errors : new ArrayList<>();
    }

    public static ImportResultDto success(int totalRows, int importedCount, List<String> errors) {
        int skippedCount = errors != null ? errors.size() : 0;
        return new ImportResultDto(
                "Import terminé.",
                totalRows,
                importedCount,
                skippedCount,
                errors
        );
    }

    public static ImportResultDto empty() {
        return new ImportResultDto(
                "Aucune ligne valide trouvée dans le fichier.",
                0,
                0,
                0,
                new ArrayList<>()
        );
    }

    public boolean hasErrors() {
        return errors != null && !errors.isEmpty();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getImportedCount() {
        return importedCount;
    }

    public void setImportedCount(int importedCount) {
        this.importedCount = importedCount;
    }

    public int getSkippedCount() {
        return skippedCount;
    }

    public void setSkippedCount(int skippedCount) {
        this.skippedCount = skippedCount;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors != null ? errors : new ArrayList<>();
    }
}
