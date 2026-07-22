export type DistrictName =
  | 'Badagry'
  | 'Epe'
  | 'Igbogbo'
  | 'Ijede'
  | 'Irawo'
  | 'Magbon-Alade'
  | 'Morogbo'
  | 'State Church Ikorodu';

export interface AttendanceRecord {
  id: string;
  district: DistrictName;
  males: number;
  females: number;
  total: number;
  date: string; // YYYY-MM-DD
  serviceType: string; // e.g., "Sunday Morning Service", "Youth Fellowship", "Joint Service"
  reportedBy?: string;
  remarks?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DistrictSummary {
  district: DistrictName;
  males: number;
  females: number;
  total: number;
  recordCount: number;
  lastReportedDate?: string;
  hasReportedCurrentSunday: boolean;
}

export interface CollatedStats {
  totalMales: number;
  totalFemales: number;
  grandTotal: number;
  malePercentage: number;
  femalePercentage: number;
  reportingDistrictsCount: number;
  totalDistrictsCount: number;
}
