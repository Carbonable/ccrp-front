import * as XLSX from 'xlsx';

export interface ExportColumn {
  header: string;
  key: string;
}

/**
 * Exports data to an Excel (.xlsx) file and triggers a browser download.
 */
export function exportToExcel(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
): void {
  const headers = columns.map((c) => c.header);
  const rows = data.map((row) => columns.map((c) => row[c.key] ?? ''));

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  const xlsxFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, xlsxFilename);
}

/**
 * Exports data to a CSV file and triggers a browser download.
 */
export function exportToCSV(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
): void {
  const headers = columns.map((c) => c.header);
  const rows = data.map((row) => columns.map((c) => row[c.key] ?? ''));

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const csvFilename = filename.endsWith('.csv')
    ? filename
    : `${filename.replace(/\.xlsx$/, '')}.csv`;
  link.download = csvFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Returns a date string in YYYY-MM-DD format for use in filenames.
 */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}
