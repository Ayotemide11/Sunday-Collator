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
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              District Attendance Distribution
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Ranked by Total Participants</span>
        </div>

        <div className="space-y-3 pt-1">
          {sorted.map((s) => {
            const pct = Math.round((s.total / maxAttendance) * 100);
            return (
              <div key={s.district} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{s.district}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 text-[11px]">
                      (M: {s.males} | F: {s.females})
                    </span>
                    <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {s.total}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  {s.total > 0 ? (
                    <>
                      <div
                        className="bg-blue-600 h-full transition-all duration-500"
                        style={{
                          width: `${(s.males / maxAttendance) * 100}%`,
                        }}
                        title={`Males: ${s.males}`}
                      />
                      <div
                        className="bg-rose-500 h-full transition-all duration-500"
                        style={{
                          width: `${(s.females / maxAttendance) * 100}%`,
                        }}
                        title={`Females: ${s.females}`}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-slate-100 h-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gender Breakdown Chart Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Gender Distribution</h3>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center space-y-4">
            {/* Visual Circular Representation / Donut metric */}
            <div className="relative w-36 h-36 rounded-full bg-slate-100 flex items-center justify-center p-3 shadow-inner">
              <div
                className="absolute inset-0 rounded-full transition-all"
                style={{
                  background: grandTotal > 0
                    ? `conic-gradient(#2563eb 0% ${(totalMales / grandTotal) * 100}%, #f43f5e ${(totalMales / grandTotal) * 100}% 100%)`
                    : '#e2e8f0',
                }}
              />
              <div className="w-24 h-24 bg-white rounded-full z-10 flex flex-col items-center justify-center text-center shadow-xs">
                <span className="text-xl font-black text-slate-900">{grandTotal}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2 text-xs pt-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                  <span className="font-semibold text-slate-800">Males</span>
                </div>
                <span className="font-bold text-blue-700">
                  {totalMales} ({grandTotal > 0 ? Math.round((totalMales / grandTotal) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/60 border border-rose-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="font-semibold text-slate-800">Females</span>
                </div>
                <span className="font-bold text-rose-700">
                  {totalFemales} ({grandTotal > 0 ? Math.round((totalFemales / grandTotal) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
          Updated in real-time as districts submit
        </div>
      </div>

    </div>
  );
};
