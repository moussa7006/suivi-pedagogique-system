import { Injectable } from '@angular/core';
import { LessonLog } from '../models/lesson-log.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Exporte les données du cahier de texte en PDF (ouvre une fenêtre imprimable)
   */
  exportToPdf(data: LessonLog[], filename: string = 'cahier-de-texte'): void {
    const htmlContent = this.generatePdfHtml(data);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      };
    }
  }

  /**
   * Exporte les données du cahier de texte en CSV (ouvrable dans Excel)
   */
  exportToExcel(data: LessonLog[], filename: string = 'cahier-de-texte'): void {
    const csvContent = this.generateCsv(data);
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, `${filename}.csv`);
  }

  /**
   * Exporte une seule séance en PDF avec tous les détails
   */
  exportSingleToPdf(log: LessonLog): void {
    const htmlContent = this.generateSinglePdfHtml(log);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      };
    }
  }

  // ──────────────────────────────────────────────
  // Génération HTML pour export PDF (liste)
  // ──────────────────────────────────────────────
  private generatePdfHtml(data: LessonLog[]): string {
    const rows = data.map(log => `
      <tr>
        <td>${log.id}</td>
        <td><strong>${this.escapeHtml(log.titleCours)}</strong></td>
        <td>${this.escapeHtml(log.contenu)}</td>
        <td>${this.formatDate(log.dateDeCreation)}</td>
        <td>${log.pieceJointe ? this.escapeHtml(log.pieceJointe.nom) : '<em>Aucune</em>'}</td>
        <td>${this.escapeHtml(log.teacherName)}</td>
        <td>${this.escapeHtml(log.subject)}</td>
        <td><span class="status status-${this.getStatusClass(log.status)}">${log.status}</span></td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Cahier de Texte - Export PDF</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 32px; background: #fff; }
    .header { border-bottom: 3px solid #1d4ed8; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { color: #1d4ed8; font-size: 1.5rem; margin-bottom: 4px; }
    .header .subtitle { color: #64748b; font-size: 0.9rem; }
    .meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 0.8rem; color: #64748b; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    .total-count { background: #dbeafe; color: #1d4ed8; padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 8px; }
    thead th { background: #1d4ed8; color: white; padding: 12px 14px; text-align: left; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.03em; }
    thead th:first-child { border-radius: 8px 0 0 0; }
    thead th:last-child { border-radius: 0 8px 0 0; }
    tbody td { padding: 11px 14px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    tbody tr:hover { background: #eff6ff; }
    .status { font-weight: 700; padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-validated { background: #dcfce7; color: #166534; }
    .status-rejected { background: #fee2e2; color: #991b1b; }
    .footer { margin-top: 32px; text-align: center; font-size: 0.75rem; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
    @media print {
      body { padding: 16px; }
      table { font-size: 0.78rem; }
      thead th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .status { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📘 Cahier de Texte</h1>
    <div class="subtitle">Liste des séances pédagogiques — Suivi Pédagogique</div>
  </div>
  <div class="meta">
    <span>Généré le : ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} à ${new Date().toLocaleTimeString('fr-FR')}</span>
    <span class="total-count">${data.length} séance${data.length > 1 ? 's' : ''}</span>
  </div>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Titre du Cours</th>
        <th>Contenu</th>
        <th>Date de Création</th>
        <th>Pièce Jointe</th>
        <th>Enseignant</th>
        <th>Matière</th>
        <th>Statut</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Suivi Pédagogique — Document généré automatiquement</div>
</body>
</html>`;
  }

  // ──────────────────────────────────────────────
  // Génération HTML pour export PDF (séance unique)
  // ──────────────────────────────────────────────
  private generateSinglePdfHtml(log: LessonLog): string {
    const statusClass = this.getStatusClass(log.status);

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Séance #${log.id} - ${this.escapeHtml(log.titleCours)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 40px; background: #fff; max-width: 800px; margin: 0 auto; }
    .document { border: 2px solid #1d4ed8; border-radius: 16px; overflow: hidden; }
    .doc-header { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; padding: 28px 32px; }
    .doc-header h1 { font-size: 1.4rem; margin-bottom: 4px; }
    .doc-header .id-badge { font-size: 0.85rem; opacity: 0.85; }
    .doc-body { padding: 28px 32px; }
    .field-group { margin-bottom: 20px; }
    .field-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-bottom: 6px; }
    .field-value { font-size: 1rem; color: #0f172a; line-height: 1.65; }
    .field-value.contenu { background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .status-tag { display: inline-block; padding: 5px 16px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-validated { background: #dcfce7; color: #166534; }
    .status-rejected { background: #fee2e2; color: #991b1b; }
    .piece-jointe { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; }
    .piece-jointe i { color: #0284c7; }
    .piece-jointe a { color: #0284c7; text-decoration: none; font-weight: 600; }
    .piece-jointe a:hover { text-decoration: underline; }
    .no-attachment { color: #94a3b8; font-style: italic; }
    .doc-footer { border-top: 1px solid #e2e8f0; margin-top: 28px; padding-top: 16px; display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; }
    @media print { body { padding: 16px; } .document { border-width: 1px; } }
  </style>
</head>
<body>
  <div class="document">
    <div class="doc-header">
      <div class="id-badge">Séance #${log.id}</div>
      <h1>${this.escapeHtml(log.titleCours)}</h1>
      <span class="status-tag status-${statusClass}" style="margin-top:8px;">${log.status}</span>
    </div>
    <div class="doc-body">
      <div class="field-group">
        <div class="field-label">📅 Date de création</div>
        <div class="field-value">${this.formatDate(log.dateDeCreation)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">👨‍🏫 Enseignant</div>
        <div class="field-value">${this.escapeHtml(log.teacherName)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">📚 Matière</div>
        <div class="field-value">${this.escapeHtml(log.subject)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">📝 Contenu</div>
        <div class="field-value contenu">${this.escapeHtml(log.contenu)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">📎 Pièce jointe</div>
        ${log.pieceJointe
          ? `<div class="piece-jointe"><i>📄</i><span>${this.escapeHtml(log.pieceJointe.nom)}</span><span style="color:#64748b;font-size:0.8rem;">(${this.formatFileSize(log.pieceJointe.taille)})</span></div>`
          : '<div class="no-attachment">Aucune pièce jointe</div>'
        }
      </div>
      ${log.comments ? `
      <div class="field-group">
        <div class="field-label">💬 Commentaires</div>
        <div class="field-value">${this.escapeHtml(log.comments)}</div>
      </div>` : ''}
    </div>
  </div>
  <div class="doc-footer">
    <span>Suivi Pédagogique — Document généré automatiquement</span>
    <span>${new Date().toLocaleDateString('fr-FR')}</span>
  </div>
</body>
</html>`;
  }

  // ──────────────────────────────────────────────
  // Génération CSV pour export Excel
  // ──────────────────────────────────────────────
  private generateCsv(data: LessonLog[]): string {
    const headers = ['ID', 'Titre du Cours', 'Contenu', 'Date de Création', 'Pièce Jointe', 'Enseignant', 'Matière', 'Statut'];
    const rows = data.map(log => [
      log.id,
      this.escapeCsv(log.titleCours),
      this.escapeCsv(log.contenu),
      this.formatDate(log.dateDeCreation),
      log.pieceJointe ? this.escapeCsv(log.pieceJointe.nom) : 'Aucune',
      this.escapeCsv(log.teacherName),
      this.escapeCsv(log.subject),
      log.status
    ].join(';'));

    return [headers.join(';'), ...rows].join('\n');
  }

  // ──────────────────────────────────────────────
  // Utilitaires
  // ──────────────────────────────────────────────
  private escapeHtml(text: string): string {
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  private escapeCsv(value: string): string {
    if (value.includes(';') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / 1048576).toFixed(1) + ' Mo';
  }

  private getStatusClass(status: string): string {
    switch (status) {
      case 'En attente': return 'pending';
      case 'Validé': return 'validated';
      case 'Rejeté': return 'rejected';
      default: return 'pending';
    }
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
