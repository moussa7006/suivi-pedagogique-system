import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArchiveAnnee } from '../../../core/models/archive.model';
import { ArchiveService } from '../../core/services/archive.service';

@Component({
  selector: 'app-archive-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="archive-detail-page">
      <header class="page-header">
        <a routerLink="/web/archives" class="back-link"><i class="pi pi-arrow-left"></i></a>
        <div *ngIf="archive as data">
          <span class="eyebrow">Archive en lecture seule</span>
          <h1>{{ data.annee.libelle }}</h1>
          <p>{{ data.annee.dateDebut | date:'dd MMMM yyyy' }} — {{ data.annee.dateFin | date:'dd MMMM yyyy' }}</p>
        </div>
      </header>

      <div class="loading" *ngIf="isLoading"><i class="pi pi-spinner pi-spin"></i> Chargement de toutes les données…</div>
      <div class="error-state" *ngIf="errorMessage"><i class="pi pi-exclamation-circle"></i> {{ errorMessage }} <a routerLink="/web/archives">Retour aux archives</a></div>

      <ng-container *ngIf="archive as data">
        <section class="stats">
          <div><strong>{{ data.classes.length }}</strong><span>Classes</span></div>
          <div><strong>{{ data.emploisDuTemps.length }}</strong><span>Emplois du temps</span></div>
          <div><strong>{{ data.seances.length }}</strong><span>Séances</span></div>
          <div><strong>{{ data.emargements.length }}</strong><span>Émargements</span></div>
          <div><strong>{{ data.fichesProgression.length }}</strong><span>Fiches</span></div>
          <div><strong>{{ data.honoraires.length }}</strong><span>Détails honoraires</span></div>
        </section>

        <section class="data-section"><h2>Classes</h2><p *ngIf="!data.classes.length">Aucune classe enregistrée.</p><div class="chips"><span *ngFor="let item of data.classes">{{ item.libelle }}</span></div></section>
        <section class="data-section"><h2>Emplois du temps</h2><p *ngIf="!data.emploisDuTemps.length">Aucun emploi du temps enregistré.</p><div class="table-wrap" *ngIf="data.emploisDuTemps.length"><table><thead><tr><th>Titre</th><th>Validité</th><th>Horaires</th><th>Classe</th><th>Matière</th></tr></thead><tbody><tr *ngFor="let item of data.emploisDuTemps"><td>{{ item.titre || 'Sans titre' }}</td><td>{{ item.dateDebutValidite | date:'dd/MM/yyyy' }} — {{ item.dateFinValidite | date:'dd/MM/yyyy' }}</td><td>{{ item.heureDebut }} — {{ item.heureFin }}</td><td>{{ labelForClass(data, item.classeId) }}</td><td>{{ labelForSubject(item.matiereId) }}</td></tr></tbody></table></div></section>
        <section class="data-section"><h2>Séances</h2><p *ngIf="!data.seances.length">Aucune séance enregistrée.</p><div class="table-wrap" *ngIf="data.seances.length"><table><thead><tr><th>Date</th><th>Horaires</th><th>Classe</th><th>Statut</th><th>Émargement</th><th>Fiche</th></tr></thead><tbody><tr *ngFor="let item of data.seances"><td>{{ item.dateCours | date:'dd/MM/yyyy' }}</td><td>{{ item.heureDebutReelle }} — {{ item.heureFinReelle }}</td><td>{{ labelForClass(data, item.classeId) }}</td><td>{{ item.statut }}</td><td>{{ item.emargementId ? 'Oui' : 'Non' }}</td><td>{{ item.ficheProgressionId ? 'Oui' : 'Non' }}</td></tr></tbody></table></div></section>
        <section class="data-section"><h2>Émargements</h2><p *ngIf="!data.emargements.length">Aucun émargement enregistré.</p><div class="table-wrap" *ngIf="data.emargements.length"><table><thead><tr><th>Scan</th><th>Enseignant</th><th>Lieu</th><th>Statut</th></tr></thead><tbody><tr *ngFor="let item of data.emargements"><td>{{ item.dateHeureScan | date:'dd/MM/yyyy HH:mm' }}</td><td>{{ item.enseignantNomPrenom }}</td><td>{{ item.lieu }}</td><td>{{ item.statut }}</td></tr></tbody></table></div></section>
        <section class="data-section"><h2>Fiches de progression</h2><p *ngIf="!data.fichesProgression.length">Aucune fiche enregistrée.</p><div class="table-wrap" *ngIf="data.fichesProgression.length"><table><thead><tr><th>Date</th><th>Séance</th><th>Matière</th><th>Enseignant</th><th>Validation</th></tr></thead><tbody><tr *ngFor="let item of data.fichesProgression"><td>{{ item.dateSaisie | date:'dd/MM/yyyy' }}</td><td>{{ item.dateSeance }}</td><td>{{ item.matiereLibelle }}</td><td>{{ item.enseignantNomPrenom }}</td><td>{{ item.estValideAdmin ? 'Validée' : 'Non validée' }}</td></tr></tbody></table></div></section>
        <section class="data-section"><h2>Honoraires</h2><p *ngIf="!data.honoraires.length">Aucun détail d’honoraire rattaché aux séances de cette année.</p><div class="table-wrap" *ngIf="data.honoraires.length"><table><thead><tr><th>Date</th><th>Enseignant</th><th>Classe</th><th>Matière</th><th>Heures</th><th>Montant</th></tr></thead><tbody><tr *ngFor="let item of data.honoraires"><td>{{ item.dateCours | date:'dd/MM/yyyy' }}</td><td>{{ item.enseignantNomPrenom }}</td><td>{{ item.classeLibelle }}</td><td>{{ item.matiereLibelle }}</td><td>{{ item.nombreHeures }}</td><td>{{ item.montant | number:'1.2-2' }}</td></tr></tbody></table></div></section>
      </ng-container>
    </div>
  `,
  styles: [`:host{display:block}.archive-detail-page{max-width:1240px;margin:0 auto;padding:34px 38px 56px;color:#172033}.page-header{display:flex;gap:16px;align-items:flex-start;margin-bottom:28px}.back-link{display:grid;place-items:center;width:42px;height:42px;border:1px solid #dce5ef;border-radius:12px;color:#23415f;background:#fff;text-decoration:none}.eyebrow{color:#2778b5;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.page-header h1{margin:5px 0;font-size:30px;color:#102a43}.page-header p{margin:0;color:#64748b}.stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}.stats div{padding:16px;border:1px solid #dce8f1;border-radius:14px;background:#f7fbfe}.stats strong,.stats span{display:block}.stats strong{font-size:24px;color:#176baf}.stats span{margin-top:4px;color:#60778b;font-size:12px;font-weight:700}.data-section{margin:18px 0;padding:20px;border:1px solid #e2eaf1;border-radius:16px;background:#fff}.data-section h2{margin:0 0 14px;color:#193b56;font-size:19px}.data-section p{color:#64748b;font-size:13px}.chips{display:flex;flex-wrap:wrap;gap:9px}.chips span{padding:8px 12px;border-radius:999px;background:#edf6fc;color:#176baf;font-size:13px;font-weight:700}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:650px}th,td{text-align:left;padding:11px 10px;border-bottom:1px solid #edf1f4;font-size:12px}th{color:#60778b;background:#f7fafc;font-size:11px;text-transform:uppercase}td{color:#304b60}.loading,.error-state{display:flex;gap:10px;justify-content:center;align-items:center;min-height:120px;color:#60778b}.error-state{color:#b42318;flex-wrap:wrap}.error-state a{color:#176baf;font-weight:700}@media(max-width:800px){.archive-detail-page{padding:24px 18px}.stats{grid-template-columns:repeat(2,1fr)}}`],
})
export class ArchiveDetailComponent implements OnInit {
  archive?: ArchiveAnnee;
  isLoading = true;
  errorMessage = '';
  private readonly route = inject(ActivatedRoute);
  private readonly archiveService = inject(ArchiveService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) { this.isLoading = false; this.errorMessage = 'Identifiant d’archive invalide.'; return; }
    this.archiveService.getArchive(id).subscribe({ next: data => { this.archive = data; this.isLoading = false; this.cdr.detectChanges(); }, error: () => { this.isLoading = false; this.errorMessage = 'Impossible de charger cette archive.'; this.cdr.detectChanges(); } });
  }

  labelForClass(data: ArchiveAnnee, id?: number): string { return data.classes.find(item => item.id === id)?.libelle || '—'; }
  labelForSubject(_id?: number): string { return '—'; }
}
