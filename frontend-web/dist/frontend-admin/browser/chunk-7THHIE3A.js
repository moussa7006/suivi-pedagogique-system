import {
  CommonModule,
  Component,
  NgClass,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CJ6OLCZO.js";

// src/app/features/attendance/attendance.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function AttendanceComponent_For_66_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40)(1, "span", 41);
    \u0275\u0275element(2, "span", 42);
    \u0275\u0275text(3, " \xC9marg\xE9 ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 43);
    \u0275\u0275element(5, "i", 13);
    \u0275\u0275text(6, " Cahier auto-valid\xE9");
    \u0275\u0275elementEnd()();
  }
}
function AttendanceComponent_For_66_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40)(1, "span", 44);
    \u0275\u0275element(2, "span", 42);
    \u0275\u0275text(3, " Bloqu\xE9 ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 45);
    \u0275\u0275element(5, "i", 46);
    \u0275\u0275text(6, " Cahier manquant");
    \u0275\u0275elementEnd()();
  }
}
function AttendanceComponent_For_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 28)(1, "td")(2, "div", 29)(3, "div", 30);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 31);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "td")(8, "div", 32)(9, "span", 33);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "small", 34);
    \u0275\u0275element(12, "i", 35);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "td")(15, "span", 36);
    \u0275\u0275element(16, "i", 37);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td")(19, "span", 38);
    \u0275\u0275element(20, "i", 39);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "td");
    \u0275\u0275conditionalCreate(23, AttendanceComponent_For_66_Conditional_23_Template, 7, 0, "div", 40)(24, AttendanceComponent_For_66_Conditional_24_Template, 7, 0, "div", 40);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const log_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", log_r1.status === "success" ? "row-success" : "row-blocked");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", log_r1.status === "success" ? "avatar-ok" : "avatar-blocked");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getInitials(log_r1.teacherName), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r1.teacherName);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(log_r1.subject);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", log_r1.location);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", log_r1.time);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", log_r1.method === "QR Code" ? "qr-method" : "manual-method");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", log_r1.method === "QR Code" ? "pi-qrcode" : "pi-pencil");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", log_r1.method, " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(log_r1.status === "success" ? 23 : 24);
  }
}
var AttendanceComponent = class _AttendanceComponent {
  scanLogs = [
    {
      id: 1,
      teacherName: "Dr. Alou Diarra",
      subject: "Algorithmique",
      time: "08:05",
      location: "Amphi 500",
      status: "success",
      method: "QR Code"
    },
    {
      id: 2,
      teacherName: "K. Barry",
      subject: "Math\xE9matiques",
      time: "08:12",
      location: "Salle 12",
      status: "success",
      method: "QR Code"
    },
    {
      id: 3,
      teacherName: "F. Coulibaly",
      subject: "Bases de donn\xE9es",
      time: "08:10",
      location: "Amphi A",
      status: "blocked",
      method: "QR Code"
    },
    {
      id: 4,
      teacherName: "M. Traor\xE9",
      subject: "Physique",
      time: "--:--",
      location: "Labo 1",
      status: "blocked",
      method: "Manuel"
    },
    {
      id: 5,
      teacherName: "S. Keita",
      subject: "Droit Civil",
      time: "10:30",
      location: "Salle 8",
      status: "success",
      method: "QR Code"
    }
  ];
  getInitials(name) {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  static \u0275fac = function AttendanceComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AttendanceComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AttendanceComponent, selectors: [["app-attendance"]], decls: 67, vars: 1, consts: [[1, "attendance-page"], [1, "page-header"], [1, "header-left"], [1, "header-icon"], [1, "pi", "pi-clipboard-check"], [1, "header-actions"], [1, "btn", "btn-outline"], [1, "pi", "pi-download"], [1, "btn-text"], [1, "pi", "pi-filter"], [1, "stats-row"], [1, "stat-card", 2, "--accent", "#22c55e"], [1, "stat-icon", "green"], [1, "pi", "pi-check-circle"], [1, "stat-info"], [1, "stat-value"], [1, "stat-label"], [1, "stat-card", 2, "--accent", "#3b82f6"], [1, "stat-icon", "blue"], [1, "pi", "pi-book"], [1, "stat-card", 2, "--accent", "#ef4444"], [1, "stat-icon", "red"], [1, "pi", "pi-ban"], [1, "table-card"], [1, "table-top"], [1, "record-count"], [1, "table-scroll"], [1, "attendance-table"], [3, "ngClass"], [1, "teacher-cell"], [1, "teacher-avatar", 3, "ngClass"], [1, "teacher-name"], [1, "sub-info"], [1, "subject"], [1, "location"], [1, "pi", "pi-map-marker"], [1, "time-cell"], [1, "pi", "pi-clock"], [1, "method-tag", 3, "ngClass"], [1, "pi", 3, "ngClass"], [1, "status-cell"], [1, "status-pill", "present"], [1, "status-dot"], [1, "auto-badge"], [1, "status-pill", "blocked"], [1, "block-reason"], [1, "pi", "pi-exclamation-circle"]], template: function AttendanceComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div")(6, "h1");
      \u0275\u0275text(7, "Historique des \xC9margements");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p");
      \u0275\u0275text(9, "Liste des enseignants ayant scann\xE9 le QR Code pour \xE9marger");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "div", 5)(11, "button", 6);
      \u0275\u0275element(12, "i", 7);
      \u0275\u0275elementStart(13, "span", 8);
      \u0275\u0275text(14, "Exporter");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "button", 6);
      \u0275\u0275element(16, "i", 9);
      \u0275\u0275elementStart(17, "span", 8);
      \u0275\u0275text(18, "Filtres");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(19, "div", 10)(20, "div", 11)(21, "div", 12);
      \u0275\u0275element(22, "i", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 14)(24, "span", 15);
      \u0275\u0275text(25, "92%");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "span", 16);
      \u0275\u0275text(27, "Taux de pr\xE9sence");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(28, "div", 17)(29, "div", 18);
      \u0275\u0275element(30, "i", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "div", 14)(32, "span", 15);
      \u0275\u0275text(33, "28");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "span", 16);
      \u0275\u0275text(35, "Cahiers valid\xE9s");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(36, "div", 20)(37, "div", 21);
      \u0275\u0275element(38, "i", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "div", 14)(40, "span", 15);
      \u0275\u0275text(41, "3");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "span", 16);
      \u0275\u0275text(43, "Scans bloqu\xE9s");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(44, "div", 23)(45, "div", 24)(46, "h3");
      \u0275\u0275text(47, "Scans d'\xE9margement du jour");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "span", 25);
      \u0275\u0275text(49);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(50, "div", 26)(51, "table", 27)(52, "thead")(53, "tr")(54, "th");
      \u0275\u0275text(55, "Enseignant");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "th");
      \u0275\u0275text(57, "Mati\xE8re / Lieu");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "th");
      \u0275\u0275text(59, "Heure");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "th");
      \u0275\u0275text(61, "M\xE9thode");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "th");
      \u0275\u0275text(63, "Statut");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(64, "tbody");
      \u0275\u0275repeaterCreate(65, AttendanceComponent_For_66_Template, 25, 11, "tr", 28, _forTrack0);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(49);
      \u0275\u0275textInterpolate1("", ctx.scanLogs.length, " enregistrements");
      \u0275\u0275advance(16);
      \u0275\u0275repeater(ctx.scanLogs);
    }
  }, dependencies: [CommonModule, NgClass], styles: ['\n\n.attendance-page[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  flex: 1;\n  min-width: 0;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(22, 163, 74, 0.1),\n      rgba(34, 197, 94, 0.05));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n  color: #16a34a;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(1.1rem, 3vw, 1.6rem);\n  font-weight: 800;\n  color: #0f172a;\n  letter-spacing: -0.02em;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 4px 0 0;\n  color: #64748b;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.page-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  flex-shrink: 0;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 10px 18px;\n  border-radius: 10px;\n  font-weight: 600;\n  font-size: 0.88rem;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  border: none;\n  transition: all 0.2s ease;\n}\n.btn[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n}\n.btn.btn-outline[_ngcontent-%COMP%] {\n  background: white;\n  border: 1.5px solid rgba(226, 232, 240, 0.9);\n  color: #475569;\n}\n.btn.btn-outline[_ngcontent-%COMP%]:hover {\n  border-color: var(--primary-color);\n  color: var(--primary-color);\n  background: rgba(37, 99, 235, 0.04);\n}\n@media (max-width: 640px) {\n  .btn[_ngcontent-%COMP%]   .btn-text[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .btn[_ngcontent-%COMP%] {\n    padding: 10px 12px;\n  }\n}\n.stats-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 14px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  transition: all 0.25s ease;\n  position: relative;\n  overflow: hidden;\n}\n.stat-card[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: var(--accent);\n  border-radius: 4px 0 0 4px;\n  transform: scaleY(0);\n  transition: transform 0.3s ease;\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.07);\n  border-color: color-mix(in srgb, var(--accent) 30%, white);\n}\n.stat-card[_ngcontent-%COMP%]:hover::before {\n  transform: scaleY(1);\n}\n.stat-card[_ngcontent-%COMP%]:hover   .stat-icon[_ngcontent-%COMP%] {\n  transform: scale(1.08);\n}\n.stat-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  width: 46px;\n  height: 46px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.2rem;\n  flex-shrink: 0;\n  transition: transform 0.2s ease;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-icon.green[_ngcontent-%COMP%] {\n  background: rgba(220, 252, 231, 0.7);\n  color: #166534;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-icon.blue[_ngcontent-%COMP%] {\n  background: rgba(219, 234, 254, 0.7);\n  color: #1d4ed8;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-icon.red[_ngcontent-%COMP%] {\n  background: rgba(254, 226, 226, 0.7);\n  color: #991b1b;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 800;\n  color: #0f172a;\n  line-height: 1;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #64748b;\n  font-weight: 600;\n  margin-top: 4px;\n}\n.table-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  box-shadow: 0 4px 16px rgba(2, 6, 23, 0.04);\n  overflow: hidden;\n}\n.table-top[_ngcontent-%COMP%] {\n  padding: 20px 24px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n  background: rgba(248, 250, 252, 0.5);\n}\n.table-top[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: #1e293b;\n}\n.table-top[_ngcontent-%COMP%]   .record-count[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #94a3b8;\n  font-weight: 600;\n  background: rgba(241, 245, 249, 0.8);\n  padding: 4px 12px;\n  border-radius: 999px;\n}\n.table-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.attendance-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 700px;\n}\n.attendance-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 14px 20px;\n  background: rgba(248, 250, 252, 0.8);\n  text-align: left;\n  color: #475569;\n  font-size: 0.78rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  border-bottom: 2px solid rgba(226, 232, 240, 0.8);\n}\n.attendance-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  transition: all 0.15s ease;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n}\n.attendance-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.attendance-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: rgba(37, 99, 235, 0.025);\n}\n.attendance-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr.row-success[_ngcontent-%COMP%] {\n  border-left: 3px solid #22c55e;\n}\n.attendance-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr.row-blocked[_ngcontent-%COMP%] {\n  border-left: 3px solid #ef4444;\n}\n.attendance-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  vertical-align: middle;\n  color: #334155;\n  font-size: 0.88rem;\n}\n.teacher-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.teacher-cell[_ngcontent-%COMP%]   .teacher-avatar[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-size: 0.85rem;\n  flex-shrink: 0;\n  border: 2px solid rgba(255, 255, 255, 0.9);\n}\n.teacher-cell[_ngcontent-%COMP%]   .teacher-avatar.avatar-ok[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(34, 197, 94, 0.15),\n      rgba(34, 197, 94, 0.05));\n  color: #166534;\n}\n.teacher-cell[_ngcontent-%COMP%]   .teacher-avatar.avatar-blocked[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(239, 68, 68, 0.15),\n      rgba(239, 68, 68, 0.05));\n  color: #991b1b;\n}\n.teacher-cell[_ngcontent-%COMP%]   .teacher-name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #0f172a;\n  font-size: 0.92rem;\n}\n.sub-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.sub-info[_ngcontent-%COMP%]   .subject[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-weight: 600;\n  font-size: 0.88rem;\n}\n.sub-info[_ngcontent-%COMP%]   .location[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.78rem;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n.sub-info[_ngcontent-%COMP%]   .location[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n}\n.time-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-weight: 600;\n  color: #334155;\n  font-size: 0.88rem;\n}\n.time-cell[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.85rem;\n}\n.method-tag[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  padding: 5px 11px;\n  border-radius: 8px;\n  border: 1px solid;\n}\n.method-tag[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n.method-tag.qr-method[_ngcontent-%COMP%] {\n  background: rgba(219, 234, 254, 0.7);\n  color: #2563eb;\n  border-color: rgba(37, 99, 235, 0.2);\n}\n.method-tag.manual-method[_ngcontent-%COMP%] {\n  background: rgba(241, 245, 249, 0.9);\n  color: #64748b;\n  border-color: rgba(226, 232, 240, 0.7);\n}\n.status-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.status-pill[_ngcontent-%COMP%] {\n  padding: 5px 14px;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  border: 1px solid;\n  width: fit-content;\n}\n.status-pill[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  display: inline-block;\n}\n.status-pill.present[_ngcontent-%COMP%] {\n  background: rgba(220, 252, 231, 0.85);\n  color: #166534;\n  border-color: rgba(187, 240, 208, 0.6);\n}\n.status-pill.present[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {\n  background: #22c55e;\n  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);\n}\n.status-pill.blocked[_ngcontent-%COMP%] {\n  background: rgba(254, 226, 226, 0.85);\n  color: #991b1b;\n  border-color: rgba(254, 202, 202, 0.6);\n}\n.status-pill.blocked[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {\n  background: #ef4444;\n  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);\n}\n.auto-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 0.72rem;\n  font-weight: 600;\n  color: #166534;\n  background: rgba(220, 252, 231, 0.5);\n  padding: 3px 8px;\n  border-radius: 6px;\n  width: fit-content;\n}\n.auto-badge[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n}\n.block-reason[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 0.72rem;\n  font-weight: 600;\n  color: #991b1b;\n  background: rgba(254, 226, 226, 0.5);\n  padding: 3px 8px;\n  border-radius: 6px;\n  width: fit-content;\n}\n.block-reason[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n}\n@media (max-width: 768px) {\n  .page-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .stats-row[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  }\n  .table-card[_ngcontent-%COMP%] {\n    overflow-x: auto;\n  }\n  .table-card[_ngcontent-%COMP%]   .attendance-table[_ngcontent-%COMP%] {\n    min-width: 600px;\n  }\n  .status-cell[_ngcontent-%COMP%] {\n    gap: 4px;\n  }\n  .auto-badge[_ngcontent-%COMP%], \n   .block-reason[_ngcontent-%COMP%] {\n    font-size: 0.68rem;\n    padding: 2px 6px;\n  }\n}\n@media (max-width: 480px) {\n  .page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%] {\n    width: 40px;\n    height: 40px;\n  }\n  .page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    font-size: 1.1rem;\n  }\n  .stats-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .auto-badge[_ngcontent-%COMP%], \n   .block-reason[_ngcontent-%COMP%] {\n    font-size: 0.65rem;\n  }\n}\n/*# sourceMappingURL=attendance.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttendanceComponent, [{
    type: Component,
    args: [{ selector: "app-attendance", standalone: true, imports: [CommonModule], template: `
    <div class="attendance-page">
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <i class="pi pi-clipboard-check"></i>
          </div>
          <div>
            <h1>Historique des \xC9margements</h1>
            <p>Liste des enseignants ayant scann\xE9 le QR Code pour \xE9marger</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline">
            <i class="pi pi-download"></i> <span class="btn-text">Exporter</span>
          </button>
          <button class="btn btn-outline">
            <i class="pi pi-filter"></i> <span class="btn-text">Filtres</span>
          </button>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card" style="--accent: #22c55e">
          <div class="stat-icon green"><i class="pi pi-check-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">92%</span>
            <span class="stat-label">Taux de pr\xE9sence</span>
          </div>
        </div>
        <div class="stat-card" style="--accent: #3b82f6">
          <div class="stat-icon blue"><i class="pi pi-book"></i></div>
          <div class="stat-info">
            <span class="stat-value">28</span>
            <span class="stat-label">Cahiers valid\xE9s</span>
          </div>
        </div>
        <div class="stat-card" style="--accent: #ef4444">
          <div class="stat-icon red"><i class="pi pi-ban"></i></div>
          <div class="stat-info">
            <span class="stat-value">3</span>
            <span class="stat-label">Scans bloqu\xE9s</span>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-top">
          <h3>Scans d'\xE9margement du jour</h3>
          <span class="record-count">{{ scanLogs.length }} enregistrements</span>
        </div>

        <div class="table-scroll">
          <table class="attendance-table">
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Mati\xE8re / Lieu</th>
                <th>Heure</th>
                <th>M\xE9thode</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              @for (log of scanLogs; track log.id) {
                <tr [ngClass]="log.status === 'success' ? 'row-success' : 'row-blocked'">
                  <td>
                    <div class="teacher-cell">
                      <div
                        class="teacher-avatar"
                        [ngClass]="log.status === 'success' ? 'avatar-ok' : 'avatar-blocked'"
                      >
                        {{ getInitials(log.teacherName) }}
                      </div>
                      <span class="teacher-name">{{ log.teacherName }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="sub-info">
                      <span class="subject">{{ log.subject }}</span>
                      <small class="location"
                        ><i class="pi pi-map-marker"></i> {{ log.location }}</small
                      >
                    </div>
                  </td>
                  <td>
                    <span class="time-cell"><i class="pi pi-clock"></i> {{ log.time }}</span>
                  </td>
                  <td>
                    <span
                      class="method-tag"
                      [ngClass]="log.method === 'QR Code' ? 'qr-method' : 'manual-method'"
                    >
                      <i
                        class="pi"
                        [ngClass]="log.method === 'QR Code' ? 'pi-qrcode' : 'pi-pencil'"
                      ></i>
                      {{ log.method }}
                    </span>
                  </td>
                  <td>
                    @if (log.status === 'success') {
                      <div class="status-cell">
                        <span class="status-pill present">
                          <span class="status-dot"></span>
                          \xC9marg\xE9
                        </span>
                        <span class="auto-badge"
                          ><i class="pi pi-check-circle"></i> Cahier auto-valid\xE9</span
                        >
                      </div>
                    } @else {
                      <div class="status-cell">
                        <span class="status-pill blocked">
                          <span class="status-dot"></span>
                          Bloqu\xE9
                        </span>
                        <span class="block-reason"
                          ><i class="pi pi-exclamation-circle"></i> Cahier manquant</span
                        >
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `, styles: ['/* angular:styles/component:scss;b0fa28930c23c06a39d225058e080f9ec7b34571b9424481738f9a8a1b0d7b88;/home/aya97/suivi-pedagogique-system/frontend-web/src/app/features/attendance/attendance.component.ts */\n.attendance-page {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.page-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.page-header .header-left {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  flex: 1;\n  min-width: 0;\n}\n.page-header .header-left .header-icon {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(22, 163, 74, 0.1),\n      rgba(34, 197, 94, 0.05));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.page-header .header-left .header-icon i {\n  font-size: 1.3rem;\n  color: #16a34a;\n}\n.page-header .header-left h1 {\n  margin: 0;\n  font-size: clamp(1.1rem, 3vw, 1.6rem);\n  font-weight: 800;\n  color: #0f172a;\n  letter-spacing: -0.02em;\n}\n.page-header .header-left p {\n  margin: 4px 0 0;\n  color: #64748b;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.page-header .header-actions {\n  display: flex;\n  gap: 10px;\n  flex-shrink: 0;\n}\n.btn {\n  padding: 10px 18px;\n  border-radius: 10px;\n  font-weight: 600;\n  font-size: 0.88rem;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  border: none;\n  transition: all 0.2s ease;\n}\n.btn i {\n  font-size: 0.95rem;\n}\n.btn.btn-outline {\n  background: white;\n  border: 1.5px solid rgba(226, 232, 240, 0.9);\n  color: #475569;\n}\n.btn.btn-outline:hover {\n  border-color: var(--primary-color);\n  color: var(--primary-color);\n  background: rgba(37, 99, 235, 0.04);\n}\n@media (max-width: 640px) {\n  .btn .btn-text {\n    display: none;\n  }\n  .btn {\n    padding: 10px 12px;\n  }\n}\n.stats-row {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}\n.stat-card {\n  background: white;\n  border-radius: 14px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  transition: all 0.25s ease;\n  position: relative;\n  overflow: hidden;\n}\n.stat-card::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: var(--accent);\n  border-radius: 4px 0 0 4px;\n  transform: scaleY(0);\n  transition: transform 0.3s ease;\n}\n.stat-card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.07);\n  border-color: color-mix(in srgb, var(--accent) 30%, white);\n}\n.stat-card:hover::before {\n  transform: scaleY(1);\n}\n.stat-card:hover .stat-icon {\n  transform: scale(1.08);\n}\n.stat-card .stat-icon {\n  width: 46px;\n  height: 46px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.2rem;\n  flex-shrink: 0;\n  transition: transform 0.2s ease;\n}\n.stat-card .stat-icon.green {\n  background: rgba(220, 252, 231, 0.7);\n  color: #166534;\n}\n.stat-card .stat-icon.blue {\n  background: rgba(219, 234, 254, 0.7);\n  color: #1d4ed8;\n}\n.stat-card .stat-icon.red {\n  background: rgba(254, 226, 226, 0.7);\n  color: #991b1b;\n}\n.stat-card .stat-info {\n  display: flex;\n  flex-direction: column;\n}\n.stat-card .stat-info .stat-value {\n  font-size: 1.5rem;\n  font-weight: 800;\n  color: #0f172a;\n  line-height: 1;\n}\n.stat-card .stat-info .stat-label {\n  font-size: 0.8rem;\n  color: #64748b;\n  font-weight: 600;\n  margin-top: 4px;\n}\n.table-card {\n  background: white;\n  border-radius: 16px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  box-shadow: 0 4px 16px rgba(2, 6, 23, 0.04);\n  overflow: hidden;\n}\n.table-top {\n  padding: 20px 24px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n  background: rgba(248, 250, 252, 0.5);\n}\n.table-top h3 {\n  margin: 0;\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: #1e293b;\n}\n.table-top .record-count {\n  font-size: 0.8rem;\n  color: #94a3b8;\n  font-weight: 600;\n  background: rgba(241, 245, 249, 0.8);\n  padding: 4px 12px;\n  border-radius: 999px;\n}\n.table-scroll {\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.attendance-table {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 700px;\n}\n.attendance-table thead th {\n  padding: 14px 20px;\n  background: rgba(248, 250, 252, 0.8);\n  text-align: left;\n  color: #475569;\n  font-size: 0.78rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  border-bottom: 2px solid rgba(226, 232, 240, 0.8);\n}\n.attendance-table tbody tr {\n  transition: all 0.15s ease;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n}\n.attendance-table tbody tr:last-child {\n  border-bottom: none;\n}\n.attendance-table tbody tr:hover {\n  background: rgba(37, 99, 235, 0.025);\n}\n.attendance-table tbody tr.row-success {\n  border-left: 3px solid #22c55e;\n}\n.attendance-table tbody tr.row-blocked {\n  border-left: 3px solid #ef4444;\n}\n.attendance-table tbody td {\n  padding: 16px 20px;\n  vertical-align: middle;\n  color: #334155;\n  font-size: 0.88rem;\n}\n.teacher-cell {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.teacher-cell .teacher-avatar {\n  width: 40px;\n  height: 40px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-size: 0.85rem;\n  flex-shrink: 0;\n  border: 2px solid rgba(255, 255, 255, 0.9);\n}\n.teacher-cell .teacher-avatar.avatar-ok {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(34, 197, 94, 0.15),\n      rgba(34, 197, 94, 0.05));\n  color: #166534;\n}\n.teacher-cell .teacher-avatar.avatar-blocked {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(239, 68, 68, 0.15),\n      rgba(239, 68, 68, 0.05));\n  color: #991b1b;\n}\n.teacher-cell .teacher-name {\n  font-weight: 700;\n  color: #0f172a;\n  font-size: 0.92rem;\n}\n.sub-info {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.sub-info .subject {\n  color: #0f172a;\n  font-weight: 600;\n  font-size: 0.88rem;\n}\n.sub-info .location {\n  color: #94a3b8;\n  font-size: 0.78rem;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n.sub-info .location i {\n  font-size: 0.72rem;\n}\n.time-cell {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-weight: 600;\n  color: #334155;\n  font-size: 0.88rem;\n}\n.time-cell i {\n  color: #94a3b8;\n  font-size: 0.85rem;\n}\n.method-tag {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  padding: 5px 11px;\n  border-radius: 8px;\n  border: 1px solid;\n}\n.method-tag i {\n  font-size: 0.85rem;\n}\n.method-tag.qr-method {\n  background: rgba(219, 234, 254, 0.7);\n  color: #2563eb;\n  border-color: rgba(37, 99, 235, 0.2);\n}\n.method-tag.manual-method {\n  background: rgba(241, 245, 249, 0.9);\n  color: #64748b;\n  border-color: rgba(226, 232, 240, 0.7);\n}\n.status-cell {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.status-pill {\n  padding: 5px 14px;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  border: 1px solid;\n  width: fit-content;\n}\n.status-pill .status-dot {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  display: inline-block;\n}\n.status-pill.present {\n  background: rgba(220, 252, 231, 0.85);\n  color: #166534;\n  border-color: rgba(187, 240, 208, 0.6);\n}\n.status-pill.present .status-dot {\n  background: #22c55e;\n  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);\n}\n.status-pill.blocked {\n  background: rgba(254, 226, 226, 0.85);\n  color: #991b1b;\n  border-color: rgba(254, 202, 202, 0.6);\n}\n.status-pill.blocked .status-dot {\n  background: #ef4444;\n  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);\n}\n.auto-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 0.72rem;\n  font-weight: 600;\n  color: #166534;\n  background: rgba(220, 252, 231, 0.5);\n  padding: 3px 8px;\n  border-radius: 6px;\n  width: fit-content;\n}\n.auto-badge i {\n  font-size: 0.75rem;\n}\n.block-reason {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 0.72rem;\n  font-weight: 600;\n  color: #991b1b;\n  background: rgba(254, 226, 226, 0.5);\n  padding: 3px 8px;\n  border-radius: 6px;\n  width: fit-content;\n}\n.block-reason i {\n  font-size: 0.75rem;\n}\n@media (max-width: 768px) {\n  .page-header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .stats-row {\n    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  }\n  .table-card {\n    overflow-x: auto;\n  }\n  .table-card .attendance-table {\n    min-width: 600px;\n  }\n  .status-cell {\n    gap: 4px;\n  }\n  .auto-badge,\n  .block-reason {\n    font-size: 0.68rem;\n    padding: 2px 6px;\n  }\n}\n@media (max-width: 480px) {\n  .page-header .header-left h1 {\n    font-size: 1.2rem;\n  }\n  .page-header .header-left .header-icon {\n    width: 40px;\n    height: 40px;\n  }\n  .page-header .header-left .header-icon i {\n    font-size: 1.1rem;\n  }\n  .stats-row {\n    grid-template-columns: 1fr;\n  }\n  .auto-badge,\n  .block-reason {\n    font-size: 0.65rem;\n  }\n}\n/*# sourceMappingURL=attendance.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AttendanceComponent, { className: "AttendanceComponent", filePath: "src/app/features/attendance/attendance.component.ts", lineNumber: 664 });
})();
export {
  AttendanceComponent
};
//# sourceMappingURL=chunk-7THHIE3A.js.map
