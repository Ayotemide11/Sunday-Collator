import { useState, useEffect, useMemo } from 'react';
import { AttendanceRecord, DistrictName } from './types';
import {
  subscribeToAttendanceRecords,
  saveRecordToFirestore,
  deleteRecordFromFirestore,
  resetFirestoreRecordsToZero,
} from './utils/firebaseStorage';
import {
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
  Flame,
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getRecentSundayDate());
  const [selectedFilterDistrict, setSelectedFilterDistrict] = useState<DistrictName | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Appearance theme state: Deep Sapphire / Executive Navy Slate
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

  // Real-time synchronization initialization with Firebase Firestore backend
  useEffect(() => {
    const unsubscribe = subscribeToAttendanceRecords(
      (updatedRecords) => {
        setRecords(updatedRecords);
        setIsFirebaseConnected(true);
      },
      (error) => {
        console.error('Firestore real-time sync error:', error);
        setIsFirebaseConnected(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Save new or updated record to Firestore backend
  const handleSaveRecord = async (
    data: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    try {
      await saveRecordToFirestore(data, id);
      showToast(id ? `Updated record for ${data.district}` : `Logged attendance for ${data.district}!`);
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
      showToast('Error saving record to Firebase.');
    }
  };

  // Delete record from Firestore backend
  const handleDeleteRecord = async (id: string) => {
    const target = records.find((r) => r.id === id);
    try {
      await deleteRecordFromFirestore(id);
      if (target) {
        showToast(`Deleted record for ${target.district}`);
      }
    } catch (err) {
      console.error('Failed to delete from Firestore:', err);
      showToast('Error deleting record.');
    }
  };

  // Reset all figures to zero in Firestore backend
  const handleResetToZero = async () => {
    try {
      await resetFirestoreRecordsToZero();
      showToast('All collation figures reset to zero on Firebase Firestore.');
    } catch (err) {
      console.error('Failed to reset Firestore records:', err);
      showToast('Error resetting records.');
    }
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
          ? 'bg-slate-950 text-slate-100 dark'
          : 'bg-slate-50/80 text-slate-900'
      }`}
    >
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-indigo-500 flex items-center space-x-2 animate-bounce">
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
        onResetToZero={() => setIsAdminPinOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isLiveConnected={isFirebaseConnected}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Firebase Firestore Real-time Banner */}
        <div className="bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-900 dark:text-indigo-200 shadow-2xs">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 animate-pulse" />
            <span>
              <strong className="font-extrabold text-slate-900 dark:text-white">Firebase Firestore Backend Active:</strong> All Sunday collation figures logged from different IP addresses & devices sync instantly in real time.
            </span>
          </div>
          <span className="text-[11px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-300 font-bold px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-700 flex items-center">
            <Radio className="w-3 h-3 mr-1 text-indigo-600 dark:text-indigo-400" /> Live Firestore DB
          </span>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <nav className="flex space-x-2 sm:space-x-3">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex items-center px-3.5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
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
                  ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
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
                  ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-1.5" />
              <span>Analytics & Charts</span>
            </button>
          </nav>

          <div className="hidden sm:flex items-center text-xs font-extrabold text-slate-800 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700">
            <Building2 className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
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
        className="sm:hidden fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl border-2 border-slate-900 focus:outline-none cursor-pointer flex items-center justify-center font-bold"
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
      <footer id="app-footer" className="bg-slate-900 text-slate-300/80 border-t border-slate-800 py-6 mt-12 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white">AYAC Lagos Sunday Collator</span>
            <span>•</span>
            <span>Annual Youth Alive Convention, Living Faith Church Lagos</span>
          </div>
          <div className="text-slate-400 font-semibold">
            Districts: Badagry • Epe • Igbogbo • Ijede • Irawo • Magbon-Alade • Morogbo • State Church Ikorodu
          </div>
        </div>
      </footer>

    </div>
  );
}
