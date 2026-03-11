import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor() {}

  async startScan() {
    try {
      // La méthode exacte est scanBarcode avec des options obligatoires
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHintALLOption.ALL
      });

      if (result.ScanResult) {
        return result.ScanResult;
      }
    } catch (error) {
      console.error('Erreur de scan:', error);
    }
    return null;
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });
    return {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };
  }

  verifyAttendance(qrData: string, coords: {lat: number, lng: number}) {
    console.log('Vérification émargement:', { qrData, coords });
    return true; 
  }
}
