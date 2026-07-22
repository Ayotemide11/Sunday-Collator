import React from 'react';
import { DistrictSummary } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, PieChartIcon } from 'lucide-react';

interface AnalyticsChartsProps {
  summaries: DistrictSummary[];
  selectedDate: string;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ summaries, selectedDate }) => {
  // Format data for Recharts
  const chartData = summaries.map((s) => ({
    name: s.district,
    males: s.males,
    females: s.females,
    total: s.total,
  }));

  const totalMales = summaries.reduce((a, b) => a + b.males, 0);
  const totalFemales = summaries.reduce((a, b) => a + b.females, 0);

  const pieData = [
    { name: 'Males (M)', value: totalMales, color: '#06b6d4' }, // Cyan
    { name: 'Females (F)', value: totalFemales, color: '#ec4899' }, // Pink
  ];

  return (
    <div id="analytics-section" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            AYAC Collation Visual Analytics ({selectedDate})
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Attendance demographic breakdown across all 8 AYAC Lagos districts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* District Attendance Bar Chart */}
        <div id="chart-card-bar" className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
            Attendance per District (Males vs Females)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="males" name="Males (M)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="females" name="Females (F)" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Breakdown Pie Chart */}
        <div id="chart-card-pie" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1 flex items-center">
              <PieChartIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-1.5" />
              Gender Ratio
            </h3>
            <p className="text-[11px] text-slate-500">
              Total Males vs Total Females
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Summary Legend */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-cyan-50 dark:bg-cyan-950/60 p-2.5 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <div className="text-[10px] uppercase font-black text-cyan-800 dark:text-cyan-300">Males</div>
              <div className="text-base font-black text-cyan-950 dark:text-cyan-100 mt-0.5">{totalMales}</div>
            </div>
            <div className="bg-pink-50 dark:bg-pink-950/60 p-2.5 rounded-lg border border-pink-200 dark:border-pink-800">
              <div className="text-[10px] uppercase font-black text-pink-800 dark:text-pink-300">Females</div>
              <div className="text-base font-black text-pink-950 dark:text-pink-100 mt-0.5">{totalFemales}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
