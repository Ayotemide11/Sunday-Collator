import { AttendanceRecord, CollatedStats, DistrictSummary, DistrictName } from '../types';
import { LAGOS_DISTRICTS, SAMPLE_RECORDS, getRecentSundayDate, getTodayDate } from '../constants';

const STORAGE_KEY = 'ayac_lagos_sunday_records_v1';

// Local storage fallback cache helpers
export function loadLocalCache(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading local cache:', err);
    return [];
  }
}

export function saveLocalCache(records: AttendanceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving local cache:', err);
  }
}

// Full-Stack Server API methods with real-time sync

export async function fetchServerRecords(): Promise<AttendanceRecord[]> {
  try {
    const res = await fetch('/api/records');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.records)) {
        saveLocalCache(data.records);
        return data.records;
      }
    }
  } catch (err) {
    console.warn('Backend fetch failed, falling back to local cache:', err);
  }
  return loadLocalCache();
}

export async function saveRecordToServer(
  recordData: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>,
  id?: string
): Promise<AttendanceRecord[]> {
  try {
    const res = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...recordData, id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.records)) {
        saveLocalCache(data.records);
        return data.records;
      }
    }
  } catch (err) {
    console.error('Failed to save record to server:', err);
  }
  return loadLocalCache();
}

export async function deleteRecordFromServer(id: string): Promise<AttendanceRecord[]> {
  try {
    const res = await fetch(`/api/records/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.records)) {
        saveLocalCache(data.records);
        return data.records;
      }
    }
  } catch (err) {
    console.error('Failed to delete record from server:', err);
  }
  return loadLocalCache();
}

export async function resetServerRecordsToZero(): Promise<AttendanceRecord[]> {
  try {
    const res = await fetch('/api/records/reset', {
      method: 'POST',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.records)) {
        saveLocalCache(data.records);
        return data.records;
      }
    }
  } catch (err) {
    console.error('Failed to reset records on server:', err);
  }
  saveLocalCache([]);
  return [];
}

export async function syncLocalRecordsWithServer(localRecords: AttendanceRecord[]): Promise<AttendanceRecord[]> {
  if (!localRecords.length) return fetchServerRecords();
  try {
    const res = await fetch('/api/records/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientRecords: localRecords }),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.records)) {
        saveLocalCache(data.records);
        return data.records;
      }
    }
  } catch (err) {
    console.warn('Sync failed:', err);
  }
  return fetchServerRecords();
}

// Collated Statistics & Reporting Helpers

export function calculateCollatedStats(
  records: AttendanceRecord[],
  selectedDate?: string
): CollatedStats {
  const filtered = selectedDate
    ? records.filter((r) => r.date === selectedDate)
    : records;

  let totalMales = 0;
  let totalFemales = 0;

  const reportingDistricts = new Set<DistrictName>();

  filtered.forEach((r) => {
    totalMales += Number(r.males) || 0;
    totalFemales += Number(r.females) || 0;
    reportingDistricts.add(r.district as DistrictName);
  });

  const grandTotal = totalMales + totalFemales;
  const malePercentage = grandTotal > 0 ? Math.round((totalMales / grandTotal) * 100) : 0;
  const femalePercentage = grandTotal > 0 ? Math.round((totalFemales / grandTotal) * 100) : 0;

  return {
    totalMales,
    totalFemales,
    grandTotal,
    malePercentage,
    femalePercentage,
    reportingDistrictsCount: reportingDistricts.size,
    totalDistrictsCount: LAGOS_DISTRICTS.length,
  };
}

export function getDistrictSummaries(
  records: AttendanceRecord[],
  selectedDate: string
): DistrictSummary[] {
  const map = new Map<DistrictName, DistrictSummary>();

  // Initialize all 8 districts
  LAGOS_DISTRICTS.forEach((district) => {
    map.set(district, {
      district,
      males: 0,
      females: 0,
      total: 0,
      recordCount: 0,
      hasReportedCurrentSunday: false,
    });
  });

  records.forEach((r) => {
    const summary = map.get(r.district as DistrictName);
    if (!summary) return;

    if (r.date === selectedDate) {
      summary.males += Number(r.males) || 0;
      summary.females += Number(r.females) || 0;
      summary.total += Number(r.males) + Number(r.females);
      summary.recordCount += 1;
      summary.hasReportedCurrentSunday = true;
      summary.lastReportedDate = r.date;
    } else if (!summary.lastReportedDate || r.date > summary.lastReportedDate) {
      summary.lastReportedDate = r.date;
    }
  });

  return Array.from(map.values());
}

export function generateWhatsAppReport(
  records: AttendanceRecord[],
  selectedDate: string
): string {
  const dateStr = selectedDate || getTodayDate();
  const dateFormatted = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const summaries = getDistrictSummaries(records, dateStr);
  const stats = calculateCollatedStats(records, dateStr);

  let text = `*AYAC LAGOS COLLATION REPORT*\n`;
  text += `📅 *Date:* ${dateFormatted}\n`;
  text += `------------------------------------\n\n`;

  let idx = 1;
  summaries.forEach((s) => {
    const statusTag = s.hasReportedCurrentSunday ? '✅' : '⏳ Pending';
    if (s.hasReportedCurrentSunday) {
      text += `${idx}. *${s.district}* ${statusTag}\n`;
      text += `   • Males: ${s.males} | Females: ${s.females} | Total: ${s.total}\n`;
      // List stations for this district
      const districtRecords = records.filter(r => r.district === s.district && r.date === dateStr);
      if (districtRecords.length > 0) {
        text += `   • Stations & Reporters:\n`;
        districtRecords.forEach(r => {
          const st = r.stationName || r.remarks || 'Main Station';
          const rep = r.reportedBy || 'N/A';
          text += `     - ${st} (${r.males}M / ${r.females}F) - Rep: ${rep}\n`;
        });
      }
      text += `\n`;
    } else {
      text += `${idx}. *${s.district}* ${statusTag}\n\n`;
    }
    idx++;
  });

  text += `------------------------------------\n`;
  text += `📊 *SUMMARY TOTALS (${stats.reportingDistrictsCount}/${stats.totalDistrictsCount} Districts Reported)*:\n`;
  text += `👨 *Total Males:* ${stats.totalMales} (${stats.malePercentage}%)\n`;
  text += `👩 *Total Females:* ${stats.totalFemales} (${stats.femalePercentage}%)\n`;
  text += `🏆 *GRAND TOTAL PARTICIPANTS:* ${stats.grandTotal}\n`;
  text += `\n_Generated via AYAC Lagos Attendance Collator_`;

  return text;
}

export function exportToCSV(records: AttendanceRecord[], filename = 'ayac_lagos_attendance.csv') {
  if (!records.length) return;

  const headers = ['ID', 'District', 'Date', 'Males', 'Females', 'Total', 'Service Type', 'Reported By', 'Name of Station'];
  const rows = records.map((r) => [
    r.id,
    `"${r.district}"`,
    r.date,
    r.males,
    r.females,
    r.total,
    `"${r.serviceType || ''}"`,
    `"${r.reportedBy || ''}"`,
    `"${(r.stationName || r.remarks || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
