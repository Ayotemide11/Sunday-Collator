import React from 'react';
import { PlusCircle, Share2, Download, RotateCcw, Calendar, Church, Sun, Moon, Radio } from 'lucide-react';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onOpenForm: () => void;
  onOpenWhatsApp: () => void;
  onExportCSV: () => void;
  onResetToZero: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isLiveConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onDateChange,
  onOpenForm,
  onOpenWhatsApp,
  onExportCSV,
  onResetToZero,
  theme,
  onToggleTheme,
  isLiveConnected = true,
}) => {
  return (
    <header id="main-header" className="bg-blue-950 text-white border-b border-blue-900 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-800 via-blue-600 to-sky-400 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-blue-950 rounded-[10px] flex items-center justify-center">
                <Church className="w-6 h-6 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wider">
                  AYAC LAGOS
                </span>
                <span className="text-blue-300/80 text-xs hidden sm:inline font-medium">
                  Annual Youth Alive Convention, Living Faith Church Lagos
                </span>
                {/* Real-time Indicator Pill */}
                <span
                  id="header-live-indicator"
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold border transition-colors ${
                    isLiveConnected
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                      : 'bg-blue-900/60 text-blue-300 border-blue-800'
                  }`}
                  title={
                    isLiveConnected
                      ? 'Connected to live collation server. Changes by any user update instantly.'
                      : 'Connecting to live collation server...'
                  }
                >
                  <Radio className={`w-3 h-3 mr-1 ${isLiveConnected ? 'text-sky-400 animate-pulse' : 'text-blue-400'}`} />
                  <span>{isLiveConnected ? 'Real-Time Sync' : 'Connecting...'}</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                Sunday Collator
              </h1>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            
            {/* Appearance Toggle (Light / Dark) */}
            <button
              id="btn-theme-toggle"
              onClick={onToggleTheme}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold text-sky-200 bg-blue-900/90 hover:bg-blue-800 border border-sky-500/40 transition-colors cursor-pointer shadow-xs"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 mr-1.5 text-sky-300" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-1.5 text-sky-300" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Date Selector */}
            <div className="flex items-center bg-blue-900/80 border border-blue-800 rounded-lg px-3 py-1.5 text-sm text-sky-100">
              <Calendar className="w-4 h-4 text-sky-400 mr-2 flex-shrink-0" />
              <input
                id="header-date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-semibold text-xs sm:text-sm"
              />
            </div>

            {/* Primary Action Button */}
            <button
              id="btn-add-entry-header"
              onClick={onOpenForm}
              className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-black text-blue-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Log Attendance</span>
            </button>

            {/* Secondary Action Buttons */}
            <button
              id="btn-whatsapp-export"
              onClick={onOpenWhatsApp}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold text-sky-200 bg-blue-900/90 border border-blue-700 hover:bg-blue-800 transition-colors cursor-pointer"
              title="Generate WhatsApp summary text"
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              id="btn-export-csv"
              onClick={onExportCSV}
              className="inline-flex items-center justify-center px-2.5 py-2 rounded-lg text-sm font-medium text-sky-200 bg-blue-900/60 hover:bg-blue-800 border border-blue-800 transition-colors cursor-pointer"
              title="Download CSV report"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Admin Reset to Zero */}
            <button
              id="btn-reset-to-zero"
              onClick={onResetToZero}
              className="inline-flex items-center justify-center px-2.5 py-2 rounded-lg text-xs font-semibold text-sky-200 bg-blue-950 hover:bg-blue-900 border border-sky-800 transition-colors cursor-pointer"
              title="Reset all figures to zero (Admin PIN Required)"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-sky-400" />
              <span>Reset to Zero</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
