import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnneeUniversitaire } from '../../core/models/annee-universitaire.model';
import { AnneeUniversitaireService } from '../../core/services/annee-universitaire.service';
import { sortByAlpha } from '../../core/utils/sort-utils';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="archives-page">
      <header class="page-header">
        <div class="header-copy">
          <a routerLink="/web/dashboard" class="back-link" title="Retour au tableau de bord">
            <i class="pi pi-arrow-left"></i>
          </a>
          <div>
            <span class="eyebrow">Historique institutionnel</span>
            <h1>Archives</h1>
            <p>Les années universitaires clôturées sont conservées ici en lecture seule.</p>
          </div>
        </div>
        <a routerLink="/web/annees-universitaires" class="manage-link">
          <i class="pi pi-calendar-plus"></i>
          Gérer les années
        </a>
      </header>

      <section class="summary" *ngIf="!isLoading">
        <div class="archive-icon"><i class="pi pi-box"></i></div>
        <div>
          <strong>{{ archivedYears.length }}</strong>
          <span>{{ archivedYears.length > 1 ? 'années archivées' : 'année archivée' }}</span>
        </div>
      </section>

      <div class="loading" *ngIf="isLoading">
        <i class="pi pi-spinner pi-spin"></i>
        Chargement des archives…
      </div>

      <div class="error-state" *ngIf="errorMessage">
        <i class="pi pi-exclamation-circle"></i>
        <span>{{ errorMessage }}</span>
        <button type="button" (click)="loadArchives()">Réessayer</button>
      </div>

      <section class="archive-grid" *ngIf="!isLoading && !errorMessage && archivedYears.length">
        <article class="archive-item" *ngFor="let year of archivedYears">
          <div class="item-topline">
            <span class="archive-badge"><i class="pi pi-lock"></i> Clôturée</span>
            <i class="pi pi-calendar-times muted-icon"></i>
          </div>
          <h2>{{ year.libelle }}</h2>
          <div class="date-range">
            <div>
              <span>Début</span>
              <strong>{{ year.dateDebut | date: 'dd MMMM yyyy' }}</strong>
            </div>
            <i class="pi pi-arrow-right"></i>
            <div>
              <span>Fin</span>
              <strong>{{ year.dateFin | date: 'dd MMMM yyyy' }}</strong>
            </div>
          </div>
          <p>Cette année est clôturée automatiquement. Ses données restent consultables, mais ne peuvent plus être modifiées.</p>
        </article>
      </section>

      <section class="empty-state" *ngIf="!isLoading && !errorMessage && !archivedYears.length">
        <div class="empty-icon"><i class="pi pi-inbox"></i></div>
        <h2>Aucune archive pour le moment</h2>
        <p>Les années universitaires apparaîtront ici automatiquement après leur date de fin.</p>
        <a routerLink="/web/annees-universitaires">Voir les années universitaires</a>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100%; }
    .archives-page { max-width: 1240px; margin: 0 auto; padding: 34px 38px 56px; color: #172033; }
    .page-header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; margin-bottom: 30px; }
    .header-copy { display: flex; gap: 16px; align-items: flex-start; }
    .back-link { display: grid; place-items: center; width: 42px; height: 42px; margin-top: 5px; border: 1px solid #dce5ef; border-radius: 12px; color: #23415f; text-decoration: none; background: #fff; transition: .2s ease; }
    .back-link:hover { color: #fff; background: #176baf; border-color: #176baf; }
    .eyebrow { display: block; color: #2778b5; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 5px; }
    h1 { font-size: 30px; line-height: 1.1; margin: 0; letter-spacing: -.04em; color: #102a43; }
    .page-header p { margin: 8px 0 0; color: #64748b; font-size: 14px; }
    .manage-link { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; padding: 11px 15px; border: 1px solid #bdd9ed; border-radius: 10px; background: #f4fbff; color: #12649e; font-size: 13px; font-weight: 700; text-decoration: none; }
    .summary { display: inline-flex; align-items: center; gap: 12px; min-width: 180px; margin-bottom: 25px; padding: 12px 16px; border-radius: 14px; background: #eff8ff; border: 1px solid #d4eafb; }
    .archive-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; background: #176baf; color: #fff; }
    .summary div:last-child { display: flex; flex-direction: column; gap: 1px; }
    .summary strong { font-size: 22px; line-height: 1; color: #123d61; }
    .summary span { color: #5d7185; font-size: 12px; font-weight: 600; }
    .archive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(285px, 1fr)); gap: 18px; }
    .archive-item { position: relative; overflow: hidden; padding: 22px; min-height: 235px; border: 1px solid #e2eaf1; border-radius: 16px; background: #fff; box-shadow: 0 8px 24px rgba(15, 54, 81, .045); }
    .archive-item::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 4px; background: #4c9acb; }
    .item-topline { display: flex; justify-content: space-between; align-items: center; }
    .archive-badge { display: inline-flex; gap: 6px; align-items: center; color: #486174; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
    .muted-icon { color: #98adbd; font-size: 18px; }
    .archive-item h2 { margin: 22px 0 17px; font-size: 21px; color: #193b56; letter-spacing: -.02em; }
    .date-range { display: grid; grid-template-columns: 1fr auto 1fr; gap: 9px; align-items: center; padding: 12px; border-radius: 10px; background: #f7fafc; }
    .date-range div { min-width: 0; }
    .date-range div:last-child { text-align: right; }
    .date-range span { display: block; margin-bottom: 4px; color: #7a8d9f; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
    .date-range strong { color: #365166; font-size: 11px; white-space: nowrap; }
    .date-range i { color: #88a2b4; font-size: 12px; }
    .archive-item p { margin: 17px 0 0; color: #6a7e90; font-size: 12px; line-height: 1.55; }
    .loading, .error-state { display: flex; align-items: center; gap: 10px; min-height: 120px; justify-content: center; color: #60778b; }
    .error-state { color: #b42318; flex-wrap: wrap; }
    .error-state button { border: 0; background: #b42318; color: #fff; border-radius: 7px; padding: 7px 11px; cursor: pointer; }
    .empty-state { max-width: 520px; margin: 68px auto; text-align: center; color: #64748b; }
    .empty-icon { display: grid; place-items: center; width: 64px; height: 64px; margin: 0 auto 18px; border-radius: 20px; background: #edf6fc; color: #2778b5; font-size: 28px; }
    .empty-state h2 { color: #1e3a52; font-size: 20px; margin: 0 0 8px; }
    .empty-state p { font-size: 14px; line-height: 1.55; margin: 0 auto 20px; max-width: 410px; }
    .empty-state a { color: #176baf; font-size: 13px; font-weight: 800; text-decoration: none; }
    @media (max-width: 650px) { .archives-page { padding: 24px 18px 42px; } .page-header { flex-direction: column; } .manage-link { margin-left: 58px; } }
  `],
})
export class ArchivesComponent implements OnInit {
  archivedYears: AnneeUniversitaire[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly anneeService: AnneeUniversitaireService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadArchives();
  }

  loadArchives(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.anneeService.getAll().subscribe({
      next: (years) => {
        this.archivedYears = sortByAlpha(
          years.filter((year) => year.archivee === true),
          (year) => year.libelle,
          'desc',
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Impossible de charger les archives. Vérifiez la connexion au serveur.';
        this.cdr.detectChanges();
      },
    });
  }
}
