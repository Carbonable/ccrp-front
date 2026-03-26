'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowDownTrayIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { exportToExcel, exportToCSV, ExportColumn, getTodayDateString } from '@/utils/export';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  columns: ExportColumn[];
  tableName: string;
}

export default function ExportButton({ data, columns, tableName }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const baseFilename = `ccpm-${tableName}-${getTodayDateString()}`;

  const handleExcel = () => {
    exportToExcel(data, columns, `${baseFilename}.xlsx`);
    setOpen(false);
  };

  const handleCSV = () => {
    exportToCSV(data, columns, `${baseFilename}.csv`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        disabled={!data || data.length === 0}
        className="flex items-center gap-1 rounded border border-neutral-600 bg-neutral-700 px-2 py-1 text-xs text-neutral-300 transition hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
        title="Export data"
      >
        <ArrowDownTrayIcon className="h-3.5 w-3.5" />
        Export
        <ChevronDownIcon className="h-3 w-3" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 origin-top-right rounded border border-neutral-600 bg-neutral-800 shadow-lg">
          <button
            onClick={handleExcel}
            className="block w-full px-3 py-2 text-left text-xs text-neutral-200 hover:bg-neutral-700"
          >
            Excel (.xlsx)
          </button>
          <button
            onClick={handleCSV}
            className="block w-full px-3 py-2 text-left text-xs text-neutral-200 hover:bg-neutral-700"
          >
            CSV (.csv)
          </button>
        </div>
      )}
    </div>
  );
}
