export interface QRCode {
  id?: number;
  code: string;
  dateHeureCreation: string;
  dateHeureExpiration: string;
  estValide: boolean;
}
