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
}
