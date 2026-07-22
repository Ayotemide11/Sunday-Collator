import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertTriangle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '1234') {
      onConfirmReset();
      setPin('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Incorrect Admin PIN. (Default PIN: 1234)');
    }
  };

  return (
    <div id="admin-pin-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-black text-white">
                Admin Authentication Required
              </h3>
              <p className="text-xs text-slate-300">
                Confirm resetting all district figures on Firebase
              </p>
            </div>
          </div>
          <button
            id="btn-close-admin-pin-modal"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs rounded-xl flex items-start space-x-2.5 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-amber-950 dark:text-white">Warning: Collation Reset</p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                Resetting will set all 8 district attendance figures to 0 for the selected Sunday. Enter the Admin PIN to proceed.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xl font-bold">
              {errorMsg}
            </div>
          )}

          <div>
            <label id="lbl-admin-pin" htmlFor="input-admin-pin" className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Enter Admin PIN (Default: 1234)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-admin-pin"
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="1234"
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-base font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              id="btn-cancel-admin-pin"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-reset-figures"
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md cursor-pointer"
            >
              Verify PIN & Reset
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
