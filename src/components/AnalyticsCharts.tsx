import React from 'react';
import { DistrictSummary } from '../types';
import { BarChart3, PieChart } from 'lucide-react';

interface AnalyticsChartsProps {
  summaries: DistrictSummary[];
  selectedDate: string;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ summaries }) => {
  const maxAttendance = Math.max(...summaries.map((s) => s.total), 1);

  // Sort summaries descending by total attendance
  const sorted = [...summaries].sort((a, b) => b.total - a.total);

  const grandTotal = summaries.reduce((acc, s) => acc + s.total, 0);
  const totalMales = summaries.reduce((acc, s) => acc + s.males, 0);
  const totalFemales = summaries.reduce((acc, s) => acc + s.females, 0);

  return (
    <div id="analytics-section" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      {/* Bar Chart: District Total Rankings */}
      <div className="lg:col-span-2 bg-white dark:bg-blue-950/80 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-blue-900 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              District Attendance Distribution
            </h3>
          </div>
          <span className="text-xs text-slate-600 dark:text-sky-300/80 font-bold">Ranked by Total Participants</span>
        </div>

        <div className="space-y-3.5 pt-1">
          {sorted.map((s) => {
            return (
              <div key={s.district} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900 dark:text-white">{s.district}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-700 dark:text-cyan-300 text-[11px] font-extrabold">
                      M: {s.males}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-pink-700 dark:text-pink-300 text-[11px] font-extrabold">
                      F: {s.females}
                    </span>
                    <span className="font-black text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded">
                      Total: {s.total}
                    </span>
                  </div>
                </div>

                {/* Stacked Cyan (Males) + Pink (Females) Bar */}
                <div className="w-full bg-slate-100 dark:bg-blue-900/60 h-3 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-800">
                  {s.total > 0 ? (
                    <>
                      <div
                        className="bg-cyan-500 h-full transition-all duration-500"
                        style={{
                          width: `${(s.males / maxAttendance) * 100}%`,
                        }}
                        title={`Males: ${s.males}`}
                      />
                      <div
                        className="bg-pink-500 h-full transition-all duration-500"
                        style={{
                          width: `${(s.females / maxAttendance) * 100}%`,
                        }}
                        title={`Females: ${s.females}`}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-slate-100 dark:bg-blue-900/40 h-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gender Breakdown Chart Card - Cyan vs Pink Donut */}
      <div className="bg-white dark:bg-blue-950/80 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-blue-900 pb-3">
            <PieChart className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Gender Distribution</h3>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center space-y-4">
            {/* Visual Conic Donut Chart (Cyan for Male, Pink for Female) */}
            <div className="relative w-36 h-36 rounded-full bg-slate-100 dark:bg-blue-900 flex items-center justify-center p-3 shadow-inner">
              <div
                className="absolute inset-0 rounded-full transition-all"
                style={{
                  background: grandTotal > 0
                    ? `conic-gradient(#06b6d4 0% ${(totalMales / grandTotal) * 100}%, #ec4899 ${(totalMales / grandTotal) * 100}% 100%)`
                    : '#cbd5e1',
                }}
              />
              <div className="w-24 h-24 bg-white dark:bg-blue-950 rounded-full z-10 flex flex-col items-center justify-center text-center shadow-xs border-2 border-indigo-100 dark:border-blue-800">
                <span className="text-xl font-black text-slate-900 dark:text-white">{grandTotal}</span>
                <span className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2 text-xs pt-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block shadow-xs" />
                  <span className="font-extrabold text-cyan-950 dark:text-cyan-100">Males</span>
                </div>
                <span className="font-black text-cyan-800 dark:text-cyan-300">
                  {totalMales} ({grandTotal > 0 ? Math.round((totalMales / grandTotal) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-pink-500 inline-block shadow-xs" />
                  <span className="font-extrabold text-pink-950 dark:text-pink-100">Females</span>
                </div>
                <span className="font-black text-pink-800 dark:text-pink-300">
                  {totalFemales} ({grandTotal > 0 ? Math.round((totalFemales / grandTotal) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-sky-300/60 font-semibold text-center pt-2 border-t border-slate-200 dark:border-blue-900">
          Updated in real-time on Firebase Firestore
        </div>
      </div>

    </div>
  );
};
