export interface Emargement {
  id?: number;
  dateHeureScan?: string;
  latitudeGPS?: string;
  longitudeGPS?: string;
  estLocalisee?: boolean;
  estConfirme?: boolean;
  
  enseignantNomPrenom?: string;
  matiereLibelle?: string;
  lieu?: string;
  heureSeance?: string;
  statutAffichage?: string;
  methode?: string;
}
