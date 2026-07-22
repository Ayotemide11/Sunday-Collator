import React from 'react';
import { DistrictSummary, DistrictName } from '../types';
import { Plus, CheckCircle, Clock, MapPin } from 'lucide-react';

interface DistrictCardsGridProps {
  summaries: DistrictSummary[];
  selectedDate: string;
  onLogForDistrict: (district: DistrictName) => void;
  selectedFilterDistrict: string | null;
  onSelectFilterDistrict: (district: DistrictName | null) => void;
}

export const DistrictCardsGrid: React.FC<DistrictCardsGridProps> = ({
  summaries,
  onLogForDistrict,
  selectedFilterDistrict,
  onSelectFilterDistrict,
}) => {
  return (
    <div id="district-cards-section" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between px-1 gap-2">
        <div>
          <h2 className="text-base font-bold text-blue-950 dark:text-white flex items-center">
            <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 mr-1.5" />
            AYAC Lagos District Breakdowns
          </h2>
          <p className="text-xs text-blue-800/70 dark:text-sky-300/70">
            Click any district to view or record attendance for Badagry, Epe, Igbogbo, Ijede, Irawo, Magbon-Alade, Morogbo & State Church Ikorodu
          </p>
        </div>

        {selectedFilterDistrict && (
          <button
            id="btn-clear-district-filter"
            onClick={() => onSelectFilterDistrict(null)}
            className="text-xs text-blue-950 dark:text-sky-100 font-bold bg-sky-100 dark:bg-blue-900 hover:bg-sky-200 dark:hover:bg-blue-800 border border-sky-300 dark:border-blue-700 px-3 py-1 rounded-md transition-colors cursor-pointer"
          >
            Show All Districts ({selectedFilterDistrict} active)
          </button>
        )}
      </div>

      {/* Grid of 8 Districts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {summaries.map((s) => {
          const isSelected = selectedFilterDistrict === s.district;
          const maleRatio = s.total > 0 ? Math.round((s.males / s.total) * 100) : 50;

          return (
            <div
              key={s.district}
              id={`district-card-${s.district.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className={`bg-white dark:bg-blue-950/80 rounded-xl border transition-all shadow-2xs hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500 ring-2 ring-sky-400/40 bg-sky-50/30 dark:bg-blue-900/40'
                  : s.hasReportedCurrentSunday
                  ? 'border-blue-100 dark:border-blue-900 hover:border-sky-300 dark:hover:border-sky-700'
                  : 'border-blue-200/80 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/40'
              }`}
            >
              {/* Card Top Header */}
              <div className="p-4 border-b border-blue-50 dark:border-blue-900/60">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-blue-950 dark:text-white text-sm tracking-tight">
                      {s.district}
                    </h3>
                    <span className="text-[11px] text-blue-600/70 dark:text-sky-300/70 font-medium">AYAC District</span>
                  </div>

                  {s.hasReportedCurrentSunday ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-blue-950 dark:bg-sky-500/20 dark:text-sky-200 border border-sky-300 dark:border-sky-500/30">
                      <CheckCircle className="w-3 h-3 mr-1 text-sky-600 dark:text-sky-400" />
                      Reported
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/70 text-blue-800 dark:bg-blue-900 dark:text-sky-300 border border-blue-200 dark:border-blue-800">
                      <Clock className="w-3 h-3 mr-1 text-blue-700 dark:text-sky-400" />
                      Pending
                    </span>
                  )}
                </div>

                {/* Counts Summary */}
                <div className="mt-3.5 grid grid-cols-3 gap-2 text-center bg-blue-50/60 dark:bg-blue-900/40 p-2.5 rounded-lg border border-blue-100/80 dark:border-blue-900">
                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-sky-600 dark:text-sky-400">Males</div>
                    <div className="text-sm font-black text-blue-950 dark:text-white mt-0.5">{s.males}</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-blue-800 dark:text-sky-300">Females</div>
                    <div className="text-sm font-black text-blue-950 dark:text-white mt-0.5">{s.females}</div>
                  </div>

                  <div className="border-l border-blue-200/80 dark:border-blue-800 pl-1">
                    <div className="text-[10px] uppercase font-extrabold text-blue-900 dark:text-sky-200">Total</div>
                    <div className="text-sm font-black text-sky-600 dark:text-sky-300 mt-0.5">{s.total}</div>
                  </div>
                </div>

                {/* Male/Female Distribution Mini Bar */}
                {s.total > 0 && (
                  <div className="mt-2.5">
                    <div className="w-full bg-blue-800 dark:bg-blue-700 h-1.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-sky-400 h-full transition-all"
                        style={{ width: `${maleRatio}%` }}
                        title={`${maleRatio}% Males`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Buttons */}
              <div className="px-4 py-2.5 bg-blue-50/40 dark:bg-blue-900/20 rounded-b-xl flex items-center justify-between text-xs">
                <button
                  id={`btn-filter-district-${s.district.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() =>
                    onSelectFilterDistrict(isSelected ? null : s.district)
                  }
                  className="font-semibold text-blue-800 dark:text-sky-300 hover:text-blue-950 dark:hover:text-white cursor-pointer"
                >
                  {isSelected ? 'Reset Filter' : 'Filter Table'}
                </button>

                <button
                  id={`btn-log-district-${s.district.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onLogForDistrict(s.district)}
                  className="inline-flex items-center font-black text-blue-950 bg-sky-400 hover:bg-sky-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-xs text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>{s.hasReportedCurrentSunday ? 'Update' : 'Log Count'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
