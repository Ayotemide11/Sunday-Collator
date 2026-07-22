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
    <div id="stats-overview-section" className="space-y-4">
      {/* Date Header Badge */}
      <div className="flex flex-wrap items-center justify-between text-slate-600 text-sm px-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-900">Summary for {formattedDate}</span>
          <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-medium">
            Active Collation
          </span>
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1 sm:mt-0">
          {stats.reportingDistrictsCount} of {stats.totalDistrictsCount} Districts Submitted
        </div>
      </div>

      {/* Grid of Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Attendance */}
        <div id="stat-card-total" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Grand Total
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.grandTotal.toLocaleString()}
            </span>
            <span className="ml-2 text-xs font-medium text-slate-500">participants</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center">
            <span className="font-medium text-indigo-700 mr-1">Collated</span> across reporting districts
          </div>
        </div>

        {/* Male Attendance */}
        <div id="stat-card-males" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Total Males
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalMales.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              {stats.malePercentage}%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${stats.malePercentage}%` }}
            />
          </div>
        </div>

        {/* Female Attendance */}
        <div id="stat-card-females" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              Total Females
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalFemales.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
              {stats.femalePercentage}%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${stats.femalePercentage}%` }}
            />
          </div>
        </div>

        {/* District Reporting Progress */}
        <div id="stat-card-progress" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Districts Reported
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              {completionPercent === 100 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600" />
              )}
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.reportingDistrictsCount}
              <span className="text-lg font-normal text-slate-400">/{stats.totalDistrictsCount}</span>
            </span>
            <span
              className={`text-sm font-semibold px-2 py-0.5 rounded-md ${
                completionPercent === 100
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {completionPercent}%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                completionPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
