import { DistrictName, AttendanceRecord } from './types';

export const LAGOS_DISTRICTS: DistrictName[] = [
  'Badagry',
  'Epe',
  'Igbogbo',
  'Ijede',
  'Irawo',
  'Magbon-Alade',
  'Morogbo',
  'State Church Ikorodu',
];

export const SERVICE_TYPES = [
  'AYAC 2026',
  'Youth Aflame',
  'Word Explorer',
];

// Helper to get today's date string YYYY-MM-DD
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper for backward compatibility
export function getRecentSundayDate(): string {
  return getTodayDate();
}

export const SAMPLE_RECORDS: AttendanceRecord[] = [
  {
    id: 'rec-1',
    district: 'State Church Ikorodu',
    males: 85,
    females: 110,
    total: 195,
    date: getTodayDate(),
    serviceType: 'AYAC 2026',
    reportedBy: 'Bro. Samuel (Youth Sec)',
    stationName: 'Central Cathedral',
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'rec-2',
    district: 'Igbogbo',
    males: 52,
    females: 68,
    total: 120,
    date: getTodayDate(),
    serviceType: 'AYAC 2026',
    reportedBy: 'Sis. Funke',
    stationName: 'Igbogbo Central Station',
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'rec-3',
    district: 'Ijede',
    males: 38,
    females: 42,
    total: 80,
    date: getTodayDate(),
    serviceType: 'AYAC 2026',
    reportedBy: 'Bro. David',
    stationName: 'Ijede Main Branch',
    createdAt: Date.now() - 3600000 * 3,
    updatedAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'rec-4',
    district: 'Irawo',
    males: 45,
    females: 55,
    total: 100,
    date: getTodayDate(),
    serviceType: 'Youth Aflame',
    reportedBy: 'Sis. Grace',
    stationName: 'Irawo Youth Center',
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'rec-5',
    district: 'Badagry',
    males: 60,
    females: 72,
    total: 132,
    date: getTodayDate(),
    serviceType: 'Word Explorer',
    reportedBy: 'Bro. John',
    stationName: 'Badagry Central',
    createdAt: Date.now() - 3600000 * 1,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'rec-6',
    district: 'Morogbo',
    males: 42,
    females: 48,
    total: 90,
    date: getTodayDate(),
    serviceType: 'AYAC 2026',
    reportedBy: 'Bro. Emmanuel',
    stationName: 'Morogbo Fellowship Station',
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
  },
];
