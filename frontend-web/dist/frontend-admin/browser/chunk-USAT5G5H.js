import {
  CommonModule,
  Component,
  Injectable,
  NgClass,
  of,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-CJ6OLCZO.js";

// src/app/core/services/pedagogy.service.ts
var PedagogyService = class _PedagogyService {
  logs = [
    {
      id: 1,
      teacherName: "Dr. Alou Diarra",
      subject: "Algorithmique",
      date: "2026-03-10",
      startTime: "08:00",
      endTime: "10:00",
      chapter: "Chapitre 3 : Les Arbres",
      content: "\xC9tude des arbres binaires de recherche et parcours (Infixe, Pr\xE9fixe).",
      status: "En attente"
    },
    {
      id: 2,
      teacherName: "K. Barry",
      subject: "Math\xE9matiques",
      date: "2026-03-10",
      startTime: "10:30",
      endTime: "12:30",
      chapter: "Probabilit\xE9s",
      content: "Variables al\xE9atoires discr\xE8tes et loi de Bernoulli.",
      status: "Valid\xE9"
    },
    {
      id: 3,
      teacherName: "F. Coulibaly",
      subject: "Informatique",
      date: "2026-03-09",
      startTime: "14:00",
      endTime: "16:00",
      chapter: "SQL Avanc\xE9",
      content: "Les jointures externes et les sous-requ\xEAtes corr\xE9l\xE9es.",
      status: "En attente"
    }
  ];
  getLessonLogs() {
    return of(this.logs);
  }
  validateLog(id, status) {
    const log = this.logs.find((l) => l.id === id);
    if (log)
      log.status = status;
  }
  static \u0275fac = function PedagogyService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PedagogyService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PedagogyService, factory: _PedagogyService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PedagogyService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/pedagogy/pedagogy.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function PedagogyComponent_For_42_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 39)(1, "button", 41);
    \u0275\u0275listener("click", function PedagogyComponent_For_42_Conditional_30_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const log_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.updateStatus(log_r2.id, "Valid\xE9"));
    });
    \u0275\u0275element(2, "i", 42);
    \u0275\u0275text(3, " Approuver ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 43);
    \u0275\u0275listener("click", function PedagogyComponent_For_42_Conditional_30_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const log_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.updateStatus(log_r2.id, "Rejet\xE9"));
    });
    \u0275\u0275element(5, "i", 44);
    \u0275\u0275text(6, " Rejeter ");
    \u0275\u0275elementEnd()();
  }
}
function PedagogyComponent_For_42_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275element(1, "i", 45);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const log_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", log_r2.status.toLowerCase());
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r2.getValidatedIcon(log_r2.status));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S\xE9ance ", log_r2.status.toLowerCase(), "e");
  }
}
function PedagogyComponent_For_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 22)(2, "div", 23)(3, "div", 24);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 25)(6, "span", 26);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 27);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 28);
    \u0275\u0275element(11, "span", 29);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 30)(14, "div", 31)(15, "div", 32);
    \u0275\u0275element(16, "i", 33);
    \u0275\u0275elementStart(17, "span", 34);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "p", 35);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 36)(22, "span", 37);
    \u0275\u0275element(23, "i", 16);
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "span", 37);
    \u0275\u0275element(27, "i", 38);
    \u0275\u0275elementStart(28, "span");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(30, PedagogyComponent_For_42_Conditional_30_Template, 7, 0, "div", 39)(31, PedagogyComponent_For_42_Conditional_31_Template, 4, 3, "div", 40);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const log_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r2.getStatusClass(log_r2.status));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.getInitials(log_r2.teacherName));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(log_r2.teacherName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", log_r2.subject, " \u2022 ", log_r2.date);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r2.getStatusClass(log_r2.status));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", log_r2.status, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(log_r2.chapter);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r2.content);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", log_r2.startTime, " - ", log_r2.endTime, " (2h 00)");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(log_r2.date);
    \u0275\u0275advance();
    \u0275\u0275conditional(log_r2.status === "En attente" ? 30 : 31);
  }
}
var PedagogyComponent = class _PedagogyComponent {
  pedagogyService;
  lessonLogs = [];
  constructor(pedagogyService) {
    this.pedagogyService = pedagogyService;
  }
  ngOnInit() {
    this.pedagogyService.getLessonLogs().subscribe((data) => this.lessonLogs = data);
  }
  updateStatus(id, status) {
    this.pedagogyService.validateLog(id, status);
  }
  getStatusClass(status) {
    switch (status) {
      case "En attente":
        return "pending";
      case "Valid\xE9":
        return "validated";
      case "Rejet\xE9":
        return "rejected";
      default:
        return "pending";
    }
  }
  getInitials(name) {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  getValidatedIcon(status) {
    return status === "Valid\xE9" ? "pi-check-circle" : "pi-exclamation-circle";
  }
  static \u0275fac = function PedagogyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PedagogyComponent)(\u0275\u0275directiveInject(PedagogyService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PedagogyComponent, selectors: [["app-pedagogy"]], decls: 43, vars: 0, consts: [[1, "pedagogy-container"], [1, "page-header"], [1, "header-left"], [1, "pi", "pi-book"], [1, "header-actions"], [1, "btn", "btn-outline"], [1, "pi", "pi-filter"], [1, "pi", "pi-download"], [1, "stats-summary"], [1, "summary-card", "total"], [1, "stat-icon", "blue"], [1, "stat-content"], [1, "value"], [1, "label"], [1, "summary-card", "warning"], [1, "stat-icon", "orange"], [1, "pi", "pi-clock"], [1, "summary-card", "success"], [1, "stat-icon", "green"], [1, "pi", "pi-check-circle"], [1, "logs-list"], [1, "log-card", 3, "ngClass"], [1, "log-header"], [1, "teacher-info"], [1, "teacher-avatar"], [1, "details"], [1, "name"], [1, "subject"], [1, "status-badge", 3, "ngClass"], [1, "status-dot"], [1, "log-body"], [1, "content-section"], [1, "chapter-header"], [1, "pi", "pi-folder"], [1, "chapter-title"], [1, "content-text"], [1, "meta-info"], [1, "meta-item"], [1, "pi", "pi-calendar"], [1, "actions"], [1, "validated-label", 3, "ngClass"], [1, "btn", "btn-approve", 3, "click"], [1, "pi", "pi-check"], [1, "btn", "btn-reject", 3, "click"], [1, "pi", "pi-times"], [1, "pi", 3, "ngClass"]], template: function PedagogyComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Validation P\xE9dagogique");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p");
      \u0275\u0275text(7, "V\xE9rifiez et approuvez les cahiers de textes des enseignants");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 4)(9, "button", 5);
      \u0275\u0275element(10, "i", 6);
      \u0275\u0275text(11, " Filtres");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "button", 5);
      \u0275\u0275element(13, "i", 7);
      \u0275\u0275text(14, " Exporter");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 8)(16, "div", 9)(17, "div", 10);
      \u0275\u0275element(18, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 11)(20, "span", 12);
      \u0275\u0275text(21, "42");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "span", 13);
      \u0275\u0275text(23, "Total S\xE9ances");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "div", 14)(25, "div", 15);
      \u0275\u0275element(26, "i", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 11)(28, "span", 12);
      \u0275\u0275text(29, "12");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "span", 13);
      \u0275\u0275text(31, "\xC0 Valider");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(32, "div", 17)(33, "div", 18);
      \u0275\u0275element(34, "i", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "div", 11)(36, "span", 12);
      \u0275\u0275text(37, "28");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "span", 13);
      \u0275\u0275text(39, "Approuv\xE9es");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(40, "div", 20);
      \u0275\u0275repeaterCreate(41, PedagogyComponent_For_42_Template, 32, 13, "div", 21, _forTrack0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(41);
      \u0275\u0275repeater(ctx.lessonLogs);
    }
  }, dependencies: [CommonModule, NgClass], styles: ['@charset "UTF-8";\n\n\n\n.pedagogy-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 28px;\n}\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.75rem;\n  font-weight: 800;\n  color: #0f172a;\n  letter-spacing: -0.02em;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 6px 0 0;\n  font-size: 0.95rem;\n  font-weight: 500;\n}\n.page-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 11px 18px;\n  border-radius: 12px;\n  font-weight: 600;\n  font-size: 0.9rem;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  border: none;\n  transition: all 0.15s ease;\n}\n.btn[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n.btn.btn-outline[_ngcontent-%COMP%] {\n  background: white;\n  border: 1px solid var(--border-color);\n  color: #475569;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);\n}\n.btn.btn-outline[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n  transform: translateY(-1px);\n}\n.stats-summary[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n@media (max-width: 768px) {\n  .stats-summary[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%] {\n  background: white;\n  padding: 20px 24px;\n  border-radius: 14px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  transition: all 0.2s ease;\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.4rem;\n  flex-shrink: 0;\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .stat-icon.blue[_ngcontent-%COMP%] {\n  background: rgba(219, 234, 254, 0.8);\n  color: #1d4ed8;\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .stat-icon.orange[_ngcontent-%COMP%] {\n  background: rgba(254, 237, 195, 0.8);\n  color: #b45309;\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .stat-icon.green[_ngcontent-%COMP%] {\n  background: rgba(220, 252, 231, 0.8);\n  color: #166534;\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .stat-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .stat-content[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n  font-weight: 800;\n  color: #0f172a;\n  line-height: 1;\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .stat-content[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #64748b;\n  font-weight: 600;\n  margin-top: 4px;\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card.warning[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  color: #b45309;\n}\n.stats-summary[_ngcontent-%COMP%]   .summary-card.success[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  color: #166534;\n}\n.logs-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.log-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);\n  overflow: hidden;\n}\n.log-card[_ngcontent-%COMP%]:hover {\n  transform: translateX(4px);\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);\n  border-color: rgba(37, 99, 235, 0.3);\n}\n.log-card.pending[_ngcontent-%COMP%] {\n  border-left: 5px solid #f59e0b;\n}\n.log-card.validated[_ngcontent-%COMP%] {\n  border-left: 5px solid #22c55e;\n}\n.log-card.rejected[_ngcontent-%COMP%] {\n  border-left: 5px solid #ef4444;\n}\n.log-header[_ngcontent-%COMP%] {\n  padding: 18px 24px;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: rgba(248, 250, 252, 0.4);\n}\n.log-header[_ngcontent-%COMP%]   .teacher-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.log-header[_ngcontent-%COMP%]   .teacher-info[_ngcontent-%COMP%]   .teacher-avatar[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(37, 99, 235, 0.1),\n      rgba(148, 163, 184, 0.08));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-size: 0.9rem;\n  color: var(--primary-color);\n  border: 2px solid rgba(255, 255, 255, 0.9);\n  flex-shrink: 0;\n}\n.log-header[_ngcontent-%COMP%]   .teacher-info[_ngcontent-%COMP%]   .details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.log-header[_ngcontent-%COMP%]   .teacher-info[_ngcontent-%COMP%]   .details[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #0f172a;\n  font-size: 0.95rem;\n}\n.log-header[_ngcontent-%COMP%]   .teacher-info[_ngcontent-%COMP%]   .details[_ngcontent-%COMP%]   .subject[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #64748b;\n  font-weight: 500;\n}\n.status-badge[_ngcontent-%COMP%] {\n  padding: 6px 14px;\n  border-radius: 999px;\n  font-size: 0.78rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  border: 1px solid;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n}\n.status-badge[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  display: inline-block;\n}\n.status-badge.pending[_ngcontent-%COMP%] {\n  background: rgba(254, 243, 199, 0.85);\n  color: #b45309;\n  border-color: rgba(251, 191, 36, 0.5);\n}\n.status-badge.pending[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {\n  background: #f59e0b;\n  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);\n}\n.status-badge.validated[_ngcontent-%COMP%] {\n  background: rgba(220, 252, 231, 0.85);\n  color: #166534;\n  border-color: rgba(34, 197, 94, 0.5);\n}\n.status-badge.validated[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {\n  background: #22c55e;\n  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);\n}\n.status-badge.rejected[_ngcontent-%COMP%] {\n  background: rgba(254, 226, 226, 0.85);\n  color: #b91c1c;\n  border-color: rgba(239, 68, 68, 0.5);\n}\n.status-badge.rejected[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {\n  background: #ef4444;\n  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);\n}\n.log-body[_ngcontent-%COMP%] {\n  padding: 24px;\n  display: grid;\n  grid-template-columns: 1fr 280px;\n  gap: 24px;\n  align-items: start;\n}\n@media (max-width: 900px) {\n  .log-body[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 20px;\n  }\n}\n.log-body[_ngcontent-%COMP%]   .content-section[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 10px;\n}\n.log-body[_ngcontent-%COMP%]   .content-section[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-size: 1rem;\n}\n.log-body[_ngcontent-%COMP%]   .content-section[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 700;\n  font-size: 1.05rem;\n  color: #1e293b;\n}\n.log-body[_ngcontent-%COMP%]   .content-section[_ngcontent-%COMP%]   .content-text[_ngcontent-%COMP%] {\n  color: #475569;\n  line-height: 1.7;\n  margin-bottom: 16px;\n  font-size: 0.92rem;\n}\n.log-body[_ngcontent-%COMP%]   .content-section[_ngcontent-%COMP%]   .meta-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.log-body[_ngcontent-%COMP%]   .content-section[_ngcontent-%COMP%]   .meta-info[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n  font-size: 0.85rem;\n  color: #64748b;\n  font-weight: 500;\n}\n.log-body[_ngcontent-%COMP%]   .content-section[_ngcontent-%COMP%]   .meta-info[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.9rem;\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  min-width: 200px;\n}\n.actions[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 16px;\n  border-radius: 10px;\n  font-weight: 700;\n  font-size: 0.9rem;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  transition: all 0.2s;\n}\n.actions[_ngcontent-%COMP%]   .btn.btn-approve[_ngcontent-%COMP%] {\n  background: rgba(220, 252, 231, 0.9);\n  color: #166534;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.actions[_ngcontent-%COMP%]   .btn.btn-approve[_ngcontent-%COMP%]:hover {\n  background: #22c55e;\n  color: white;\n  transform: translateY(-2px);\n  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.35);\n}\n.actions[_ngcontent-%COMP%]   .btn.btn-reject[_ngcontent-%COMP%] {\n  background: rgba(254, 226, 226, 0.9);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.actions[_ngcontent-%COMP%]   .btn.btn-reject[_ngcontent-%COMP%]:hover {\n  background: #ef4444;\n  color: white;\n  transform: translateY(-2px);\n  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);\n}\n.validated-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  padding: 20px;\n  border-radius: 12px;\n  font-weight: 600;\n  font-size: 0.9rem;\n  background: rgba(241, 245, 249, 0.6);\n  border: 1px solid rgba(226, 232, 240, 0.7);\n}\n.validated-label[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n}\n.validated-label.valid\\e9[_ngcontent-%COMP%]  {\n  color: #166534;\n  background: rgba(220, 252, 231, 0.5);\n  border-color: rgba(34, 197, 94, 0.3);\n}\n.validated-label.valid\\e9[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #22c55e;\n}\n.validated-label.rejet\\e9[_ngcontent-%COMP%]  {\n  color: #b91c1c;\n  background: rgba(254, 226, 226, 0.5);\n  border-color: rgba(239, 68, 68, 0.3);\n}\n.validated-label.rejet\\e9[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #ef4444;\n}\n@media (max-width: 768px) {\n  .page-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 16px;\n  }\n  .page-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: flex-end;\n  }\n  .stats-summary[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%] {\n    min-width: 140px;\n    padding: 16px;\n  }\n}\n/*# sourceMappingURL=pedagogy.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PedagogyComponent, [{
    type: Component,
    args: [{ selector: "app-pedagogy", standalone: true, imports: [CommonModule], template: `
    <div class="pedagogy-container">
      <div class="page-header">
        <div class="header-left">
          <h1><i class="pi pi-book"></i> Validation P\xE9dagogique</h1>
          <p>V\xE9rifiez et approuvez les cahiers de textes des enseignants</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline"><i class="pi pi-filter"></i> Filtres</button>
          <button class="btn btn-outline"><i class="pi pi-download"></i> Exporter</button>
        </div>
      </div>

      <div class="stats-summary">
        <div class="summary-card total">
          <div class="stat-icon blue">
            <i class="pi pi-book"></i>
          </div>
          <div class="stat-content">
            <span class="value">42</span>
            <span class="label">Total S\xE9ances</span>
          </div>
        </div>
        <div class="summary-card warning">
          <div class="stat-icon orange">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <span class="value">12</span>
            <span class="label">\xC0 Valider</span>
          </div>
        </div>
        <div class="summary-card success">
          <div class="stat-icon green">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <span class="value">28</span>
            <span class="label">Approuv\xE9es</span>
          </div>
        </div>
      </div>

      <div class="logs-list">
        @for (log of lessonLogs; track log.id) {
          <div class="log-card" [ngClass]="getStatusClass(log.status)">
            <div class="log-header">
              <div class="teacher-info">
                <div class="teacher-avatar">{{ getInitials(log.teacherName) }}</div>
                <div class="details">
                  <span class="name">{{ log.teacherName }}</span>
                  <span class="subject">{{ log.subject }} \u2022 {{ log.date }}</span>
                </div>
              </div>
              <div class="status-badge" [ngClass]="getStatusClass(log.status)">
                <span class="status-dot"></span>
                {{ log.status }}
              </div>
            </div>

            <div class="log-body">
              <div class="content-section">
                <div class="chapter-header">
                  <i class="pi pi-folder"></i>
                  <span class="chapter-title">{{ log.chapter }}</span>
                </div>
                <p class="content-text">{{ log.content }}</p>
                <div class="meta-info">
                  <span class="meta-item">
                    <i class="pi pi-clock"></i>
                    <span>{{ log.startTime }} - {{ log.endTime }} (2h 00)</span>
                  </span>
                  <span class="meta-item">
                    <i class="pi pi-calendar"></i>
                    <span>{{ log.date }}</span>
                  </span>
                </div>
              </div>

              @if (log.status === 'En attente') {
                <div class="actions">
                  <button class="btn btn-approve" (click)="updateStatus(log.id, 'Valid\xE9')">
                    <i class="pi pi-check"></i> Approuver
                  </button>
                  <button class="btn btn-reject" (click)="updateStatus(log.id, 'Rejet\xE9')">
                    <i class="pi pi-times"></i> Rejeter
                  </button>
                </div>
              } @else {
                <div class="validated-label" [ngClass]="log.status.toLowerCase()">
                  <i class="pi" [ngClass]="getValidatedIcon(log.status)"></i>
                  <span>S\xE9ance {{ log.status.toLowerCase() }}e</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `, styles: ['@charset "UTF-8";\n\n/* angular:styles/component:scss;3386d1557c24906bea32a98316a419252574d0c274154f84a0e0b32f8fd9fdf4;/home/aya97/suivi-pedagogique-system/frontend-web/src/app/features/pedagogy/pedagogy.component.ts */\n.pedagogy-container {\n  display: flex;\n  flex-direction: column;\n  gap: 28px;\n}\n.page-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.page-header .header-left h1 {\n  margin: 0;\n  font-size: 1.75rem;\n  font-weight: 800;\n  color: #0f172a;\n  letter-spacing: -0.02em;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.page-header .header-left h1 i {\n  color: var(--primary-color);\n}\n.page-header .header-left p {\n  color: #64748b;\n  margin: 6px 0 0;\n  font-size: 0.95rem;\n  font-weight: 500;\n}\n.page-header .header-actions {\n  display: flex;\n  gap: 10px;\n}\n.btn {\n  padding: 11px 18px;\n  border-radius: 12px;\n  font-weight: 600;\n  font-size: 0.9rem;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  border: none;\n  transition: all 0.15s ease;\n}\n.btn i {\n  font-size: 1rem;\n}\n.btn.btn-outline {\n  background: white;\n  border: 1px solid var(--border-color);\n  color: #475569;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);\n}\n.btn.btn-outline:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n  transform: translateY(-1px);\n}\n.stats-summary {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n@media (max-width: 768px) {\n  .stats-summary {\n    grid-template-columns: 1fr;\n  }\n}\n.stats-summary .summary-card {\n  background: white;\n  padding: 20px 24px;\n  border-radius: 14px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  transition: all 0.2s ease;\n}\n.stats-summary .summary-card:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);\n}\n.stats-summary .summary-card .stat-icon {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.4rem;\n  flex-shrink: 0;\n}\n.stats-summary .summary-card .stat-icon.blue {\n  background: rgba(219, 234, 254, 0.8);\n  color: #1d4ed8;\n}\n.stats-summary .summary-card .stat-icon.orange {\n  background: rgba(254, 237, 195, 0.8);\n  color: #b45309;\n}\n.stats-summary .summary-card .stat-icon.green {\n  background: rgba(220, 252, 231, 0.8);\n  color: #166534;\n}\n.stats-summary .summary-card .stat-content {\n  display: flex;\n  flex-direction: column;\n}\n.stats-summary .summary-card .stat-content .value {\n  font-size: 1.6rem;\n  font-weight: 800;\n  color: #0f172a;\n  line-height: 1;\n}\n.stats-summary .summary-card .stat-content .label {\n  font-size: 0.8rem;\n  color: #64748b;\n  font-weight: 600;\n  margin-top: 4px;\n}\n.stats-summary .summary-card.warning .value {\n  color: #b45309;\n}\n.stats-summary .summary-card.success .value {\n  color: #166534;\n}\n.logs-list {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.log-card {\n  background: white;\n  border-radius: 16px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);\n  overflow: hidden;\n}\n.log-card:hover {\n  transform: translateX(4px);\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);\n  border-color: rgba(37, 99, 235, 0.3);\n}\n.log-card.pending {\n  border-left: 5px solid #f59e0b;\n}\n.log-card.validated {\n  border-left: 5px solid #22c55e;\n}\n.log-card.rejected {\n  border-left: 5px solid #ef4444;\n}\n.log-header {\n  padding: 18px 24px;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: rgba(248, 250, 252, 0.4);\n}\n.log-header .teacher-info {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.log-header .teacher-info .teacher-avatar {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(37, 99, 235, 0.1),\n      rgba(148, 163, 184, 0.08));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-size: 0.9rem;\n  color: var(--primary-color);\n  border: 2px solid rgba(255, 255, 255, 0.9);\n  flex-shrink: 0;\n}\n.log-header .teacher-info .details {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.log-header .teacher-info .details .name {\n  font-weight: 700;\n  color: #0f172a;\n  font-size: 0.95rem;\n}\n.log-header .teacher-info .details .subject {\n  font-size: 0.8rem;\n  color: #64748b;\n  font-weight: 500;\n}\n.status-badge {\n  padding: 6px 14px;\n  border-radius: 999px;\n  font-size: 0.78rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  border: 1px solid;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n}\n.status-badge .status-dot {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  display: inline-block;\n}\n.status-badge.pending {\n  background: rgba(254, 243, 199, 0.85);\n  color: #b45309;\n  border-color: rgba(251, 191, 36, 0.5);\n}\n.status-badge.pending .status-dot {\n  background: #f59e0b;\n  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);\n}\n.status-badge.validated {\n  background: rgba(220, 252, 231, 0.85);\n  color: #166534;\n  border-color: rgba(34, 197, 94, 0.5);\n}\n.status-badge.validated .status-dot {\n  background: #22c55e;\n  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);\n}\n.status-badge.rejected {\n  background: rgba(254, 226, 226, 0.85);\n  color: #b91c1c;\n  border-color: rgba(239, 68, 68, 0.5);\n}\n.status-badge.rejected .status-dot {\n  background: #ef4444;\n  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);\n}\n.log-body {\n  padding: 24px;\n  display: grid;\n  grid-template-columns: 1fr 280px;\n  gap: 24px;\n  align-items: start;\n}\n@media (max-width: 900px) {\n  .log-body {\n    grid-template-columns: 1fr;\n    gap: 20px;\n  }\n}\n.log-body .content-section .chapter-header {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 10px;\n}\n.log-body .content-section .chapter-header i {\n  color: var(--primary-color);\n  font-size: 1rem;\n}\n.log-body .content-section .chapter-header .chapter-title {\n  display: block;\n  font-weight: 700;\n  font-size: 1.05rem;\n  color: #1e293b;\n}\n.log-body .content-section .content-text {\n  color: #475569;\n  line-height: 1.7;\n  margin-bottom: 16px;\n  font-size: 0.92rem;\n}\n.log-body .content-section .meta-info {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.log-body .content-section .meta-info .meta-item {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n  font-size: 0.85rem;\n  color: #64748b;\n  font-weight: 500;\n}\n.log-body .content-section .meta-info .meta-item i {\n  color: #94a3b8;\n  font-size: 0.9rem;\n}\n.actions {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  min-width: 200px;\n}\n.actions .btn {\n  width: 100%;\n  padding: 12px 16px;\n  border-radius: 10px;\n  font-weight: 700;\n  font-size: 0.9rem;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  transition: all 0.2s;\n}\n.actions .btn.btn-approve {\n  background: rgba(220, 252, 231, 0.9);\n  color: #166534;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.actions .btn.btn-approve:hover {\n  background: #22c55e;\n  color: white;\n  transform: translateY(-2px);\n  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.35);\n}\n.actions .btn.btn-reject {\n  background: rgba(254, 226, 226, 0.9);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.actions .btn.btn-reject:hover {\n  background: #ef4444;\n  color: white;\n  transform: translateY(-2px);\n  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);\n}\n.validated-label {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  padding: 20px;\n  border-radius: 12px;\n  font-weight: 600;\n  font-size: 0.9rem;\n  background: rgba(241, 245, 249, 0.6);\n  border: 1px solid rgba(226, 232, 240, 0.7);\n}\n.validated-label i {\n  font-size: 1.3rem;\n}\n.validated-label.valid\\e9  {\n  color: #166534;\n  background: rgba(220, 252, 231, 0.5);\n  border-color: rgba(34, 197, 94, 0.3);\n}\n.validated-label.valid\\e9  i {\n  color: #22c55e;\n}\n.validated-label.rejet\\e9  {\n  color: #b91c1c;\n  background: rgba(254, 226, 226, 0.5);\n  border-color: rgba(239, 68, 68, 0.3);\n}\n.validated-label.rejet\\e9  i {\n  color: #ef4444;\n}\n@media (max-width: 768px) {\n  .page-header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 16px;\n  }\n  .page-header .header-actions {\n    width: 100%;\n    justify-content: flex-end;\n  }\n  .stats-summary .summary-card {\n    min-width: 140px;\n    padding: 16px;\n  }\n}\n/*# sourceMappingURL=pedagogy.component.css.map */\n'] }]
  }], () => [{ type: PedagogyService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PedagogyComponent, { className: "PedagogyComponent", filePath: "src/app/features/pedagogy/pedagogy.component.ts", lineNumber: 569 });
})();
export {
  PedagogyComponent
};
//# sourceMappingURL=chunk-USAT5G5H.js.map
