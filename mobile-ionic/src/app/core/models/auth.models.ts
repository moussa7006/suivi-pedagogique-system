export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  role: "ADMIN" | "ENSEIGNANT" | string;
  forcePasswordChange: boolean;
}
