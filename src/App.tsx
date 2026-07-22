import { useState, useEffect, useMemo } from 'react';
import { AttendanceRecord, DistrictName } from './types';
import {
  loadRecords,
  saveRecords,
  resetToSampleData,
  clearAllRecordsToZero,
  calculateCollatedStats,
  getDistrictSummaries,
  exportToCSV,
} from './utils/storage';
import { getRecentSundayDate } from './constants';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { DistrictCardsGrid } from './components/DistrictCardsGrid';
import { AttendanceFormModal } from './components/AttendanceFormModal';
import { RecordsTable } from './components/RecordsTable';
import { WhatsAppExportModal } from './components/WhatsAppExportModal';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import {
  LayoutDashboard,
  Table,
  BarChart2,
  Plus,
  CheckCircle2,
  Building2,
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getRecentSundayDate());
  const [selectedFilterDistrict, setSelectedFilterDistrict] = useState<DistrictName | null>(null);

  // Modals & UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [defaultDistrictForForm, setDefaultDistrictForForm] = useState<DistrictName | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'analytics'>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const loaded = loadRecords();
    setRecords(loaded);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save new or updated record
  const handleSaveRecord = (
    data: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    let updated: AttendanceRecord[];

    if (id) {
      // Edit existing
      updated = records.map((r) =>
        r.id === id
          ? {
              ...r,
              ...data,
              updatedAt: Date.now(),
            }
          : r
      );
      showToast(`Updated record for ${data.district}`);
    } else {
      // Check if record exists for district & date to update or create
      const existing = records.find(
        (r) => r.district === data.district && r.date === data.date
      );

      if (existing) {
        updated = records.map((r) =>
          r.id === existing.id
            ? {
                ...r,
                ...data,
                updatedAt: Date.now(),
              }
            : r
        );
        showToast(`Updated attendance for ${data.district}`);
      } else {
        const newRecord: AttendanceRecord = {
          id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          ...data,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        updated = [newRecord, ...records];
        showToast(`Recorded attendance for ${data.district}!`);
      }
    }

    setRecords(updated);
    saveRecords(updated);
  };

  // Delete record
  const handleDeleteRecord = (id: string) => {
    const target = records.find((r) => r.id === id);
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveRecords(updated);
    if (target) {
      showToast(`Deleted record for ${target.district}`);
    }
  };

  // Reset all figures to zero
  const handleResetToZero = () => {
    const cleared = clearAllRecordsToZero();
    setRecords(cleared);
    showToast('All collation figures reset to zero.');
  };

  // Reset to sample data
  const handleResetData = () => {
    if (window.confirm('Reset all collation records to default sample data?')) {
      const samples = resetToSampleData();
      setRecords(samples);
      showToast('Reset data to AYAC Lagos sample collation.');
    }
  };

  // Open Form modal for specific district
  const handleLogForDistrict = (district: DistrictName) => {
    // Check if there is already a record for this district on selected date
    const existing = records.find(
      (r) => r.district === district && r.date === selectedDate
    );
    if (existing) {
      setEditingRecord(existing);
      setDefaultDistrictForForm(district);
    } else {
      setEditingRecord(null);
      setDefaultDistrictForForm(district);
    }
    setIsFormOpen(true);
  };

  // Calculated Stats & Summaries
  const collatedStats = useMemo(
    () => calculateCollatedStats(records, selectedDate),
    [records, selectedDate]
  );

  const districtSummaries = useMemo(
    () => getDistrictSummaries(records, selectedDate),
    [records, selectedDate]
  );

  return (
    <div id="ayac-app-root" className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header Navigation */}
      <Header
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
        onOpenForm={() => {
          setEditingRecord(null);
          setDefaultDistrictForForm(null);
          setIsFormOpen(true);
        }}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onExportCSV={() => exportToCSV(records)}
        onResetData={handleResetData}
        onResetToZero={handleResetToZero}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <nav className="flex space-x-2 sm:space-x-4">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex items-center px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-1.5" />
              <span>Collation Dashboard</span>
            </button>

            <button
              id="tab-records-table"
              onClick={() => setActiveTab('table')}
              className={`inline-flex items-center px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Table className="w-4 h-4 mr-1.5" />
              <span>All Logged Records ({records.length})</span>
            </button>

            <button
              id="tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-1.5" />
              <span>Analytics & Charts</span>
            </button>
          </nav>

          <div className="hidden sm:flex items-center text-xs font-semibold text-slate-500">
            <Building2 className="w-3.5 h-3.5 mr-1 text-amber-600" />
            <span>8 Districts Active</span>
          </div>
        </div>

        {/* Top Summary Metric Cards */}
        <StatsOverview stats={collatedStats} selectedDate={selectedDate} />

        {/* Tab 1: Dashboard View (District Cards + Table preview) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <DistrictCardsGrid
              summaries={districtSummaries}
              selectedDate={selectedDate}
              onLogForDistrict={handleLogForDistrict}
              selectedFilterDistrict={selectedFilterDistrict}
              onSelectFilterDistrict={(d) => setSelectedFilterDistrict(d)}
            />

            <RecordsTable
              records={records}
              onEdit={(rec) => {
                setEditingRecord(rec);
                setIsFormOpen(true);
              }}
              onDelete={handleDeleteRecord}
              selectedFilterDistrict={selectedFilterDistrict}
              onSelectFilterDistrict={(d) => setSelectedFilterDistrict(d)}
              selectedDate={selectedDate}
            />
          </div>
        )}

        {/* Tab 2: Full Records Table View */}
        {activeTab === 'table' && (
          <div className="space-y-4">
            <RecordsTable
              records={records}
              onEdit={(rec) => {
                setEditingRecord(rec);
                setIsFormOpen(true);
              }}
              onDelete={handleDeleteRecord}
              selectedFilterDistrict={selectedFilterDistrict}
              onSelectFilterDistrict={(d) => setSelectedFilterDistrict(d)}
              selectedDate={selectedDate}
            />
          </div>
        )}

        {/* Tab 3: Visual Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts summaries={districtSummaries} selectedDate={selectedDate} />
        )}

      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        id="btn-floating-add-record"
        onClick={() => {
          setEditingRecord(null);
          setDefaultDistrictForForm(null);
          setIsFormOpen(true);
        }}
        className="sm:hidden fixed bottom-6 right-6 z-40 bg-amber-400 text-slate-950 p-4 rounded-full shadow-2xl border-2 border-slate-900 focus:outline-none cursor-pointer flex items-center justify-center"
        title="Log Attendance"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      <AttendanceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveRecord}
        editingRecord={editingRecord}
        defaultDistrict={defaultDistrictForForm}
        defaultDate={selectedDate}
      />

      <WhatsAppExportModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        records={records}
        selectedDate={selectedDate}
      />

      {/* App Footer */}
      <footer id="app-footer" className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">AYAC Lagos Sunday Collator</span>
            <span>•</span>
            <span>Annual Youth Alive Convention, Living Faith Church Lagos</span>
          </div>
          <div className="text-slate-500">
            Districts: Badagry • Epe • Igbogbo • Ijede • Irawo • Magbon-Alade • Morogbo • State Church Ikorodu
          </div>
        </div>
      </footer>

    </div>
  );
}
