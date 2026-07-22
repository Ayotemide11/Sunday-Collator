import React, { useState } from 'react';
import { AttendanceRecord } from '../types';
import { generateWhatsAppReport, calculateCollatedStats } from '../utils/storage';
import { X, Copy, Check, Share2, MessageSquare } from 'lucide-react';

interface WhatsAppExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: AttendanceRecord[];
  selectedDate: string;
}

export const WhatsAppExportModal: React.FC<WhatsAppExportModalProps> = ({
  isOpen,
  onClose,
  records,
  selectedDate,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const stats = calculateCollatedStats(records, selectedDate);
  const textReport = generateWhatsAppReport(records, selectedDate);

  const handleCopy = () => {
    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsAppNative = () => {
    const encoded = encodeURIComponent(textReport);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div id="whatsapp-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-black text-white">
                WhatsApp Sunday Collation Summary
              </h3>
              <p className="text-xs text-slate-300">
                Official structured report ready for AYAC Lagos executives
              </p>
            </div>
          </div>
          <button
            id="btn-close-whatsapp-modal"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Districts</div>
              <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {stats.reportingDistrictsCount} / {stats.totalDistrictsCount}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-400">Males / Females</div>
              <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {stats.totalMales} / {stats.totalFemales}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Grand Total</div>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {stats.grandTotal}
              </div>
            </div>
          </div>

          {/* Formatted Text Preview Container */}
          <div>
            <label id="lbl-whatsapp-report" htmlFor="textarea-whatsapp-preview" className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Copyable Text Preview
            </label>
            <textarea
              id="textarea-whatsapp-preview"
              value={textReport}
              readOnly
              rows={11}
              className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-3.5 rounded-xl border-2 border-slate-800 focus:outline-none select-all"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              id="btn-copy-whatsapp-text"
              onClick={handleCopy}
              className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  <span>Copy Report Text</span>
                </>
              )}
            </button>

            <button
              id="btn-open-whatsapp-web"
              onClick={handleOpenWhatsAppNative}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer shadow-sm"
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              <span>Share via WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
