import { AttendanceRecord, CollatedStats, DistrictSummary, DistrictName } from '../types';
import { LAGOS_DISTRICTS, SAMPLE_RECORDS, getRecentSundayDate } from '../constants';

const STORAGE_KEY = 'ayac_lagos_sunday_records_v1';

export function loadRecords(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // Seed initial sample data only on first launch ever
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_RECORDS));
      return SAMPLE_RECORDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading records from storage:', err);
    return [];
  }
}

export function saveRecords(records: AttendanceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving records to storage:', err);
  }
}

export function resetToSampleData(): AttendanceRecord[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_RECORDS));
  return SAMPLE_RECORDS;
}

export function clearAllRecordsToZero(): AttendanceRecord[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
}

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
    reportingDistricts.add(r.district);
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
    const summary = map.get(r.district);
    if (!summary) return;

    if (r.date === selectedDate) {
      summary.males += Number(r.males) || 0;
      summary.females += Number(r.females) || 0;
      summary.total += Number(r.males + r.females) || 0;
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
  const dateStr = selectedDate || getRecentSundayDate();
  const dateFormatted = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const summaries = getDistrictSummaries(records, dateStr);
  const stats = calculateCollatedStats(records, dateStr);

  let text = `*AYAC LAGOS SUNDAY COLLATION REPORT*\n`;
  text += `📅 *Date:* ${dateFormatted}\n`;
  text += `------------------------------------\n\n`;

  let idx = 1;
  summaries.forEach((s) => {
    const statusTag = s.hasReportedCurrentSunday ? '✅' : '⏳ Pending';
    if (s.hasReportedCurrentSunday) {
      text += `${idx}. *${s.district}* ${statusTag}\n`;
      text += `   • Males: ${s.males} | Females: ${s.females} | Total: ${s.total}\n\n`;
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
  text += `\n_Generated via AYAC Lagos Sunday Collator_`;

  return text;
}

export function exportToCSV(records: AttendanceRecord[], filename = 'ayac_lagos_attendance.csv') {
  if (!records.length) return;

  const headers = ['ID', 'District', 'Date', 'Males', 'Females', 'Total', 'Service Type', 'Reported By', 'Remarks'];
  const rows = records.map((r) => [
    r.id,
    `"${r.district}"`,
    r.date,
    r.males,
    r.females,
    r.total,
    `"${r.serviceType || ''}"`,
    `"${r.reportedBy || ''}"`,
    `"${(r.remarks || '').replace(/"/g, '""')}"`,
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
