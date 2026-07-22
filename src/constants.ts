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
  'Sunday Service',
  'Youth Fellowship',
  'Monthly Combined Service',
  'Special Youth Sunday',
  'District Revival / Vigil',
];

// Helper to get nearest past Sunday date string YYYY-MM-DD
export function getRecentSundayDate(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day; // Adjust to Sunday
  const sunday = new Date(now.setDate(diff));
  return sunday.toISOString().split('T')[0];
}

export const SAMPLE_RECORDS: AttendanceRecord[] = [
  {
    id: 'rec-1',
    district: 'State Church Ikorodu',
    males: 85,
    females: 110,
    total: 195,
    date: getRecentSundayDate(),
    serviceType: 'Sunday Service',
    reportedBy: 'Bro. Samuel (Youth Sec)',
    remarks: 'Praise God for high turnout!',
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'rec-2',
    district: 'Igbogbo',
    males: 52,
    females: 68,
    total: 120,
    date: getRecentSundayDate(),
    serviceType: 'Sunday Service',
    reportedBy: 'Sis. Funke',
    remarks: 'Early morning choir rehearsal helped.',
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'rec-3',
    district: 'Ijede',
    males: 38,
    females: 42,
    total: 80,
    date: getRecentSundayDate(),
    serviceType: 'Sunday Service',
    reportedBy: 'Bro. David',
    remarks: 'All 5 branches represented.',
    createdAt: Date.now() - 3600000 * 3,
    updatedAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'rec-4',
    district: 'Irawo',
    males: 45,
    females: 55,
    total: 100,
    date: getRecentSundayDate(),
    serviceType: 'Sunday Service',
    reportedBy: 'Sis. Grace',
    remarks: 'New youth members welcomed.',
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'rec-5',
    district: 'Badagry',
    males: 60,
    females: 72,
    total: 132,
    date: getRecentSundayDate(),
    serviceType: 'Sunday Service',
    reportedBy: 'Bro. John',
    remarks: 'Good attendance across zonal fellowships.',
    createdAt: Date.now() - 3600000 * 1,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'rec-6',
    district: 'Morogbo',
    males: 42,
    females: 48,
    total: 90,
    date: getRecentSundayDate(),
    serviceType: 'Sunday Service',
    reportedBy: 'Bro. Emmanuel',
    remarks: 'Youth Sunday service went smoothly.',
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
  },
];
