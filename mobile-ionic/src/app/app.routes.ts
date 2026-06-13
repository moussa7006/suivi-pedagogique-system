import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";

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
    path: "forgot-password",
    loadComponent: () =>
      import("./forgot-password/forgot-password.page").then(
        (m) => m.ForgotPasswordPage,
      ),
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./reset-password/reset-password.page").then(
        (m) => m.ResetPasswordPage,
      ),
  },
  {
    path: "change-password",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./change-password/change-password.page").then(
        (m) => m.ChangePasswordPage,
      ),
  },
  {
    path: "profile",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./profile/profile.page").then((m) => m.ProfilePage),
  },
  {
    path: "tabs",
    canActivate: [authGuard],
    loadChildren: () => import("./tabs/tabs.routes").then((m) => m.routes),
  },
  {
    path: "planning",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./planning/planning.page").then((m) => m.PlanningPage),
  },
  {
    path: "scan-qr",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./scan-qr/scan-qr.page").then((m) => m.ScanQRPage),
  },
];
