import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeacherService } from '../../core/services/teacher.service';
import { ClasseService } from '../../core/services/classe.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { AttendanceService } from '../../core/services/attendance.service';

interface StatCard {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  trend: string;
  trendClass: 'positive' | 'negative' | 'neutral';
}

interface Activity {
  user: string;
  initials: string;
  action: string;
  meta: string;
  time: string;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
}

interface HubTile {
  label: string;
  route: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="dash-header">
        <div>
          <h1>Tableau de Bord</h1>
          <p>Aperçu en temps réel de l'activité académique</p>
        </div>
        <div class="header-date">
          <i class="pi pi-calendar"></i>
          <span>{{ currentDate }}</span>
        </div>
      </header>

      <!-- Hub de navigation -->
      <section class="hub-grid">
        <a class="hub-tile" *ngFor="let tile of hubTiles" [routerLink]="tile.route" [style.--tile-color]="tile.color">
          <div class="tile-icon">
            <i [class]="tile.icon"></i>
          </div>
          <h3>{{ tile.label }}</h3>
          <span class="tile-link">
            Ouvrir
            <i class="pi pi-arrow-right"></i>
          </span>
          <i class="tile-watermark" [class]="tile.icon" aria-hidden="true"></i>
        </a>
      </section>

      <!-- Stats Cards -->
      <section class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats; let i = index" [style.--delay]="i * 60">
          <div class="stat-icon" [style]="'--c: ' + stat.color">
            <i [class]="stat.icon"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ stat.label }}</span>
            <div class="stat-row">
              <span class="stat-value">{{ stat.value }}{{ stat.suffix }}</span>
              <span class="stat-trend" [class]="stat.trendClass">
                {{ stat.trend }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="content-grid">
        <!-- Chart -->
        <div class="card chart-card">
          <div class="card-header">
            <h3>Taux d'assiduité hebdomadaire</h3>
          </div>
          <div class="simple-chart">
            <div class="chart-bars">
              <div class="bar-col" *ngFor="let d of chartData">
                <div class="bar" [style.height]="d.value + '%'">
                  <span class="bar-value">{{ d.value }}%</span>
                </div>
                <span class="bar-label">{{ d.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card activity-card">
          <div class="card-header">
            <h3>Activités Récentes</h3>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let act of activities">
              <div class="activity-avatar" [style]="'--bg: ' + act.color">
                {{ act.initials }}
              </div>
              <div class="activity-body">
                <div class="activity-text">
                  <strong>{{ act.user }}</strong> {{ act.action }}
                </div>
                <span class="activity-time">{{ act.meta }} · {{ act.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  hubTiles: HubTile[] = [
    { label: 'Classes', route: '/classes', icon: 'pi pi-folder', color: '#3182ce' },
    { label: 'Matières', route: '/matieres', icon: 'pi pi-book', color: '#48bb78' },
    { label: 'Utilisateurs', route: '/teachers', icon: 'pi pi-users', color: '#ed8936' },
    { label: 'Emploi du temps', route: '/schedule', icon: 'pi pi-calendar', color: '#e53e3e' },
    { label: 'Générer QR Code', route: '/qr-generator', icon: 'pi pi-qrcode', color: '#805ad5' },
    { label: 'Emargements', route: '/attendance', icon: 'pi pi-check-square', color: '#319795' },
  ];

  stats: StatCard[] = [
    { label: 'Utilisateurs Actifs', value: 0, suffix: '', icon: 'pi pi-users', color: '#3b82f6', trend: 'Global', trendClass: 'neutral' },
    { label: "Classes créées", value: 0, suffix: '', icon: 'pi pi-folder', color: '#22c55e', trend: 'Global', trendClass: 'neutral' },
    { label: 'Planifications', value: 0, suffix: '', icon: 'pi pi-calendar', color: '#f97316', trend: 'Total', trendClass: 'neutral' },
    { label: 'Progression Moyenne', value: 85, suffix: '%', icon: 'pi pi-book', color: '#a855f7', trend: '+5%', trendClass: 'positive' },
  ];

  chartData: ChartData[] = [
    { label: 'Lun', value: 80 }, { label: 'Mar', value: 60 }, { label: 'Mer', value: 90 },
    { label: 'Jeu', value: 75 }, { label: 'Ven', value: 85 }, { label: 'Sam', value: 70 },
  ];

  activities: Activity[] = [];

  constructor(
    private teacherService: TeacherService,
    private classeService: ClasseService,
    private scheduleService: ScheduleService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.teacherService.getTeachers().subscribe(data => {
      if (data) this.stats[0].value = data.length;
    });

    this.classeService.getAll().subscribe(data => {
      if (data) this.stats[1].value = data.length;
    });

    this.scheduleService.getAllSchedules().subscribe(data => {
      if (data) this.stats[2].value = data.length;
    });

    this.attendanceService.getAllAttendances().subscribe(data => {
      if (data) {
        // Build activities from latest attendances
        const sorted = data.sort((a, b) => new Date(b.dateHeureScan!).getTime() - new Date(a.dateHeureScan!).getTime());
        this.activities = sorted.slice(0, 5).map(e => {
          const initials = e.enseignantNomPrenom ? e.enseignantNomPrenom.substring(0, 2).toUpperCase() : '??';
          return {
            user: e.enseignantNomPrenom || 'Inconnu',
            initials: initials,
            action: e.estConfirme ? 'a validé son émargement.' : 'a scanné son QR code.',
            meta: e.matiereLibelle || 'Séance',
            time: new Date(e.dateHeureScan!).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            color: e.estConfirme ? '#22c55e' : '#f59e0b'
          };
        });
      }
    });
  }
}
