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
      <div className="lg:col-span-2 bg-white dark:bg-blue-950/80 rounded-xl border border-blue-100 dark:border-blue-900 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-extrabold text-blue-950 dark:text-white text-sm">
              District Attendance Distribution
            </h3>
          </div>
          <span className="text-xs text-blue-800/70 dark:text-sky-300/70 font-semibold">Ranked by Total Participants</span>
        </div>

        <div className="space-y-3.5 pt-1">
          {sorted.map((s) => {
            return (
              <div key={s.district} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-blue-950 dark:text-white">{s.district}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-800/70 dark:text-sky-300/70 text-[11px] font-semibold">
                      (M: {s.males} | F: {s.females})
                    </span>
                    <span className="font-black text-blue-950 dark:text-sky-100 bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-500/30 px-2 py-0.5 rounded">
                      {s.total}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-blue-100 dark:bg-blue-900/60 h-2.5 rounded-full overflow-hidden flex">
                  {s.total > 0 ? (
                    <>
                      <div
                        className="bg-sky-400 h-full transition-all duration-500"
                        style={{
                          width: `${(s.males / maxAttendance) * 100}%`,
                        }}
                        title={`Males: ${s.males}`}
                      />
                      <div
                        className="bg-blue-800 dark:bg-blue-600 h-full transition-all duration-500"
                        style={{
                          width: `${(s.females / maxAttendance) * 100}%`,
                        }}
                        title={`Females: ${s.females}`}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-blue-50 dark:bg-blue-900/40 h-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gender Breakdown Chart Card */}
      <div className="bg-white dark:bg-blue-950/80 rounded-xl border border-blue-100 dark:border-blue-900 p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 border-b border-blue-100 dark:border-blue-900 pb-3">
            <PieChart className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-extrabold text-blue-950 dark:text-white text-sm">Gender Distribution</h3>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center space-y-4">
            {/* Visual Circular Representation / Donut metric */}
            <div className="relative w-36 h-36 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center p-3 shadow-inner">
              <div
                className="absolute inset-0 rounded-full transition-all"
                style={{
                  background: grandTotal > 0
                    ? `conic-gradient(#38bdf8 0% ${(totalMales / grandTotal) * 100}%, #1e3a8a ${(totalMales / grandTotal) * 100}% 100%)`
                    : '#cbd5e1',
                }}
              />
              <div className="w-24 h-24 bg-white dark:bg-blue-950 rounded-full z-10 flex flex-col items-center justify-center text-center shadow-xs border border-blue-100 dark:border-blue-800">
                <span className="text-xl font-black text-blue-950 dark:text-white">{grandTotal}</span>
                <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-300">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2 text-xs pt-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-50 dark:bg-blue-900/50 border border-sky-200 dark:border-sky-500/30">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
                  <span className="font-bold text-blue-950 dark:text-sky-100">Males</span>
                </div>
                <span className="font-extrabold text-sky-600 dark:text-sky-300">
                  {totalMales} ({grandTotal > 0 ? Math.round((totalMales / grandTotal) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-blue-800 dark:bg-blue-600 inline-block" />
                  <span className="font-bold text-blue-950 dark:text-sky-100">Females</span>
                </div>
                <span className="font-extrabold text-blue-900 dark:text-sky-200">
                  {totalFemales} ({grandTotal > 0 ? Math.round((totalFemales / grandTotal) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-blue-800/60 dark:text-sky-300/60 font-medium text-center pt-2 border-t border-blue-100 dark:border-blue-900">
          Updated in real-time as districts submit
        </div>
      </div>

    </div>
  );
};
