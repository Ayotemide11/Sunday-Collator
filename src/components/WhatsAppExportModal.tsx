import React, { useState } from 'react';
import { AttendanceRecord } from '../types';
import { generateWhatsAppReport } from '../utils/storage';
import { X, Copy, Check, Share2, Calendar } from 'lucide-react';

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
  const [reportDate, setReportDate] = useState<string>(selectedDate);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const rawReportText = generateWhatsAppReport(records, reportDate);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(rawReportText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div id="whatsapp-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-blue-950 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-lg font-black text-white">WhatsApp Sunday Broadcast</h3>
              <p className="text-xs text-sky-300">Format attendance for executive & group chat broadcast</p>
            </div>
          </div>
          <button
            id="btn-close-whatsapp-modal"
            onClick={onClose}
            className="text-sky-300 hover:text-white p-1 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          
          {/* Date Picker Selector */}
          <div className="flex items-center justify-between bg-blue-50/60 dark:bg-blue-900/40 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
            <label htmlFor="input-whatsapp-date" className="text-xs font-bold text-blue-950 dark:text-sky-200 flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-sky-600 dark:text-sky-400" />
              Report Date:
            </label>
            <input
              id="input-whatsapp-date"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-950 dark:text-sky-100 rounded-md px-2.5 py-1 focus:ring-1 focus:ring-sky-500 cursor-pointer"
            />
          </div>

          {/* Formatted Text Preview Container */}
          <div className="relative">
            <div className="text-xs font-extrabold text-blue-900 dark:text-sky-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Preview Text (Ready for WhatsApp)</span>
              {copied && <span className="text-sky-400 font-bold lowercase">Copied to clipboard!</span>}
            </div>
            <textarea
              id="textarea-whatsapp-preview"
              readOnly
              value={rawReportText}
              rows={12}
              className="w-full bg-blue-950 text-sky-200 font-mono text-xs p-4 rounded-xl border border-blue-900 focus:outline-none resize-none shadow-inner leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              id="btn-copy-whatsapp-text"
              onClick={handleCopy}
              className={`w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-black transition-all shadow-sm cursor-pointer ${
                copied
                  ? 'bg-sky-500 text-blue-950 border border-sky-400'
                  : 'bg-blue-900 text-sky-100 hover:bg-blue-800 border border-blue-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-blue-950" />
                  <span>Text Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2 text-sky-300" />
                  <span>Copy Report Text</span>
                </>
              )}
            </button>

            <button
              id="btn-share-whatsapp-direct"
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-black text-blue-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4 mr-2" />
              <span>Share to WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
