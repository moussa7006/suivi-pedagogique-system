import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
  `,
  styles: [
    `
      :host { display: block; }
      .dashboard { display: flex; flex-direction: column; gap: 24px; padding: 24px; max-width: 1400px; width: 100%; margin: 0 auto; opacity: 0; animation: fadeIn 0.5s ease forwards; }
      @keyframes fadeIn { to { opacity: 1; } }
      .dash-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; }
      .dash-header h1 { margin: 0 0 4px; font-size: clamp(1.2rem, 4vw, 1.6rem); font-weight: 700; color: #0f172a; }
      .dash-header p { margin: 0; font-size: clamp(0.8rem, 2.5vw, 0.9rem); color: #64748b; font-weight: 400; }
      .header-date { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fff; border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.8rem; font-weight: 500; color: #475569; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
      .stat-card { background: #fff; border: 2px solid rgba(226, 232, 240, 0.7); border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 16px; transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease; position: relative; overflow: hidden; opacity: 0; transform: translateY(8px); animation: slideUp 0.4s ease forwards; animation-delay: var(--delay, 0ms); }
      .stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--c, #3b82f6); border-radius: 4px 0 0 4px; transform: scaleY(0); transform-origin: bottom; transition: transform 0.3s ease; }
      .stat-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 32px rgba(2, 6, 23, 0.1); }
      .stat-card:hover::before { transform: scaleY(1); }
      @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
      .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; color: var(--c); background: color-mix(in srgb, var(--c) 12%, white); flex-shrink: 0; }
      .stat-info { display: flex; flex-direction: column; gap: 4px; }
      .stat-label { font-size: 0.8rem; font-weight: 500; color: #64748b; }
      .stat-row { display: flex; align-items: baseline; gap: 8px; }
      .stat-value { font-size: 1.35rem; font-weight: 700; color: #0f172a; line-height: 1; }
      .stat-trend { font-size: 0.72rem; font-weight: 600; }
      .stat-trend.positive { color: #16a34a; }
      .content-grid { display: grid; grid-template-columns: 2fr 1.2fr; gap: 20px; }
      .card { background: #fff; border: 1px solid rgba(226, 232, 240, 0.7); border-radius: 14px; padding: 24px; }
      .card-header h3 { margin: 0 0 16px; font-size: 1rem; font-weight: 600; color: #1e293b; }
      .chart-bars { display: flex; align-items: flex-end; gap: clamp(12px, 3vw, 24px); height: 160px; }
      .bar-col { display: flex; flex-direction: column; flex: 1; align-items: center; gap: 6px; }
      .bar { width: 100%; max-width: 48px; background: linear-gradient(180deg, #3b82f6, #93c5fd); border-radius: 8px 8px 4px 4px; display: flex; justify-content: flex-start; padding-top: 4px; min-height: 8px; }
      .bar-value { font-size: 0.65rem; font-weight: 700; color: #fff; line-height: 1; margin-left: auto; margin-right: auto;}
      .bar-label { font-size: 0.75rem; color: #64748b; font-weight: 500; }
      .activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(241, 245, 249, 0.9); }
      .activity-avatar { width: 36px; height: 36px; border-radius: 10px; background: color-mix(in srgb, var(--bg) 12%, white); color: var(--bg); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; }
      .activity-text { font-size: 0.85rem; color: #334155; }
      .activity-text strong { color: #0f172a; font-weight: 600; }
      .activity-time { font-size: 0.72rem; color: #94a3b8; font-weight: 500; }
    `
  ]
})
export class DashboardComponent implements OnInit {
  currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

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
