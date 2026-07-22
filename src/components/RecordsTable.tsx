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
    <div id="records-table-container" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Table Header & Controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Collation Attendance Records
            </h3>
            <span className="text-xs bg-slate-200 font-semibold text-slate-700 px-2 py-0.5 rounded-full">
              {sortedRecords.length} entries
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle All Dates vs Single Date */}
            <button
              id="btn-toggle-date-filter"
              onClick={() => setUseDateFilter(!useDateFilter)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                useDateFilter
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
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
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-table-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search district, reporter..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* District Dropdown Filter */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-300 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <select
              id="select-table-district-filter"
              value={selectedFilterDistrict || ''}
              onChange={(e) =>
                onSelectFilterDistrict(
                  e.target.value ? (e.target.value as DistrictName) : null
                )
              }
              className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">All Districts (8 Total)</option>
              {LAGOS_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Filter */}
          {useDateFilter && (
            <div className="flex items-center space-x-1.5 bg-white border border-slate-300 rounded-lg px-2 py-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                id="input-table-date-filter"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table Data Render */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">
                <button
                  id="btn-sort-district"
                  onClick={() => toggleSort('district')}
                  className="flex items-center space-x-1 hover:text-slate-900 cursor-pointer"
                >
                  <span>District</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  id="btn-sort-date"
                  onClick={() => toggleSort('date')}
                  className="flex items-center space-x-1 hover:text-slate-900 cursor-pointer"
                >
                  <span>Sunday Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 text-center text-blue-700">Males</th>
              <th className="py-3 px-4 text-center text-rose-700">Females</th>
              <th className="py-3 px-4 text-center">
                <button
                  id="btn-sort-total"
                  onClick={() => toggleSort('total')}
                  className="flex items-center justify-center space-x-1 hover:text-slate-900 mx-auto cursor-pointer"
                >
                  <span className="text-amber-800">Total</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">Service Event</th>
              <th className="py-3 px-4">Reported By</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400">
                  <p className="font-medium">No collation records found.</p>
                  <p className="text-[11px] mt-1 text-slate-400">
                    Try adjusting filters or click &quot;Log Attendance&quot; to add a new submission.
                  </p>
                </td>
              </tr>
            ) : (
              sortedRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {r.district}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-blue-700">
                    {r.males}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-rose-700">
                    {r.females}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md font-black bg-amber-100 text-amber-900">
                      {r.total}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {r.serviceType || 'Sunday Service'}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
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
                          className="px-2 py-1 text-[10px] font-bold bg-rose-600 text-white rounded hover:bg-rose-700 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          id={`btn-cancel-delete-${r.id}`}
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 text-[10px] font-medium bg-slate-200 text-slate-700 rounded hover:bg-slate-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          id={`btn-edit-row-${r.id}`}
                          onClick={() => onEdit(r)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-row-${r.id}`}
                          onClick={() => setDeleteConfirmId(r.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
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
              <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-900 text-xs">
                <td className="py-3 px-4" colSpan={2}>
                  Filtered Collated Totals
                </td>
                <td className="py-3 px-4 text-center text-blue-300 font-extrabold text-sm">
                  {sumMales.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center text-rose-300 font-extrabold text-sm">
                  {sumFemales.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded font-black text-sm">
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
