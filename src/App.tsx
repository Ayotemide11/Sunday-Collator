import { useState, useEffect, useMemo, useRef } from 'react';
import { AttendanceRecord, DistrictName } from './types';
import {
  loadLocalCache,
  saveLocalCache,
  fetchServerRecords,
  saveRecordToServer,
  deleteRecordFromServer,
  resetServerRecordsToZero,
  syncLocalRecordsWithServer,
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
import { AdminPinModal } from './components/AdminPinModal';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import {
  LayoutDashboard,
  Table,
  BarChart2,
  Plus,
  CheckCircle2,
  Building2,
  Radio,
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<AttendanceRecord[]>(() => loadLocalCache());
  const [selectedDate, setSelectedDate] = useState<string>(getRecentSundayDate());
  const [selectedFilterDistrict, setSelectedFilterDistrict] = useState<DistrictName | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Appearance theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('ayac_theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  });

  // Modals & UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [defaultDistrictForForm, setDefaultDistrictForForm] = useState<DistrictName | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isAdminPinOpen, setIsAdminPinOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'analytics'>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialSyncDone = useRef(false);

  // Apply theme class to root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ayac_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Real-time synchronization initialization (SSE + Polling Fallback)
  useEffect(() => {
    // Initial fetch and sync
    const initServerSync = async () => {
      const local = loadLocalCache();
      const synced = await syncLocalRecordsWithServer(local);
      setRecords(synced);
      initialSyncDone.current = true;
    };

    initServerSync();

    // Subscribe to real-time Server-Sent Events (SSE)
    let eventSource: EventSource | null = null;

    const setupSSE = () => {
      try {
        eventSource = new EventSource('/api/records/stream');

        eventSource.onopen = () => {
          setIsLiveConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (Array.isArray(data.records)) {
              setRecords(data.records);
              saveLocalCache(data.records);

              // Notify user if updated by external submission
              if (
                initialSyncDone.current &&
                (data.type === 'upsert' || data.type === 'delete' || data.type === 'reset')
              ) {
                showToast('Collation updated in real-time!');
              }
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e);
          }
        };

        eventSource.onerror = () => {
          setIsLiveConnected(false);
          eventSource?.close();
          // Retry connection after 3 seconds
          setTimeout(setupSSE, 3000);
        };
      } catch (err) {
        console.warn('SSE not supported or connection failed:', err);
        setIsLiveConnected(false);
      }
    };

    setupSSE();

    // Safety polling fallback every 5 seconds
    const intervalId = setInterval(async () => {
      const latest = await fetchServerRecords();
      setRecords(latest);
    }, 5000);

    return () => {
      eventSource?.close();
      clearInterval(intervalId);
    };
  }, []);

  // Save new or updated record to backend server
  const handleSaveRecord = async (
    data: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    const updated = await saveRecordToServer(data, id);
    setRecords(updated);
    showToast(id ? `Updated record for ${data.district}` : `Logged attendance for ${data.district}!`);
  };

  // Delete record on server
  const handleDeleteRecord = async (id: string) => {
    const target = records.find((r) => r.id === id);
    const updated = await deleteRecordFromServer(id);
    setRecords(updated);
    if (target) {
      showToast(`Deleted record for ${target.district}`);
    }
  };

  // Reset all figures to zero on server
  const handleResetToZero = async () => {
    const cleared = await resetServerRecordsToZero();
    setRecords(cleared);
    showToast('All collation figures reset to zero.');
  };

  // Open Form modal for specific district
  const handleLogForDistrict = (district: DistrictName) => {
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
    <div
      id="ayac-app-root"
      className={`min-h-screen font-sans flex flex-col antialiased transition-colors ${
        theme === 'dark'
          ? 'bg-blue-950/95 text-sky-100 dark'
          : 'bg-blue-50/40 text-blue-950'
      }`}
    >
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-950 text-sky-100 text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-sky-400 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
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
        onResetToZero={() => setIsAdminPinOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isLiveConnected={isLiveConnected}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Real-time Multi-User Live Banner */}
        <div className="bg-sky-500/10 dark:bg-blue-900/50 border border-sky-400/30 dark:border-blue-800 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-blue-950 dark:text-sky-200 shadow-2xs">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-sky-500 animate-pulse flex-shrink-0" />
            <span>
              <strong className="font-extrabold text-blue-950 dark:text-white">Real-Time Multi-User Collation Active:</strong> Figures logged by users from any device or IP address are collated and synchronized live.
            </span>
          </div>
          <span className="text-[11px] bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold px-2.5 py-0.5 rounded border border-sky-200 dark:border-sky-500/30">
            Instant SSE Sync
          </span>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-blue-200/80 dark:border-blue-900 pb-2">
          <nav className="flex space-x-2 sm:space-x-3">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex items-center px-3.5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-950 text-sky-300 dark:bg-sky-400 dark:text-blue-950 shadow-md'
                  : 'text-blue-900/80 dark:text-sky-300 hover:text-blue-950 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-blue-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-1.5" />
              <span>Collation Dashboard</span>
            </button>

            <button
              id="tab-records-table"
              onClick={() => setActiveTab('table')}
              className={`inline-flex items-center px-3.5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-blue-950 text-sky-300 dark:bg-sky-400 dark:text-blue-950 shadow-md'
                  : 'text-blue-900/80 dark:text-sky-300 hover:text-blue-950 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-blue-900/60'
              }`}
            >
              <Table className="w-4 h-4 mr-1.5" />
              <span>All Logged Records ({records.length})</span>
            </button>

            <button
              id="tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center px-3.5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-950 text-sky-300 dark:bg-sky-400 dark:text-blue-950 shadow-md'
                  : 'text-blue-900/80 dark:text-sky-300 hover:text-blue-950 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-blue-900/60'
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-1.5" />
              <span>Analytics & Charts</span>
            </button>
          </nav>

          <div className="hidden sm:flex items-center text-xs font-extrabold text-blue-900 dark:text-sky-300 bg-blue-100/80 dark:bg-blue-900/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            <Building2 className="w-3.5 h-3.5 mr-1.5 text-sky-600 dark:text-sky-400" />
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
        className="sm:hidden fixed bottom-6 right-6 z-40 bg-sky-400 text-blue-950 p-4 rounded-full shadow-2xl border-2 border-blue-900 focus:outline-none cursor-pointer flex items-center justify-center font-bold"
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

      <AdminPinModal
        isOpen={isAdminPinOpen}
        onClose={() => setIsAdminPinOpen(false)}
        onConfirmReset={handleResetToZero}
      />

      {/* App Footer */}
      <footer id="app-footer" className="bg-blue-950 text-sky-200/80 border-t border-blue-900 py-6 mt-12 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white">AYAC Lagos Sunday Collator</span>
            <span>•</span>
            <span>Annual Youth Alive Convention, Living Faith Church Lagos</span>
          </div>
          <div className="text-sky-300/60 font-semibold">
            Districts: Badagry • Epe • Igbogbo • Ijede • Irawo • Magbon-Alade • Morogbo • State Church Ikorodu
          </div>
        </div>
      </footer>

    </div>
  );
}
