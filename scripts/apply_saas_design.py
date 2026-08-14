import os

filepath = 'frontend-ionic/src/app/web-admin/features/dashboard/dashboard.component.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_str = "  styles: ["
end_str = "export class DashboardComponent"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_styles = """  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        margin: -1.5rem;
        padding: 2.5rem;
        background-color: #f1f5f9; /* Gris ultra clair - style SaaS */
      }

      .dashboard-shell {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 40px;
        padding-bottom: 36px;
        color: #0f172a;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      /* Titres de sections */
      .section-heading {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      }

      .section-heading h2 {
        margin: 0;
        color: #1e293b;
        font-size: 1.4rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .section-heading span {
        background: #e2e8f0;
        color: #475569;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.75rem;
      }

      .hub-grid, .bento-grid {
        display: grid;
        gap: 20px;
      }

      /* ==============================================================
         DESIGN SAAS CORPORATE - Cartes & Tuiles
         ============================================================== */
         
      .stats-overview {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 20px;
      }

      /* Base commune */
      .stat-card, .hub-tile, .bento-card, .cycle-wrapper {
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
        transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
      }

      /* Effet Hover (Léger soulèvement) */
      .stat-card:hover, .hub-tile:hover, .bento-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      /* ---------- 1. STAT CARDS ---------- */
      .stat-card {
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .stat-card:hover {
        border-color: var(--accent);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--accent) 10%, transparent);
        color: var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
      }

      .stat-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #64748b;
        display: block;
      }
      
      .stat-number {
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
      }

      .stat-value-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 4px;
      }

      .stat-badge {
        padding: 4px 6px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;

        &.positive { background: #f0fdf4; color: #166534; }
        &.negative { background: #fef2f2; color: #991b1b; }
        &.neutral { background: #f8fafc; color: #475569; }
      }

      /* ---------- 2. HUB TILES ---------- */
      .hub-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .hub-tile {
        --tile-color: #6366f1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
      }
      
      .hub-tile:hover {
         border-color: var(--tile-color);
      }

      .tile-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .tile-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--tile-color) 10%, transparent);
        color: var(--tile-color);
        font-size: 1.25rem;
      }

      .tile-indicator {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--tile-color);
        background: color-mix(in srgb, var(--tile-color) 8%, transparent);
        padding: 4px 8px;
        border-radius: 6px;
      }

      .tile-body h3 {
        margin: 0 0 6px;
        color: #1e293b;
        font-size: 1.05rem;
        font-weight: 600;
      }

      .tile-progress {
        height: 6px;
        background: #f1f5f9;
        border-radius: 4px;
        overflow: hidden;
      }

      .tile-progress-bar {
        height: 100%;
        background: var(--gauge-color);
        border-radius: 4px;
      }

      .tile-arrow {
        align-self: flex-end;
        color: #cbd5e1;
        font-size: 0.9rem;
        transition: transform 0.2s ease, color 0.2s ease;
      }
      
      .hub-tile:hover .tile-arrow {
         transform: translateX(4px);
         color: var(--tile-color);
      }

      /* ---------- 3. BENTO CARDS ---------- */
      .bento-grid {
        grid-template-columns: repeat(12, minmax(0, 1fr));
      }
      .col-span-8 { grid-column: span 8; }
      .col-span-4 { grid-column: span 4; }
      .col-span-12 { grid-column: span 12; }

      .bento-column {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .bento-card {
        padding: 24px;
        display: flex;
        flex-direction: column;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
      }

      .card-header h3 {
        margin: 0 0 4px;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1e293b;
      }

      .card-header p {
        margin: 0;
        font-size: 0.85rem;
        color: #64748b;
      }

      .header-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: #f1f5f9;
        color: #475569;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
      }

      .chart-wrapper {
        flex: 1;
        min-height: 250px;
      }

      /* ---------- 4. STATUT DES SÉANCES ---------- */
      .cycle-wrapper {
        display: flex;
        align-items: center;
        padding: 24px;
      }

      .cycle-chart {
        flex: 1;
        min-height: 300px;
      }

      .cycle-legend {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-left: 32px;
        border-left: 1px solid #f1f5f9;
      }

      .legend-item {
        display: flex;
        gap: 16px;
      }

      .legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-top: 4px;
        flex-shrink: 0;
      }

      .legend-text strong {
        display: block;
        color: #1e293b;
        font-size: 0.95rem;
        margin-bottom: 2px;
      }

      .legend-text span {
        font-size: 0.8rem;
        color: #64748b;
        font-weight: 600;
      }

      .legend-text p {
        margin: 4px 0 0;
        font-size: 0.85rem;
        color: #475569;
      }
    `,
  ],
})
"""
    new_content = content[:start_idx] + new_styles + content[end_idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Styles appliqués.")
else:
    print("Échec de la recherche des limites.")
