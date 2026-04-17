import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-K27GQWIT.js";
import {
  CommonModule,
  Component,
  Injectable,
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
  ɵɵlistener,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CJ6OLCZO.js";

// src/app/core/services/teacher.service.ts
var TeacherService = class _TeacherService {
  teachers = [
    {
      id: 1,
      firstName: "Alou",
      lastName: "Diarra",
      matricule: "M001",
      email: "alou.diarra@univ-mali.ml",
      telephone: "+223 70 12 34 56",
      adresse: "Bamako, Quartier Badalabougou",
      department: "Informatique",
      subjects: ["Algorithmique", "Java"],
      status: "Actif",
      avatar: "https://i.pravatar.cc/150?u=alou"
    },
    {
      id: 2,
      firstName: "Kadidia",
      lastName: "Barry",
      matricule: "M002",
      email: "k.barry@univ-mali.ml",
      telephone: "+223 71 23 45 67",
      adresse: "Bamako, Quartier Korofina",
      department: "Math\xE9matiques",
      subjects: ["Analyse 1", "Probabilit\xE9s"],
      status: "Actif",
      avatar: "https://i.pravatar.cc/150?u=kadidia"
    },
    {
      id: 3,
      firstName: "Moussa",
      lastName: "Traor\xE9",
      matricule: "M003",
      email: "m.traore@univ-mali.ml",
      telephone: "+223 72 34 56 78",
      adresse: "Bamako, Quartier Hamdallaye",
      department: "Physique",
      subjects: ["Thermodynamique"],
      status: "En cong\xE9",
      avatar: "https://i.pravatar.cc/150?u=moussa"
    },
    {
      id: 4,
      firstName: "Fatim",
      lastName: "Coulibaly",
      matricule: "M004",
      email: "f.coulibaly@univ-mali.ml",
      telephone: "+223 73 45 67 89",
      adresse: "Bamako, Quartier Lafiabougou",
      department: "Informatique",
      subjects: ["Bases de donn\xE9es", "SQL"],
      status: "Actif",
      avatar: "https://i.pravatar.cc/150?u=fatim"
    },
    {
      id: 5,
      firstName: "Sekou",
      lastName: "Keita",
      matricule: "M005",
      email: "s.keita@univ-mali.ml",
      telephone: "+223 74 56 78 90",
      adresse: "Bamako, Quartier S\xE9benikoro",
      department: "Droit",
      subjects: ["Droit Civil"],
      status: "Inactif",
      avatar: "https://i.pravatar.cc/150?u=sekou"
    }
  ];
  getTeachers() {
    return of(this.teachers);
  }
  getTeacherById(id) {
    return of(this.teachers.find((t) => t.id === id));
  }
  static \u0275fac = function TeacherService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeacherService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TeacherService, factory: _TeacherService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TeacherService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/teachers/teachers.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function TeachersComponent_For_83_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const subject_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(subject_r1);
  }
}
function TeachersComponent_For_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 37);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "span", 37);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td")(8, "div", 38);
    \u0275\u0275repeaterCreate(9, TeachersComponent_For_83_For_10_Template, 2, 1, "span", 39, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td")(12, "span", 40);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td")(15, "span", 41);
    \u0275\u0275element(16, "i", 42);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td")(19, "span", 41);
    \u0275\u0275element(20, "i", 43);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "td")(23, "span", 41);
    \u0275\u0275element(24, "i", 44);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "td", 35)(27, "div", 45)(28, "button", 46);
    \u0275\u0275element(29, "i", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 48);
    \u0275\u0275element(31, "i", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "button", 50);
    \u0275\u0275element(33, "i", 51);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const teacher_r2 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(teacher_r2.lastName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(teacher_r2.firstName);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(teacher_r2.subjects);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(teacher_r2.matricule);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", teacher_r2.email);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", teacher_r2.telephone);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", teacher_r2.adresse);
  }
}
function TeachersComponent_Conditional_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 52);
    \u0275\u0275element(2, "i", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "Aucun enseignant trouv\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Essayez de modifier vos crit\xE8res de recherche");
    \u0275\u0275elementEnd()();
  }
}
var TeachersComponent = class _TeachersComponent {
  teacherService;
  teachers = [];
  filteredTeachers = [];
  searchText = "";
  activeCount = 0;
  onLeaveCount = 0;
  inactiveCount = 0;
  constructor(teacherService) {
    this.teacherService = teacherService;
  }
  ngOnInit() {
    this.teacherService.getTeachers().subscribe((data) => {
      this.teachers = data;
      this.filteredTeachers = data;
      this.activeCount = this.teachers.filter((t) => t.status === "Actif").length;
      this.onLeaveCount = this.teachers.filter((t) => t.status === "En cong\xE9").length;
      this.inactiveCount = this.teachers.filter((t) => t.status === "Inactif").length;
    });
  }
  filterTeachers() {
    const text = this.searchText.toLowerCase();
    this.filteredTeachers = this.teachers.filter((t) => t.firstName.toLowerCase().includes(text) || t.lastName.toLowerCase().includes(text) || t.matricule.toLowerCase().includes(text) || t.email.toLowerCase().includes(text) || t.telephone.toLowerCase().includes(text) || t.adresse.toLowerCase().includes(text));
  }
  getStatusClass(status) {
    switch (status) {
      case "Actif":
        return "status-active";
      case "En cong\xE9":
        return "status-away";
      case "Inactif":
        return "status-inactive";
      default:
        return "";
    }
  }
  getInitials(firstName, lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  getColor(id) {
    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4"];
    return colors[id % colors.length];
  }
  static \u0275fac = function TeachersComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeachersComponent)(\u0275\u0275directiveInject(TeacherService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeachersComponent, selectors: [["app-teachers"]], decls: 85, vars: 7, consts: [[1, "teachers-page"], [1, "page-header"], [1, "header-left"], [1, "header-icon"], [1, "pi", "pi-users"], [1, "header-actions"], [1, "btn", "btn-outline"], [1, "pi", "pi-filter"], [1, "btn-text"], [1, "btn", "btn-primary"], [1, "pi", "pi-plus"], [1, "stats-grid"], [1, "stat-card", 2, "--accent", "#3b82f6"], [1, "stat-icon", "blue"], [1, "stat-info"], [1, "stat-value"], [1, "stat-label"], [1, "stat-card", 2, "--accent", "#22c55e"], [1, "stat-icon", "green"], [1, "pi", "pi-check-circle"], [1, "stat-card", 2, "--accent", "#f59e0b"], [1, "stat-icon", "amber"], [1, "pi", "pi-clock"], [1, "stat-card", 2, "--accent", "#ef4444"], [1, "stat-icon", "red"], [1, "pi", "pi-ban"], [1, "table-card"], [1, "table-top"], [1, "search-wrap"], [1, "pi", "pi-search"], ["type", "text", "placeholder", "Rechercher par nom, pr\xE9nom, matricule, email...", 3, "ngModelChange", "input", "ngModel"], [1, "btn", "btn-outline", "btn-sm"], [1, "pi", "pi-download"], [1, "table-scroll"], [1, "pro-table"], [1, "text-right"], [1, "empty-state"], [1, "name-cell"], [1, "chips"], [1, "chip"], [1, "matricule"], [1, "contact"], [1, "pi", "pi-envelope"], [1, "pi", "pi-phone"], [1, "pi", "pi-map-marker"], [1, "actions"], ["title", "Modifier", 1, "action-btn"], [1, "pi", "pi-pencil"], ["title", "Statistiques", 1, "action-btn"], [1, "pi", "pi-chart-line"], ["title", "Supprimer", 1, "action-btn", "danger"], [1, "pi", "pi-trash"], [1, "empty-icon"]], template: function TeachersComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div")(6, "h1");
      \u0275\u0275text(7, "Gestion des Enseignants");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p");
      \u0275\u0275text(9);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "div", 5)(11, "button", 6);
      \u0275\u0275element(12, "i", 7);
      \u0275\u0275elementStart(13, "span", 8);
      \u0275\u0275text(14, "Filtres");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "button", 9);
      \u0275\u0275element(16, "i", 10);
      \u0275\u0275elementStart(17, "span", 8);
      \u0275\u0275text(18, "Nouvel Enseignant");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(19, "div", 11)(20, "div", 12)(21, "div", 13);
      \u0275\u0275element(22, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 14)(24, "span", 15);
      \u0275\u0275text(25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "span", 16);
      \u0275\u0275text(27, "Total");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(28, "div", 17)(29, "div", 18);
      \u0275\u0275element(30, "i", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "div", 14)(32, "span", 15);
      \u0275\u0275text(33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "span", 16);
      \u0275\u0275text(35, "Actifs");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(36, "div", 20)(37, "div", 21);
      \u0275\u0275element(38, "i", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "div", 14)(40, "span", 15);
      \u0275\u0275text(41);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "span", 16);
      \u0275\u0275text(43, "En cong\xE9");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(44, "div", 23)(45, "div", 24);
      \u0275\u0275element(46, "i", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "div", 14)(48, "span", 15);
      \u0275\u0275text(49);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "span", 16);
      \u0275\u0275text(51, "Inactifs");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(52, "div", 26)(53, "div", 27)(54, "div", 28);
      \u0275\u0275element(55, "i", 29);
      \u0275\u0275elementStart(56, "input", 30);
      \u0275\u0275twoWayListener("ngModelChange", function TeachersComponent_Template_input_ngModelChange_56_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchText, $event) || (ctx.searchText = $event);
        return $event;
      });
      \u0275\u0275listener("input", function TeachersComponent_Template_input_input_56_listener() {
        return ctx.filterTeachers();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(57, "button", 31);
      \u0275\u0275element(58, "i", 32);
      \u0275\u0275elementStart(59, "span", 8);
      \u0275\u0275text(60, "Exporter");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(61, "div", 33)(62, "table", 34)(63, "thead")(64, "tr")(65, "th");
      \u0275\u0275text(66, "Nom");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "th");
      \u0275\u0275text(68, "Pr\xE9nom");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "th");
      \u0275\u0275text(70, "Mati\xE8re");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "th");
      \u0275\u0275text(72, "Matricule");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "th");
      \u0275\u0275text(74, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(75, "th");
      \u0275\u0275text(76, "T\xE9l\xE9phone");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(77, "th");
      \u0275\u0275text(78, "Adresse");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "th", 35);
      \u0275\u0275text(80, "Actions");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(81, "tbody");
      \u0275\u0275repeaterCreate(82, TeachersComponent_For_83_Template, 34, 6, "tr", null, _forTrack0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(84, TeachersComponent_Conditional_84_Template, 7, 0, "div", 36);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275textInterpolate1("", ctx.teachers.length, " enseignants enregistr\xE9s dans le syst\xE8me");
      \u0275\u0275advance(16);
      \u0275\u0275textInterpolate(ctx.teachers.length);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.activeCount);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.onLeaveCount);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.inactiveCount);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchText);
      \u0275\u0275advance(26);
      \u0275\u0275repeater(ctx.filteredTeachers);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.filteredTeachers.length === 0 ? 84 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], styles: ['\n\n.teachers-page[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  flex: 1;\n  min-width: 0;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(37, 99, 235, 0.1),\n      rgba(59, 130, 246, 0.05));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n  color: var(--primary-color);\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(1.1rem, 3vw, 1.6rem);\n  font-weight: 800;\n  color: #0f172a;\n  letter-spacing: -0.02em;\n}\n.page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 4px 0 0;\n  color: #64748b;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.page-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  flex-shrink: 0;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 10px 18px;\n  border-radius: 10px;\n  font-weight: 600;\n  font-size: 0.88rem;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  border: none;\n  transition: all 0.2s ease;\n}\n.btn[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n}\n.btn.btn-primary[_ngcontent-%COMP%] {\n  background: var(--primary-color);\n  color: white;\n  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);\n}\n.btn.btn-primary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);\n}\n.btn.btn-outline[_ngcontent-%COMP%] {\n  background: white;\n  border: 1.5px solid rgba(226, 232, 240, 0.9);\n  color: #475569;\n}\n.btn.btn-outline[_ngcontent-%COMP%]:hover {\n  border-color: var(--primary-color);\n  color: var(--primary-color);\n  background: rgba(37, 99, 235, 0.04);\n}\n.btn.btn-sm[_ngcontent-%COMP%] {\n  padding: 8px 14px;\n  font-size: 0.82rem;\n}\n.btn.btn-sm[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n@media (max-width: 640px) {\n  .btn[_ngcontent-%COMP%]   .btn-text[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .btn[_ngcontent-%COMP%] {\n    padding: 10px 12px;\n  }\n}\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 16px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 14px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  transition: all 0.25s ease;\n  position: relative;\n  overflow: hidden;\n}\n.stat-card[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: var(--accent);\n  border-radius: 4px 0 0 4px;\n  transform: scaleY(0);\n  transition: transform 0.3s ease;\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.07);\n  border-color: color-mix(in srgb, var(--accent) 30%, white);\n}\n.stat-card[_ngcontent-%COMP%]:hover::before {\n  transform: scaleY(1);\n}\n.stat-card[_ngcontent-%COMP%]:hover   .stat-icon[_ngcontent-%COMP%] {\n  transform: scale(1.08);\n}\n.stat-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  width: 46px;\n  height: 46px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.2rem;\n  flex-shrink: 0;\n  transition: transform 0.2s ease;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-icon.blue[_ngcontent-%COMP%] {\n  background: rgba(219, 234, 254, 0.7);\n  color: #1d4ed8;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-icon.green[_ngcontent-%COMP%] {\n  background: rgba(220, 252, 231, 0.7);\n  color: #166534;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-icon.amber[_ngcontent-%COMP%] {\n  background: rgba(254, 249, 195, 0.7);\n  color: #854d0e;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-icon.red[_ngcontent-%COMP%] {\n  background: rgba(254, 226, 226, 0.7);\n  color: #991b1b;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 800;\n  color: #0f172a;\n  line-height: 1;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #64748b;\n  font-weight: 600;\n  margin-top: 4px;\n}\n.table-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  box-shadow: 0 4px 16px rgba(2, 6, 23, 0.04);\n  overflow: hidden;\n}\n.table-top[_ngcontent-%COMP%] {\n  padding: 20px 24px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n  background: rgba(248, 250, 252, 0.5);\n}\n.table-top[_ngcontent-%COMP%]   .search-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  max-width: 420px;\n}\n.table-top[_ngcontent-%COMP%]   .search-wrap[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 14px;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #94a3b8;\n  font-size: 0.9rem;\n}\n.table-top[_ngcontent-%COMP%]   .search-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 10px 16px 10px 42px;\n  border-radius: 10px;\n  border: 1.5px solid rgba(226, 232, 240, 0.9);\n  background: white;\n  font-size: 0.88rem;\n  color: #0f172a;\n  outline: none;\n  transition: all 0.2s ease;\n}\n.table-top[_ngcontent-%COMP%]   .search-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  border-color: var(--primary-color);\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\n.table-top[_ngcontent-%COMP%]   .search-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8;\n}\n.table-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.pro-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 900px;\n}\n.pro-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 14px 20px;\n  background: rgba(248, 250, 252, 0.8);\n  text-align: left;\n  color: #475569;\n  font-size: 0.78rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  border-bottom: 2px solid rgba(226, 232, 240, 0.8);\n  position: sticky;\n  top: 0;\n  z-index: 2;\n}\n.pro-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child {\n  text-align: right;\n}\n.pro-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  transition: all 0.15s ease;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n}\n.pro-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.pro-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: rgba(37, 99, 235, 0.025);\n}\n.pro-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  vertical-align: middle;\n  color: #334155;\n  font-size: 0.88rem;\n}\n.name-cell[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #0f172a;\n  font-size: 0.92rem;\n}\n.matricule[_ngcontent-%COMP%] {\n  background: rgba(219, 234, 254, 0.6);\n  color: #1d4ed8;\n  padding: 4px 10px;\n  border-radius: 6px;\n  font-family:\n    "SF Mono",\n    "Fira Code",\n    monospace;\n  font-weight: 600;\n  font-size: 0.82rem;\n  border: 1px solid rgba(191, 219, 254, 0.5);\n  display: inline-block;\n}\n.contact[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 0.85rem;\n  color: #475569;\n  font-weight: 500;\n}\n.contact[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  color: #94a3b8;\n  flex-shrink: 0;\n}\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 5px;\n}\n.chip[_ngcontent-%COMP%] {\n  background: rgba(241, 245, 249, 0.9);\n  color: #334155;\n  padding: 3px 10px;\n  border-radius: 6px;\n  font-size: 0.76rem;\n  font-weight: 600;\n  border: 1px solid rgba(226, 232, 240, 0.7);\n  transition: all 0.15s ease;\n}\n.chip[_ngcontent-%COMP%]:hover {\n  background: rgba(37, 99, 235, 0.07);\n  border-color: rgba(37, 99, 235, 0.25);\n  color: #1e40af;\n}\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  justify-content: flex-end;\n}\n.actions[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 8px;\n  border: 1px solid rgba(226, 232, 240, 0.8);\n  background: white;\n  color: #64748b;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.9rem;\n  transition: all 0.15s ease;\n}\n.actions[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  color: var(--primary-color);\n  border-color: rgba(37, 99, 235, 0.4);\n  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.12);\n}\n.actions[_ngcontent-%COMP%]   .action-btn.danger[_ngcontent-%COMP%]:hover {\n  background: rgba(254, 226, 226, 0.7);\n  color: #dc2626;\n  border-color: rgba(220, 38, 38, 0.4);\n  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.1);\n}\n.empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 48px 24px;\n  text-align: center;\n}\n.empty-state[_ngcontent-%COMP%]   .empty-icon[_ngcontent-%COMP%] {\n  width: 72px;\n  height: 72px;\n  border-radius: 20px;\n  background: rgba(241, 245, 249, 0.8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-bottom: 16px;\n}\n.empty-state[_ngcontent-%COMP%]   .empty-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  color: #94a3b8;\n}\n.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: #334155;\n  margin: 0 0 6px;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: #94a3b8;\n  margin: 0;\n}\n@media (max-width: 768px) {\n  .page-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .table-top[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .table-top[_ngcontent-%COMP%]   .search-wrap[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n}\n@media (max-width: 480px) {\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n}\n/*# sourceMappingURL=teachers.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TeachersComponent, [{
    type: Component,
    args: [{ selector: "app-teachers", standalone: true, imports: [CommonModule, FormsModule], template: `
    <div class="teachers-page">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <i class="pi pi-users"></i>
          </div>
          <div>
            <h1>Gestion des Enseignants</h1>
            <p>{{ teachers.length }} enseignants enregistr\xE9s dans le syst\xE8me</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline">
            <i class="pi pi-filter"></i> <span class="btn-text">Filtres</span>
          </button>
          <button class="btn btn-primary">
            <i class="pi pi-plus"></i> <span class="btn-text">Nouvel Enseignant</span>
          </button>
        </div>
      </div>

      <!-- STATS -->
      <div class="stats-grid">
        <div class="stat-card" style="--accent: #3b82f6">
          <div class="stat-icon blue"><i class="pi pi-users"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ teachers.length }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
        <div class="stat-card" style="--accent: #22c55e">
          <div class="stat-icon green"><i class="pi pi-check-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ activeCount }}</span>
            <span class="stat-label">Actifs</span>
          </div>
        </div>
        <div class="stat-card" style="--accent: #f59e0b">
          <div class="stat-icon amber"><i class="pi pi-clock"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ onLeaveCount }}</span>
            <span class="stat-label">En cong\xE9</span>
          </div>
        </div>
        <div class="stat-card" style="--accent: #ef4444">
          <div class="stat-icon red"><i class="pi pi-ban"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ inactiveCount }}</span>
            <span class="stat-label">Inactifs</span>
          </div>
        </div>
      </div>

      <!-- TABLE CARD -->
      <div class="table-card">
        <div class="table-top">
          <div class="search-wrap">
            <i class="pi pi-search"></i>
            <input
              type="text"
              placeholder="Rechercher par nom, pr\xE9nom, matricule, email..."
              [(ngModel)]="searchText"
              (input)="filterTeachers()"
            />
          </div>
          <button class="btn btn-outline btn-sm">
            <i class="pi pi-download"></i> <span class="btn-text">Exporter</span>
          </button>
        </div>

        <div class="table-scroll">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Pr\xE9nom</th>
                <th>Mati\xE8re</th>
                <th>Matricule</th>
                <th>Email</th>
                <th>T\xE9l\xE9phone</th>
                <th>Adresse</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (teacher of filteredTeachers; track teacher.id) {
                <tr>
                  <td>
                    <span class="name-cell">{{ teacher.lastName }}</span>
                  </td>
                  <td>
                    <span class="name-cell">{{ teacher.firstName }}</span>
                  </td>
                  <td>
                    <div class="chips">
                      @for (subject of teacher.subjects; track subject) {
                        <span class="chip">{{ subject }}</span>
                      }
                    </div>
                  </td>
                  <td>
                    <span class="matricule">{{ teacher.matricule }}</span>
                  </td>
                  <td>
                    <span class="contact"><i class="pi pi-envelope"></i> {{ teacher.email }}</span>
                  </td>
                  <td>
                    <span class="contact"><i class="pi pi-phone"></i> {{ teacher.telephone }}</span>
                  </td>
                  <td>
                    <span class="contact"
                      ><i class="pi pi-map-marker"></i> {{ teacher.adresse }}</span
                    >
                  </td>
                  <td class="text-right">
                    <div class="actions">
                      <button class="action-btn" title="Modifier">
                        <i class="pi pi-pencil"></i>
                      </button>
                      <button class="action-btn" title="Statistiques">
                        <i class="pi pi-chart-line"></i>
                      </button>
                      <button class="action-btn danger" title="Supprimer">
                        <i class="pi pi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (filteredTeachers.length === 0) {
          <div class="empty-state">
            <div class="empty-icon"><i class="pi pi-search"></i></div>
            <h3>Aucun enseignant trouv\xE9</h3>
            <p>Essayez de modifier vos crit\xE8res de recherche</p>
          </div>
        }
      </div>
    </div>
  `, styles: ['/* angular:styles/component:scss;dfcd8d677d296306ccadac787f391f9327614691e9ea0b2ecbb72102c563f0d7;/home/aya97/suivi-pedagogique-system/frontend-web/src/app/features/teachers/teachers.component.ts */\n.teachers-page {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.page-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.page-header .header-left {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  flex: 1;\n  min-width: 0;\n}\n.page-header .header-left .header-icon {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(37, 99, 235, 0.1),\n      rgba(59, 130, 246, 0.05));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.page-header .header-left .header-icon i {\n  font-size: 1.3rem;\n  color: var(--primary-color);\n}\n.page-header .header-left h1 {\n  margin: 0;\n  font-size: clamp(1.1rem, 3vw, 1.6rem);\n  font-weight: 800;\n  color: #0f172a;\n  letter-spacing: -0.02em;\n}\n.page-header .header-left p {\n  margin: 4px 0 0;\n  color: #64748b;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.page-header .header-actions {\n  display: flex;\n  gap: 10px;\n  flex-shrink: 0;\n}\n.btn {\n  padding: 10px 18px;\n  border-radius: 10px;\n  font-weight: 600;\n  font-size: 0.88rem;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  border: none;\n  transition: all 0.2s ease;\n}\n.btn i {\n  font-size: 0.95rem;\n}\n.btn.btn-primary {\n  background: var(--primary-color);\n  color: white;\n  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);\n}\n.btn.btn-primary:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);\n}\n.btn.btn-outline {\n  background: white;\n  border: 1.5px solid rgba(226, 232, 240, 0.9);\n  color: #475569;\n}\n.btn.btn-outline:hover {\n  border-color: var(--primary-color);\n  color: var(--primary-color);\n  background: rgba(37, 99, 235, 0.04);\n}\n.btn.btn-sm {\n  padding: 8px 14px;\n  font-size: 0.82rem;\n}\n.btn.btn-sm i {\n  font-size: 0.85rem;\n}\n@media (max-width: 640px) {\n  .btn .btn-text {\n    display: none;\n  }\n  .btn {\n    padding: 10px 12px;\n  }\n}\n.stats-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 16px;\n}\n.stat-card {\n  background: white;\n  border-radius: 14px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  transition: all 0.25s ease;\n  position: relative;\n  overflow: hidden;\n}\n.stat-card::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: var(--accent);\n  border-radius: 4px 0 0 4px;\n  transform: scaleY(0);\n  transition: transform 0.3s ease;\n}\n.stat-card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.07);\n  border-color: color-mix(in srgb, var(--accent) 30%, white);\n}\n.stat-card:hover::before {\n  transform: scaleY(1);\n}\n.stat-card:hover .stat-icon {\n  transform: scale(1.08);\n}\n.stat-card .stat-icon {\n  width: 46px;\n  height: 46px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.2rem;\n  flex-shrink: 0;\n  transition: transform 0.2s ease;\n}\n.stat-card .stat-icon.blue {\n  background: rgba(219, 234, 254, 0.7);\n  color: #1d4ed8;\n}\n.stat-card .stat-icon.green {\n  background: rgba(220, 252, 231, 0.7);\n  color: #166534;\n}\n.stat-card .stat-icon.amber {\n  background: rgba(254, 249, 195, 0.7);\n  color: #854d0e;\n}\n.stat-card .stat-icon.red {\n  background: rgba(254, 226, 226, 0.7);\n  color: #991b1b;\n}\n.stat-card .stat-info {\n  display: flex;\n  flex-direction: column;\n}\n.stat-card .stat-info .stat-value {\n  font-size: 1.5rem;\n  font-weight: 800;\n  color: #0f172a;\n  line-height: 1;\n}\n.stat-card .stat-info .stat-label {\n  font-size: 0.8rem;\n  color: #64748b;\n  font-weight: 600;\n  margin-top: 4px;\n}\n.table-card {\n  background: white;\n  border-radius: 16px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  box-shadow: 0 4px 16px rgba(2, 6, 23, 0.04);\n  overflow: hidden;\n}\n.table-top {\n  padding: 20px 24px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n  background: rgba(248, 250, 252, 0.5);\n}\n.table-top .search-wrap {\n  position: relative;\n  flex: 1;\n  max-width: 420px;\n}\n.table-top .search-wrap i {\n  position: absolute;\n  left: 14px;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #94a3b8;\n  font-size: 0.9rem;\n}\n.table-top .search-wrap input {\n  width: 100%;\n  padding: 10px 16px 10px 42px;\n  border-radius: 10px;\n  border: 1.5px solid rgba(226, 232, 240, 0.9);\n  background: white;\n  font-size: 0.88rem;\n  color: #0f172a;\n  outline: none;\n  transition: all 0.2s ease;\n}\n.table-top .search-wrap input:focus {\n  border-color: var(--primary-color);\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\n.table-top .search-wrap input::placeholder {\n  color: #94a3b8;\n}\n.table-scroll {\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.pro-table {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 900px;\n}\n.pro-table thead th {\n  padding: 14px 20px;\n  background: rgba(248, 250, 252, 0.8);\n  text-align: left;\n  color: #475569;\n  font-size: 0.78rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  border-bottom: 2px solid rgba(226, 232, 240, 0.8);\n  position: sticky;\n  top: 0;\n  z-index: 2;\n}\n.pro-table thead th:last-child {\n  text-align: right;\n}\n.pro-table tbody tr {\n  transition: all 0.15s ease;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n}\n.pro-table tbody tr:last-child {\n  border-bottom: none;\n}\n.pro-table tbody tr:hover {\n  background: rgba(37, 99, 235, 0.025);\n}\n.pro-table tbody td {\n  padding: 16px 20px;\n  vertical-align: middle;\n  color: #334155;\n  font-size: 0.88rem;\n}\n.name-cell {\n  font-weight: 700;\n  color: #0f172a;\n  font-size: 0.92rem;\n}\n.matricule {\n  background: rgba(219, 234, 254, 0.6);\n  color: #1d4ed8;\n  padding: 4px 10px;\n  border-radius: 6px;\n  font-family:\n    "SF Mono",\n    "Fira Code",\n    monospace;\n  font-weight: 600;\n  font-size: 0.82rem;\n  border: 1px solid rgba(191, 219, 254, 0.5);\n  display: inline-block;\n}\n.contact {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 0.85rem;\n  color: #475569;\n  font-weight: 500;\n}\n.contact i {\n  font-size: 0.82rem;\n  color: #94a3b8;\n  flex-shrink: 0;\n}\n.chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 5px;\n}\n.chip {\n  background: rgba(241, 245, 249, 0.9);\n  color: #334155;\n  padding: 3px 10px;\n  border-radius: 6px;\n  font-size: 0.76rem;\n  font-weight: 600;\n  border: 1px solid rgba(226, 232, 240, 0.7);\n  transition: all 0.15s ease;\n}\n.chip:hover {\n  background: rgba(37, 99, 235, 0.07);\n  border-color: rgba(37, 99, 235, 0.25);\n  color: #1e40af;\n}\n.text-right {\n  text-align: right;\n}\n.actions {\n  display: flex;\n  gap: 6px;\n  justify-content: flex-end;\n}\n.actions .action-btn {\n  width: 34px;\n  height: 34px;\n  border-radius: 8px;\n  border: 1px solid rgba(226, 232, 240, 0.8);\n  background: white;\n  color: #64748b;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.9rem;\n  transition: all 0.15s ease;\n}\n.actions .action-btn:hover {\n  transform: translateY(-1px);\n  color: var(--primary-color);\n  border-color: rgba(37, 99, 235, 0.4);\n  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.12);\n}\n.actions .action-btn.danger:hover {\n  background: rgba(254, 226, 226, 0.7);\n  color: #dc2626;\n  border-color: rgba(220, 38, 38, 0.4);\n  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.1);\n}\n.empty-state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 48px 24px;\n  text-align: center;\n}\n.empty-state .empty-icon {\n  width: 72px;\n  height: 72px;\n  border-radius: 20px;\n  background: rgba(241, 245, 249, 0.8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-bottom: 16px;\n}\n.empty-state .empty-icon i {\n  font-size: 1.8rem;\n  color: #94a3b8;\n}\n.empty-state h3 {\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: #334155;\n  margin: 0 0 6px;\n}\n.empty-state p {\n  font-size: 0.85rem;\n  color: #94a3b8;\n  margin: 0;\n}\n@media (max-width: 768px) {\n  .page-header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .stats-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .table-top {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .table-top .search-wrap {\n    max-width: 100%;\n  }\n}\n@media (max-width: 480px) {\n  .stats-grid {\n    grid-template-columns: 1fr;\n  }\n  .page-header .header-left h1 {\n    font-size: 1.2rem;\n  }\n}\n/*# sourceMappingURL=teachers.component.css.map */\n'] }]
  }], () => [{ type: TeacherService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeachersComponent, { className: "TeachersComponent", filePath: "src/app/features/teachers/teachers.component.ts", lineNumber: 646 });
})();
export {
  TeachersComponent
};
//# sourceMappingURL=chunk-4QNW776I.js.map
