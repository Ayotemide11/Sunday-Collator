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
      <div className="flex flex-wrap items-center justify-between text-blue-900 dark:text-sky-200 text-xs sm:text-sm px-1 font-medium">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-blue-950 dark:text-sky-100">Summary for {formattedDate}</span>
          <span className="bg-sky-100 dark:bg-blue-900/80 text-blue-900 dark:text-sky-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-sky-200 dark:border-blue-800">
            Active Collation
          </span>
        </div>
        <div className="text-xs text-blue-700/80 dark:text-sky-300/80 font-semibold mt-1 sm:mt-0">
          {stats.reportingDistrictsCount} of {stats.totalDistrictsCount} Districts Submitted
        </div>
      </div>

      {/* Grid of Key Stat Cards - Two-Toned Blue Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Attendance */}
        <div id="stat-card-total" className="bg-white dark:bg-blue-950/80 rounded-xl border border-blue-100 dark:border-blue-900 p-5 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Grand Total
            </span>
            <div className="p-2 bg-sky-100 dark:bg-blue-900 text-blue-900 dark:text-sky-300 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-3xl font-black text-blue-950 dark:text-white tracking-tight">
              {stats.grandTotal.toLocaleString()}
            </span>
            <span className="ml-2 text-xs font-semibold text-blue-600/70 dark:text-sky-300/70">participants</span>
          </div>
          <div className="mt-3 text-xs text-blue-800/80 dark:text-sky-300/80 flex items-center font-medium">
            <span className="font-bold text-sky-600 dark:text-sky-300 mr-1">Collated</span> across reporting districts
          </div>
        </div>

        {/* Male Attendance */}
        <div id="stat-card-males" className="bg-white dark:bg-blue-950/80 rounded-xl border border-blue-100 dark:border-blue-900 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Total Males
            </span>
            <div className="p-2 bg-sky-50 dark:bg-blue-900 text-sky-600 dark:text-sky-300 rounded-lg">
              <User className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-blue-950 dark:text-white tracking-tight">
              {stats.totalMales.toLocaleString()}
            </span>
            <span className="text-xs font-extrabold text-blue-900 dark:text-sky-200 bg-sky-100 dark:bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-500/30">
              {stats.malePercentage}%
            </span>
          </div>
          <div className="mt-3 w-full bg-blue-50 dark:bg-blue-900/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 dark:bg-sky-400 h-full transition-all duration-500"
              style={{ width: `${stats.malePercentage}%` }}
            />
          </div>
        </div>

        {/* Female Attendance */}
        <div id="stat-card-females" className="bg-white dark:bg-blue-950/80 rounded-xl border border-blue-100 dark:border-blue-900 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 dark:text-sky-300">
              Total Females
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-sky-300 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-blue-950 dark:text-white tracking-tight">
              {stats.totalFemales.toLocaleString()}
            </span>
            <span className="text-xs font-extrabold text-blue-950 dark:text-sky-200 bg-blue-100 dark:bg-blue-800/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-700">
              {stats.femalePercentage}%
            </span>
          </div>
          <div className="mt-3 w-full bg-blue-50 dark:bg-blue-900/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-800 dark:bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${stats.femalePercentage}%` }}
            />
          </div>
        </div>

        {/* District Reporting Progress */}
        <div id="stat-card-progress" className="bg-white dark:bg-blue-950/80 rounded-xl border border-blue-100 dark:border-blue-900 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 dark:text-sky-300">
              Districts Reported
            </span>
            <div className="p-2 bg-sky-50 dark:bg-blue-900 text-sky-600 dark:text-sky-300 rounded-lg">
              {completionPercent === 100 ? (
                <CheckCircle2 className="w-5 h-5 text-sky-500" />
              ) : (
                <Clock className="w-5 h-5 text-blue-700 dark:text-sky-400" />
              )}
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-blue-950 dark:text-white tracking-tight">
              {stats.reportingDistrictsCount}
              <span className="text-lg font-normal text-blue-400/80 dark:text-sky-400/60">/{stats.totalDistrictsCount}</span>
            </span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-500/20 text-blue-900 dark:text-sky-200 border border-sky-200 dark:border-sky-500/30">
              {completionPercent}%
            </span>
          </div>
          <div className="mt-3 w-full bg-blue-50 dark:bg-blue-900/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 dark:bg-sky-400 h-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
