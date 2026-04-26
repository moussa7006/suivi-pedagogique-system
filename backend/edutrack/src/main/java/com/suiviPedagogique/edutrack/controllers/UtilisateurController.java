package com.suiviPedagogique.edutrack.controllers;

import com.suiviPedagogique.edutrack.Dto.UtilisateurDto;
import com.suiviPedagogique.edutrack.services.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping("/lister-tous")
    public ResponseEntity<List<UtilisateurDto>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    @GetMapping("/lister/{id}")
    public ResponseEntity<UtilisateurDto> getUtilisateurById(@PathVariable Integer id) {
        return ResponseEntity.ok(utilisateurService.getUtilisateurById(id));
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<UtilisateurDto> updateUtilisateur(@PathVariable Integer id, @RequestBody UtilisateurDto dto) {
        return ResponseEntity.ok(utilisateurService.updateUtilisateur(id, dto));
    }

    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Integer id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/import-enseignants", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> importEnseignants(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            int count = com.suiviPedagogique.edutrack.services.ExcelImportService.class.cast(
                org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext(
                    ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()).getRequest().getServletContext()
                ).getBean(com.suiviPedagogique.edutrack.services.ExcelImportService.class)
            ).importEnseignants(file);
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("message", count + " enseignants importés avec succès.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("error", "Erreur d'importation: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
