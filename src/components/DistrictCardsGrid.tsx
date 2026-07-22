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
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center">
            <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-1.5" />
            AYAC Lagos District Breakdowns
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Click any district to view or record attendance for Badagry, Epe, Igbogbo, Ijede, Irawo, Magbon-Alade, Morogbo & State Church Ikorodu
          </p>
        </div>

        {selectedFilterDistrict && (
          <button
            id="btn-clear-district-filter"
            onClick={() => onSelectFilterDistrict(null)}
            className="text-xs text-slate-800 dark:text-slate-100 font-extrabold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-md transition-colors cursor-pointer"
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
              className={`bg-white dark:bg-slate-900 rounded-xl border transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-400/40 bg-indigo-50/30 dark:bg-indigo-950/40'
                  : s.hasReportedCurrentSunday
                  ? 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/40'
              }`}
            >
              {/* Card Top Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">
                      {s.district}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">AYAC District</span>
                  </div>

                  {s.hasReportedCurrentSunday ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                      Reported
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      <Clock className="w-3 h-3 mr-1 text-amber-600 dark:text-amber-400" />
                      Pending
                    </span>
                  )}
                </div>

                {/* Counts Summary - Distinct Male Cyan / Female Pink / Total Emerald */}
                <div className="mt-3.5 grid grid-cols-3 gap-2 text-center bg-slate-50/80 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  {/* Males - Cyan */}
                  <div className="bg-cyan-50/60 dark:bg-cyan-950/40 p-1.5 rounded-md border border-cyan-200/60 dark:border-cyan-800/60">
                    <div className="text-[10px] uppercase font-black text-cyan-700 dark:text-cyan-300">Males (M)</div>
                    <div className="text-sm font-black text-cyan-950 dark:text-cyan-100 mt-0.5">{s.males}</div>
                  </div>

                  {/* Females - Pink */}
                  <div className="bg-pink-50/60 dark:bg-pink-950/40 p-1.5 rounded-md border border-pink-200/60 dark:border-pink-800/60">
                    <div className="text-[10px] uppercase font-black text-pink-700 dark:text-pink-300">Females (F)</div>
                    <div className="text-sm font-black text-pink-950 dark:text-pink-100 mt-0.5">{s.females}</div>
                  </div>

                  {/* Total - Emerald */}
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-1.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                    <div className="text-[10px] uppercase font-black text-emerald-700 dark:text-emerald-300">Total</div>
                    <div className="text-sm font-black text-emerald-950 dark:text-emerald-100 mt-0.5">{s.total}</div>
                  </div>
                </div>

                {/* Male/Female Distribution Split Bar */}
                {s.total > 0 && (
                  <div className="mt-2.5">
                    <div className="w-full bg-pink-500 h-2 rounded-full overflow-hidden flex border border-slate-200/60 dark:border-slate-800">
                      <div
                        className="bg-cyan-500 h-full transition-all"
                        style={{ width: `${maleRatio}%` }}
                        title={`Males: ${s.males} (${maleRatio}%) | Females: ${s.females} (${100 - maleRatio}%)`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Buttons */}
              <div className="px-4 py-2.5 bg-slate-50/60 dark:bg-slate-800/30 rounded-b-xl flex items-center justify-between text-xs">
                <button
                  id={`btn-filter-district-${s.district.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() =>
                    onSelectFilterDistrict(isSelected ? null : s.district)
                  }
                  className="font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white cursor-pointer"
                >
                  {isSelected ? 'Reset Filter' : 'Filter Table'}
                </button>

                <button
                  id={`btn-log-district-${s.district.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onLogForDistrict(s.district)}
                  className="inline-flex items-center font-black text-white bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-xs text-xs"
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
