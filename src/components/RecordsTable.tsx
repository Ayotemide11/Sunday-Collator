import React, { useState } from 'react';
import { AttendanceRecord, DistrictName } from '../types';
import { LAGOS_DISTRICTS } from '../constants';
import { Search, Filter, Edit3, Trash2, Calendar, FileSpreadsheet, ArrowUpDown } from 'lucide-react';

interface RecordsTableProps {
  records: AttendanceRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (id: string) => void;
  selectedFilterDistrict: string | null;
  onSelectFilterDistrict: (district: DistrictName | null) => void;
  selectedDate: string;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({
  records,
  onEdit,
  onDelete,
  selectedFilterDistrict,
  onSelectFilterDistrict,
  selectedDate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<string>(selectedDate);
  const [useDateFilter, setUseDateFilter] = useState<boolean>(true);
  const [sortField, setSortField] = useState<'date' | 'district' | 'total'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter logic
  const filteredRecords = records.filter((r) => {
    // District Filter
    if (selectedFilterDistrict && r.district !== selectedFilterDistrict) {
      return false;
    }
    // Date Filter
    if (useDateFilter && filterDate && r.date !== filterDate) {
      return false;
    }
    // Search Term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchDistrict = r.district.toLowerCase().includes(q);
      const matchReporter = (r.reportedBy || '').toLowerCase().includes(q);
      const matchRemarks = (r.remarks || '').toLowerCase().includes(q);
      const matchService = (r.serviceType || '').toLowerCase().includes(q);
      if (!matchDistrict && !matchReporter && !matchRemarks && !matchService) {
        return false;
      }
    }
    return true;
  });

  // Sort logic
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let comp = 0;
    if (sortField === 'date') {
      comp = a.date.localeCompare(b.date);
    } else if (sortField === 'district') {
      comp = a.district.localeCompare(b.district);
    } else if (sortField === 'total') {
      comp = a.total - b.total;
    }
    return sortDirection === 'asc' ? comp : -comp;
  });

  const toggleSort = (field: 'date' | 'district' | 'total') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Aggregates for current table view
  const sumMales = sortedRecords.reduce((acc, r) => acc + (Number(r.males) || 0), 0);
  const sumFemales = sortedRecords.reduce((acc, r) => acc + (Number(r.females) || 0), 0);
  const sumTotal = sumMales + sumFemales;

  return (
    <div id="records-table-container" className="bg-white dark:bg-blue-950/80 rounded-xl border border-blue-100 dark:border-blue-900 shadow-xs overflow-hidden transition-colors">
      
      {/* Table Header & Controls */}
      <div className="p-4 bg-blue-50/50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-900 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-bold text-blue-950 dark:text-white text-base">
              Collation Attendance Records
            </h3>
            <span className="text-xs bg-sky-100 dark:bg-blue-900 font-bold text-blue-900 dark:text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-blue-800">
              {sortedRecords.length} entries
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle All Dates vs Single Date */}
            <button
              id="btn-toggle-date-filter"
              onClick={() => setUseDateFilter(!useDateFilter)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
                useDateFilter
                  ? 'bg-blue-950 text-sky-300 border-blue-900 dark:bg-sky-400 dark:text-blue-950 dark:border-sky-400'
                  : 'bg-white text-blue-900 border-blue-200 hover:bg-blue-50 dark:bg-blue-900 dark:text-sky-200 dark:border-blue-800'
              }`}
            >
              {useDateFilter ? 'Filter: Active Date' : 'Showing All Dates'}
            </button>
          </div>
        </div>

        {/* Search & Select Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-blue-500/70 dark:text-sky-400 absolute left-3 top-2.5" />
            <input
              id="input-table-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search district, reporter..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-950 dark:text-sky-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* District Dropdown Filter */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-blue-500/70 dark:text-sky-400 flex-shrink-0" />
            <select
              id="select-table-district-filter"
              value={selectedFilterDistrict || ''}
              onChange={(e) =>
                onSelectFilterDistrict(
                  e.target.value ? (e.target.value as DistrictName) : null
                )
              }
              className="w-full bg-transparent text-xs font-semibold text-blue-950 dark:text-sky-100 focus:outline-none cursor-pointer"
            >
              <option value="" className="dark:bg-blue-950 text-blue-950 dark:text-sky-100">All Districts (8 Total)</option>
              {LAGOS_DISTRICTS.map((d) => (
                <option key={d} value={d} className="dark:bg-blue-950 text-blue-950 dark:text-sky-100">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Filter */}
          {useDateFilter && (
            <div className="flex items-center space-x-1.5 bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-2 py-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500/70 dark:text-sky-400 flex-shrink-0" />
              <input
                id="input-table-date-filter"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-transparent text-xs text-blue-950 dark:text-sky-100 focus:outline-none cursor-pointer font-medium"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table Data Render */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-blue-950 text-sky-100 dark:bg-blue-900/90 dark:text-sky-200 font-extrabold uppercase tracking-wider border-b border-blue-900">
              <th className="py-3 px-4">
                <button
                  id="btn-sort-district"
                  onClick={() => toggleSort('district')}
                  className="flex items-center space-x-1 hover:text-sky-300 cursor-pointer"
                >
                  <span>District</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-400" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  id="btn-sort-date"
                  onClick={() => toggleSort('date')}
                  className="flex items-center space-x-1 hover:text-sky-300 cursor-pointer"
                >
                  <span>Sunday Date</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-center text-sky-300">Males</th>
              <th className="py-3 px-4 text-center text-sky-100">Females</th>
              <th className="py-3 px-4 text-center">
                <button
                  id="btn-sort-total"
                  onClick={() => toggleSort('total')}
                  className="flex items-center justify-center space-x-1 hover:text-sky-300 mx-auto cursor-pointer"
                >
                  <span className="text-sky-400">Total</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-400" />
                </button>
              </th>
              <th className="py-3 px-4">Service Event</th>
              <th className="py-3 px-4">Reported By</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50 dark:divide-blue-900/50">
            {sortedRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-blue-800/60 dark:text-sky-300/60">
                  <p className="font-semibold text-sm">No collation records found.</p>
                  <p className="text-xs mt-1">
                    Try adjusting filters or click &quot;Log Attendance&quot; to add a new submission.
                  </p>
                </td>
              </tr>
            ) : (
              sortedRecords.map((r) => (
                <tr key={r.id} className="hover:bg-sky-50/50 dark:hover:bg-blue-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-950 dark:text-white">
                    {r.district}
                  </td>
                  <td className="py-3 px-4 text-blue-900 dark:text-sky-200 font-semibold whitespace-nowrap">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 text-center font-black text-sky-600 dark:text-sky-400">
                    {r.males}
                  </td>
                  <td className="py-3 px-4 text-center font-black text-blue-900 dark:text-sky-200">
                    {r.females}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md font-black bg-sky-100 dark:bg-sky-500/20 text-blue-950 dark:text-sky-200 border border-sky-300 dark:border-sky-500/30">
                      {r.total}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-blue-900/80 dark:text-sky-300">
                    {r.serviceType || 'Sunday Service'}
                  </td>
                  <td className="py-3 px-4 text-blue-800/70 dark:text-sky-300/70 font-medium">
                    {r.reportedBy || '—'}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    {deleteConfirmId === r.id ? (
                      <div className="inline-flex items-center space-x-1">
                        <button
                          id={`btn-confirm-delete-${r.id}`}
                          onClick={() => {
                            onDelete(r.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 text-[10px] font-black bg-blue-900 text-sky-200 rounded hover:bg-blue-800 cursor-pointer border border-sky-400"
                        >
                          Confirm Delete
                        </button>
                        <button
                          id={`btn-cancel-delete-${r.id}`}
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 text-[10px] font-semibold bg-blue-100 text-blue-950 rounded hover:bg-blue-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          id={`btn-edit-row-${r.id}`}
                          onClick={() => onEdit(r)}
                          className="p-1.5 text-blue-700 dark:text-sky-300 hover:text-sky-600 hover:bg-sky-100 dark:hover:bg-blue-800 rounded-md transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-row-${r.id}`}
                          onClick={() => setDeleteConfirmId(r.id)}
                          className="p-1.5 text-blue-500 dark:text-sky-400 hover:text-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Table Summary Footer Row */}
          {sortedRecords.length > 0 && (
            <tfoot>
              <tr className="bg-blue-950 text-white font-black border-t-2 border-blue-900 text-xs">
                <td className="py-3 px-4" colSpan={2}>
                  Filtered Collated Totals
                </td>
                <td className="py-3 px-4 text-center text-sky-300 font-black text-sm">
                  {sumMales.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center text-sky-100 font-black text-sm">
                  {sumFemales.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-3 py-1 bg-sky-400 text-blue-950 rounded font-black text-sm shadow-xs">
                    {sumTotal.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4" colSpan={3}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

    </div>
  );
};
