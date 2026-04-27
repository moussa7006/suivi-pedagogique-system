import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () => import("./login/login.page").then((m) => m.LoginPage),
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./profile/profile.page").then((m) => m.ProfilePage),
  },
  {
    path: "tabs",
    loadChildren: () => import("./tabs/tabs.routes").then((m) => m.routes),
  },
  {
    path: "planning",
    loadComponent: () => import("./planning/planning.page").then((m) => m.PlanningPage),
  },
  {
    path: "scan-qr",
    loadComponent: () => import("./scan-qr/scan-qr.page").then((m) => m.ScanQRPage),
  },
];
