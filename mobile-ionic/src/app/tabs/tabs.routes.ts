import { Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

export const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        loadComponent: () =>
          import("../tab1/tab1.page").then((m) => m.Tab1Page),
      },
      {
        path: "tab2",
        loadComponent: () =>
          import("../profile/profile.page").then((m) => m.ProfilePage),
      },
      {
        path: "tab3",
        loadComponent: () =>
          import("../historique/historique.page").then((m) => m.HistoriquePage),
      },
      {
        path: "tab4",
        loadComponent: () =>
          import("../cahier-textes/cahier-textes.page").then(
            (m) => m.CahierTextesPage,
          ),
      },
      {
        path: "",
        redirectTo: "tab1",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "tabs",
    pathMatch: "full",
  },
];
