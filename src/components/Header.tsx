import React from 'react';
import { PlusCircle, Share2, Download, RotateCcw, Calendar, Church } from 'lucide-react';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onOpenForm: () => void;
  onOpenWhatsApp: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  onResetToZero: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onDateChange,
  onOpenForm,
  onOpenWhatsApp,
  onExportCSV,
  onResetData,
  onResetToZero,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-indigo-600 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Church className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AYAC LAGOS
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">Annual Youth Alive Convention, Living Faith Church Lagos</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                Sunday Collator
              </h1>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Date Selector */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200">
              <Calendar className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" />
              <input
                id="header-date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-medium text-xs sm:text-sm"
              />
            </div>

            {/* Primary Action Button */}
            <button
              id="btn-add-entry-header"
              onClick={onOpenForm}
              className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Log Attendance</span>
            </button>

            {/* Secondary Action Buttons */}
            <button
              id="btn-whatsapp-export"
              onClick={onOpenWhatsApp}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900/80 transition-colors cursor-pointer"
              title="Generate WhatsApp summary text"
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              id="btn-export-csv"
              onClick={onExportCSV}
              className="inline-flex items-center justify-center px-2.5 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              title="Download CSV report"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="btn-reset-to-zero"
              onClick={onResetToZero}
              className="inline-flex items-center justify-center px-2.5 py-2 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 transition-colors cursor-pointer"
              title="Reset all figures to zero"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset to Zero</span>
            </button>

            <button
              id="btn-reset-sample-data"
              onClick={onResetData}
              className="inline-flex items-center justify-center px-2.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              title="Load Sample Data"
            >
              <span>Sample Data</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
