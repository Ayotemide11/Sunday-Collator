import React, { useState, useEffect } from 'react';
import { AttendanceRecord, DistrictName } from '../types';
import { LAGOS_DISTRICTS, SERVICE_TYPES } from '../constants';
import { X, Check, Calculator, AlertCircle } from 'lucide-react';

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  editingRecord?: AttendanceRecord | null;
  defaultDistrict?: DistrictName | null;
  defaultDate: string;
}

export const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRecord,
  defaultDistrict,
  defaultDate,
}) => {
  const [district, setDistrict] = useState<DistrictName>('State Church Ikorodu');
  const [males, setMales] = useState<string>('0');
  const [females, setFemales] = useState<string>('0');
  const [date, setDate] = useState<string>(defaultDate);
  const [serviceType, setServiceType] = useState<string>('AYAC 2026');
  const [reportedBy, setReportedBy] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (editingRecord) {
      setDistrict(editingRecord.district);
      setMales(String(editingRecord.males));
      setFemales(String(editingRecord.females));
      setDate(editingRecord.date);
      setServiceType(editingRecord.serviceType || 'AYAC 2026');
      setReportedBy(editingRecord.reportedBy || '');
      setRemarks(editingRecord.remarks || '');
    } else {
      setDistrict(defaultDistrict || LAGOS_DISTRICTS[0]);
      setMales('0');
      setFemales('0');
      setDate(defaultDate);
      setServiceType('AYAC 2026');
      setReportedBy('');
      setRemarks('');
    }
    setErrorMsg('');
  }, [editingRecord, defaultDistrict, defaultDate, isOpen]);

  if (!isOpen) return null;

  const maleNum = Math.max(0, parseInt(males, 10) || 0);
  const femaleNum = Math.max(0, parseInt(females, 10) || 0);
  const computedTotal = maleNum + femaleNum;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!district) {
      setErrorMsg('Please select a valid district.');
      return;
    }
    if (maleNum === 0 && femaleNum === 0) {
      setErrorMsg('Attendance cannot be zero for both male and female.');
      return;
    }

    onSave(
      {
        district,
        males: maleNum,
        females: femaleNum,
        total: computedTotal,
        date,
        serviceType,
        reportedBy: reportedBy.trim(),
        remarks: remarks.trim(),
      },
      editingRecord?.id
    );

    onClose();
  };

  return (
    <div id="attendance-form-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8 animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold">
              {editingRecord ? 'Edit Attendance Record' : 'Collate Sunday Attendance'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter participant counts for AYAC Lagos district
            </p>
          </div>
          <button
            id="btn-close-form-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* District Selector - Dropdown */}
          <div>
            <label id="lbl-district" htmlFor="select-district" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              District <span className="text-rose-500">*</span>
            </label>
            <select
              id="select-district"
              value={district}
              onChange={(e) => setDistrict(e.target.value as DistrictName)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none cursor-pointer"
            >
              {LAGOS_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Service Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label id="lbl-service-date" htmlFor="input-service-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Sunday Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-service-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label id="lbl-service-type" htmlFor="select-service-type" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Service Event
              </label>
              <select
                id="select-service-type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none cursor-pointer"
              >
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendance Counts Inputs */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase text-slate-700 flex items-center">
                <Calculator className="w-4 h-4 mr-1 text-amber-600" /> Attendance Collations
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Dynamic Total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label id="lbl-males-count" htmlFor="input-males-count" className="block text-xs font-semibold text-blue-700 mb-1">
                  Number of Males <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-males-count"
                  type="number"
                  min="0"
                  value={males}
                  onChange={(e) => setMales(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label id="lbl-females-count" htmlFor="input-females-count" className="block text-xs font-semibold text-rose-700 mb-1">
                  Number of Females <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-females-count"
                  type="number"
                  min="0"
                  value={females}
                  onChange={(e) => setFemales(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Calculated Total Visual Banner */}
            <div className="bg-slate-900 text-white rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Calculated Grand Total</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {maleNum} Males + {femaleNum} Females
                </div>
              </div>
              <div className="text-2xl font-black text-amber-400">
                {computedTotal}
              </div>
            </div>
          </div>

          {/* Optional Meta fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label id="lbl-reported-by" htmlFor="input-reported-by" className="block text-xs font-medium text-slate-600 mb-1">
                Reported By (Optional)
              </label>
              <input
                id="input-reported-by"
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="e.g. Bro. David (Youth Rep)"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-400 outline-none"
              />
            </div>

            <div>
              <label id="lbl-remarks" htmlFor="input-remarks" className="block text-xs font-medium text-slate-600 mb-1">
                Remarks / Notes (Optional)
              </label>
              <input
                id="input-remarks"
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. High turnout from choir"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-400 outline-none"
              />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
            <button
              id="btn-cancel-form"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-attendance"
              type="submit"
              className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4 mr-1.5" />
              <span>{editingRecord ? 'Update Record' : 'Save Attendance'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
