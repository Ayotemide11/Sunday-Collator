import React, { useState, useEffect } from 'react';
import { AttendanceRecord, DistrictName } from '../types';
import { LAGOS_DISTRICTS, SERVICE_TYPES } from '../constants';
import { X, Check, Calculator, AlertCircle, User, UserCheck, Shield } from 'lucide-react';

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
  const [stationName, setStationName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (editingRecord) {
      setDistrict(editingRecord.district);
      setMales(String(editingRecord.males));
      setFemales(String(editingRecord.females));
      setDate(editingRecord.date);
      setServiceType(editingRecord.serviceType || 'AYAC 2026');
      setReportedBy(editingRecord.reportedBy || '');
      setStationName(editingRecord.stationName || editingRecord.remarks || '');
    } else {
      setDistrict(defaultDistrict || LAGOS_DISTRICTS[0]);
      setMales('0');
      setFemales('0');
      setDate(defaultDate);
      setServiceType('AYAC 2026');
      setReportedBy('');
      setStationName('');
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
    if (!reportedBy.trim()) {
      setErrorMsg('Reported By is required. Please enter who reported this entry.');
      return;
    }
    if (!stationName.trim()) {
      setErrorMsg('Name of Station is required. Please enter the station name.');
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
        stationName: stationName.trim(),
        remarks: stationName.trim(),
      },
      editingRecord?.id
    );

    onClose();
  };

  return (
    <div id="attendance-form-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden my-8 animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-indigo-400" />
              {editingRecord ? 'Edit Attendance Record' : 'Collate Attendance Record'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Enter participant counts for AYAC Lagos district
            </p>
          </div>
          <button
            id="btn-close-form-modal"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-lg flex items-center space-x-2 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* District Selector - Dropdown */}
          <div>
            <label id="lbl-district" htmlFor="select-district" className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
              District <span className="text-indigo-500">*</span>
            </label>
            <select
              id="select-district"
              value={district}
              onChange={(e) => setDistrict(e.target.value as DistrictName)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
            >
              {LAGOS_DISTRICTS.map((dist) => (
                <option key={dist} value={dist} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Service Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label id="lbl-service-date" htmlFor="input-service-date" className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Attendance Date <span className="text-indigo-500">*</span>
              </label>
              <input
                id="input-service-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-bold"
                required
              />
            </div>

            <div>
              <label id="lbl-service-type" htmlFor="select-service-type" className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Service Event
              </label>
              <select
                id="select-service-type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer font-bold"
              >
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendance Counts Inputs with Distinct Male / Female Colors */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-2 border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center">
                <Calculator className="w-4 h-4 mr-1.5 text-indigo-600 dark:text-indigo-400" /> Attendance Collations
              </span>
              <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                Live Total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Male Input Block (Cyan) */}
              <div className="p-3 bg-cyan-50/80 dark:bg-cyan-950/60 rounded-xl border-2 border-cyan-300 dark:border-cyan-800">
                <label id="lbl-males-count" htmlFor="input-males-count" className="block text-xs font-black text-cyan-800 dark:text-cyan-300 mb-1.5 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                  Males (M) <span className="text-indigo-500 ml-0.5">*</span>
                </label>
                <input
                  id="input-males-count"
                  type="number"
                  min="0"
                  value={males}
                  onChange={(e) => setMales(e.target.value)}
                  className="w-full bg-white dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-700 rounded-lg px-3 py-2 text-xl font-black text-cyan-950 dark:text-cyan-100 focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="0"
                  required
                />
              </div>

              {/* Female Input Block (Pink) */}
              <div className="p-3 bg-pink-50/80 dark:bg-pink-950/60 rounded-xl border-2 border-pink-300 dark:border-pink-800">
                <label id="lbl-females-count" htmlFor="input-females-count" className="block text-xs font-black text-pink-800 dark:text-pink-300 mb-1.5 flex items-center">
                  <UserCheck className="w-3.5 h-3.5 mr-1 text-pink-600" />
                  Females (F) <span className="text-indigo-500 ml-0.5">*</span>
                </label>
                <input
                  id="input-females-count"
                  type="number"
                  min="0"
                  value={females}
                  onChange={(e) => setFemales(e.target.value)}
                  className="w-full bg-white dark:bg-pink-950 border border-pink-300 dark:border-pink-700 rounded-lg px-3 py-2 text-xl font-black text-pink-950 dark:text-pink-100 focus:ring-2 focus:ring-pink-500 outline-none"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Calculated Total Visual Banner - Emerald */}
            <div className="bg-emerald-900 text-white rounded-xl p-3 px-4 flex items-center justify-between border-2 border-emerald-700 shadow-xs">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-black">Calculated Grand Total</div>
                <div className="text-xs text-emerald-200 mt-0.5 font-bold">
                  {maleNum} Males + {femaleNum} Females
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-300 tracking-tight">
                {computedTotal}
              </div>
            </div>
          </div>

          {/* Mandatory Meta fields: Reported By & Name of Station */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label id="lbl-reported-by" htmlFor="input-reported-by" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider">
                Reported By <span className="text-indigo-500">*</span>
              </label>
              <input
                id="input-reported-by"
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="e.g. Bro. David (Youth Rep)"
                className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                required
              />
            </div>

            <div>
              <label id="lbl-station-name" htmlFor="input-station-name" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider">
                Name of Station <span className="text-indigo-500">*</span>
              </label>
              <input
                id="input-station-name"
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="e.g. Central Cathedral / Station 1"
                className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                required
              />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              id="btn-cancel-form"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-attendance"
              type="submit"
              className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md cursor-pointer"
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
