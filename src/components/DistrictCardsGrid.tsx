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
      <div className="flex flex-wrap items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <MapPin className="w-4 h-4 text-amber-600 mr-1.5" />
            AYAC Lagos District Breakdowns
          </h2>
          <p className="text-xs text-slate-500">
            Click any district to view or record attendance for Badagry, Epe, Igbogbo, Ijede, Irawo, Magbon-Alade, Morogbo & State Church Ikorodu
          </p>
        </div>

        {selectedFilterDistrict && (
          <button
            id="btn-clear-district-filter"
            onClick={() => onSelectFilterDistrict(null)}
            className="text-xs text-amber-700 font-semibold bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
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
              className={`bg-white rounded-xl border transition-all shadow-2xs hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-400/30'
                  : s.hasReportedCurrentSunday
                  ? 'border-slate-200 hover:border-slate-300'
                  : 'border-amber-200/80 bg-amber-50/20'
              }`}
            >
              {/* Card Top Header */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                      {s.district}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">AYAC District</span>
                  </div>

                  {s.hasReportedCurrentSunday ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                      Reported
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <Clock className="w-3 h-3 mr-1 text-amber-600" />
                      Pending
                    </span>
                  )}
                </div>

                {/* Counts Summary */}
                <div className="mt-3.5 grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-blue-600">Males</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">{s.males}</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-rose-600">Females</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">{s.females}</div>
                  </div>

                  <div className="border-l border-slate-200 pl-1">
                    <div className="text-[10px] uppercase font-bold text-slate-700">Total</div>
                    <div className="text-sm font-black text-amber-600 mt-0.5">{s.total}</div>
                  </div>
                </div>

                {/* Male/Female Distribution Mini Bar */}
                {s.total > 0 && (
                  <div className="mt-2.5">
                    <div className="w-full bg-rose-200 h-1.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-500 h-full transition-all"
                        style={{ width: `${maleRatio}%` }}
                        title={`${maleRatio}% Males`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Buttons */}
              <div className="px-4 py-2.5 bg-slate-50/80 rounded-b-xl flex items-center justify-between text-xs">
                <button
                  id={`btn-filter-district-${s.district.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() =>
                    onSelectFilterDistrict(isSelected ? null : s.district)
                  }
                  className="font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {isSelected ? 'Reset Filter' : 'Filter Table'}
                </button>

                <button
                  id={`btn-log-district-${s.district.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onLogForDistrict(s.district)}
                  className="inline-flex items-center font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
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
