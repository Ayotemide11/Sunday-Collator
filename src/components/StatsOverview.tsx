import React from 'react';
import { CollatedStats } from '../types';
import { Users, User, UserCheck, CheckCircle2, Clock } from 'lucide-react';

interface StatsOverviewProps {
  stats: CollatedStats;
  selectedDate: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, selectedDate }) => {
  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const completionPercent = Math.round(
    (stats.reportingDistrictsCount / stats.totalDistrictsCount) * 100
  );

  return (
    <div id="stats-overview-section" className="space-y-3">
      {/* Date Header Badge */}
      <div className="flex flex-wrap items-center justify-between text-slate-900 dark:text-slate-200 text-xs sm:text-sm px-1 font-medium">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-slate-900 dark:text-slate-100">Summary for {formattedDate}</span>
          <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-extrabold border border-indigo-200 dark:border-indigo-800">
            Active Collation
          </span>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 sm:mt-0">
          {stats.reportingDistrictsCount} of {stats.totalDistrictsCount} Districts Submitted
        </div>
      </div>

      {/* Grid of Key Stat Cards - Multi-Colored Distinct Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Attendance - Emerald / Teal */}
        <div id="stat-card-total" className="bg-white dark:bg-slate-900 rounded-xl border-2 border-emerald-200 dark:border-emerald-800/60 p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Grand Total
            </span>
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.grandTotal.toLocaleString()}
            </span>
            <span className="ml-2 text-xs font-bold text-emerald-700/80 dark:text-emerald-400">participants</span>
          </div>
          <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 flex items-center font-semibold">
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 mr-1">Collated</span> across reporting districts
          </div>
        </div>

        {/* Male Attendance - Cyan */}
        <div id="stat-card-males" className="bg-white dark:bg-slate-900 rounded-xl border-2 border-cyan-200 dark:border-cyan-800/60 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
              Total Males (M)
            </span>
            <div className="p-2.5 bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 rounded-xl border border-cyan-200 dark:border-cyan-800">
              <User className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalMales.toLocaleString()}
            </span>
            <span className="text-xs font-extrabold text-cyan-800 dark:text-cyan-200 bg-cyan-100 dark:bg-cyan-900/60 px-2.5 py-0.5 rounded-md border border-cyan-300 dark:border-cyan-700">
              {stats.malePercentage}%
            </span>
          </div>
          <div className="mt-3 w-full bg-cyan-100/60 dark:bg-cyan-950/80 h-2.5 rounded-full overflow-hidden border border-cyan-200/50 dark:border-cyan-800/50">
            <div
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${stats.malePercentage}%` }}
            />
          </div>
        </div>

        {/* Female Attendance - Pink */}
        <div id="stat-card-females" className="bg-white dark:bg-slate-900 rounded-xl border-2 border-pink-200 dark:border-pink-800/60 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-pink-700 dark:text-pink-300">
              Total Females (F)
            </span>
            <div className="p-2.5 bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 rounded-xl border border-pink-200 dark:border-pink-800">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalFemales.toLocaleString()}
            </span>
            <span className="text-xs font-extrabold text-pink-800 dark:text-pink-200 bg-pink-100 dark:bg-pink-900/60 px-2.5 py-0.5 rounded-md border border-pink-300 dark:border-pink-700">
              {stats.femalePercentage}%
            </span>
          </div>
          <div className="mt-3 w-full bg-pink-100/60 dark:bg-pink-950/80 h-2.5 rounded-full overflow-hidden border border-pink-200/50 dark:border-pink-800/50">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${stats.femalePercentage}%` }}
            />
          </div>
        </div>

        {/* District Reporting Progress - Amber / Indigo */}
        <div id="stat-card-progress" className="bg-white dark:bg-slate-900 rounded-xl border-2 border-amber-200 dark:border-amber-800/60 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
              Districts Reported
            </span>
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-800">
              {completionPercent === 100 ? (
                <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.reportingDistrictsCount}
              <span className="text-lg font-bold text-slate-400 dark:text-slate-500">/{stats.totalDistrictsCount}</span>
            </span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
              {completionPercent}%
            </span>
          </div>
          <div className="mt-3 w-full bg-amber-100/60 dark:bg-amber-950/80 h-2.5 rounded-full overflow-hidden border border-amber-200/50 dark:border-amber-800/50">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
