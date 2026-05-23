import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private readonly STORAGE_KEY = "app_dark_mode";
  private _dark = false;

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this._dark = saved === "true";
    this.apply();
  }

  get isDark(): boolean {
    return this._dark;
  }

  toggle(): boolean {
    this._dark = !this._dark;
    localStorage.setItem(this.STORAGE_KEY, String(this._dark));
    this.apply();
    return this._dark;
  }

  setDark(enabled: boolean): void {
    this._dark = enabled;
    localStorage.setItem(this.STORAGE_KEY, String(enabled));
    this.apply();
  }

  private apply(): void {
    if (this._dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}
