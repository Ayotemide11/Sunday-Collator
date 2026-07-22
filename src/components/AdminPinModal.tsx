import React, { useState } from 'react';
import { X, Lock, ShieldAlert, KeyRound } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

const ADMIN_PIN = '091993';

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      onConfirmReset();
      setPinInput('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Invalid Admin PIN. Access denied.');
      setPinInput('');
    }
  };

  const handleClose = () => {
    setPinInput('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      id="admin-pin-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-rose-950 text-white px-6 py-4 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-base font-bold">Admin Verification Required</h3>
              <p className="text-xs text-rose-300">Restricted Action: Reset All Figures to Zero</p>
            </div>
          </div>
          <button
            id="btn-close-admin-pin-modal"
            onClick={handleClose}
            className="text-rose-300 hover:text-white p-1 rounded-lg hover:bg-rose-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-rose-900">
            <Lock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Warning: Deleting Collation Data</p>
              <p className="text-rose-700">
                This action will wipe all participant records and reset figures across all 8 AYAC Lagos districts to zero. Enter the Admin PIN to proceed.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold rounded-lg text-center animate-shake">
              {errorMsg}
            </div>
          )}

          <div>
            <label
              id="lbl-admin-pin"
              htmlFor="input-admin-pin"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center"
            >
              <KeyRound className="w-4 h-4 mr-1 text-slate-500" /> Enter 6-Digit Admin PIN
            </label>
            <input
              id="input-admin-pin"
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="••••••"
              autoFocus
              className="w-full bg-slate-50 border border-slate-300 text-center tracking-[0.5em] text-2xl font-mono font-bold text-slate-900 rounded-xl py-3 px-4 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
            <button
              id="btn-cancel-admin-pin"
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-admin-pin"
              type="submit"
              className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
            >
              <Lock className="w-4 h-4 mr-1.5" />
              <span>Verify & Reset Figures</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
