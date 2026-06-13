import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";

@Injectable({ providedIn: "root" })
export class TokenStorageService {
  private readonly tokenKey = "auth_token";

  async getToken(): Promise<string | null> {
    const result = await Preferences.get({ key: this.tokenKey });
    return result.value;
  }

  async setToken(token: string): Promise<void> {
    await Preferences.set({ key: this.tokenKey, value: token });
  }

  async clearToken(): Promise<void> {
    await Preferences.remove({ key: this.tokenKey });
  }
}
