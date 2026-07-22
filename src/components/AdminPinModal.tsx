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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-blue-950 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-black text-white">Admin Verification Required</h3>
              <p className="text-xs text-sky-300">Restricted Action: Reset All Figures to Zero</p>
            </div>
          </div>
          <button
            id="btn-close-admin-pin-modal"
            onClick={handleClose}
            className="text-sky-300 hover:text-white p-1 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-blue-900/30 border border-sky-400/30 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-blue-950 dark:text-sky-200 font-medium">
            <Lock className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold mb-0.5 text-blue-950 dark:text-white">Warning: Resetting Collation Figures</p>
              <p className="text-blue-900/80 dark:text-sky-300">
                This action will wipe all participant records and reset figures across all 8 AYAC Lagos districts to zero. Enter the Admin PIN to proceed.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-blue-900 border border-sky-400 text-sky-200 text-xs font-bold rounded-lg text-center animate-shake">
              {errorMsg}
            </div>
          )}

          <div>
            <label
              id="lbl-admin-pin"
              htmlFor="input-admin-pin"
              className="block text-xs font-extrabold text-blue-950 dark:text-sky-200 uppercase tracking-wider mb-2 flex items-center"
            >
              <KeyRound className="w-4 h-4 mr-1 text-sky-500" /> Enter 6-Digit Admin PIN
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
              className="w-full bg-blue-50/50 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-center tracking-[0.5em] text-2xl font-mono font-black text-blue-950 dark:text-sky-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-blue-100 dark:border-blue-900">
            <button
              id="btn-cancel-admin-pin"
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-bold text-blue-900 dark:text-sky-300 hover:text-blue-950 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-admin-pin"
              type="submit"
              className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-black text-blue-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-sm cursor-pointer"
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
