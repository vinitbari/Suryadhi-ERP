/**
 * downloadUtils.ts
 * Utility functions for client-side file downloads (CSV, PDF, JSON).
 * Used across all pages that have download/export buttons.
 */

import api from '@/api/client';

// ─── API-based Download (Primary) ──────────────────────────────────────────

/**
 * Hit a /api/downloads/* endpoint and trigger a browser file download.
 * Falls back to local CSV generation if the API call fails.
 *
 * @param endpoint  e.g. 'admissions', 'receipts', 'fee-card'
 * @param params    Query parameters (filters, format, etc.)
 * @param fallbackData  Optional: array of flat objects to use as local fallback
 * @param filename  Default filename (without extension)
 */
export async function apiDownload(
  endpoint: string,
  params: Record<string, string> = {},
  fallbackData?: Record<string, any>[],
  filename?: string
): Promise<void> {
  const effectiveFilename = filename ?? endpoint;

  try {
    // The server responds with a CSV byte stream
    const response = await api.get(`/downloads/${endpoint}`, {
      params: { ...params, format: 'csv' },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${effectiveFilename}-${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.warn(`[apiDownload] API failed for ${endpoint}, using local fallback`, err);
    if (fallbackData && fallbackData.length > 0) {
      downloadCSV(fallbackData, effectiveFilename);
    } else {
      console.error('[apiDownload] No fallback data available');
    }
  }
}

// ─── CSV Download ───────────────────────────────────────────────────────────

/**
 * Convert an array of objects to a CSV string and trigger browser download.
 */
export function downloadCSV(data: Record<string, any>[], filename: string = 'export') {
  if (!data || data.length === 0) {
    console.warn('No data to export as CSV');
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        const str = val === null || val === undefined ? '' : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  triggerDownload(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

// ─── JSON Download ──────────────────────────────────────────────────────────

export function downloadJSON(data: any, filename: string = 'export') {
  const json = JSON.stringify(data, null, 2);
  triggerDownload(json, `${filename}.json`, 'application/json');
}

// ─── PDF / HTML Print ──────────────────────────────────────────────────────

/**
 * Generate a beautifully formatted printable HTML document and open
 * the browser print dialog so the user can save it as PDF.
 */
export function downloadAsPDF(options: {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: (string | number)[][];
  filename?: string;
  footer?: string;
}) {
  const { title, subtitle, columns, rows, footer } = options;

  const tableRows = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${cell ?? ''}</td>`).join('')}</tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 32px; font-size: 13px; }
    .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; border-bottom: 3px solid #4f46e5; padding-bottom: 16px; }
    .brand { display: flex; flex-direction: column; }
    .brand-name { font-size: 22px; font-weight: 700; color: #4f46e5; letter-spacing: -0.5px; }
    .brand-sub  { font-size: 11px; color: #6b7280; font-weight: 500; margin-top: 2px; }
    .meta { text-align: right; }
    .meta .doc-title { font-size: 17px; font-weight: 700; color: #111827; }
    .meta .doc-sub   { font-size: 11px; color: #6b7280; margin-top: 3px; }
    .meta .doc-date  { font-size: 10px; color: #9ca3af; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    thead tr { background: #4f46e5; color: white; }
    thead th { padding: 10px 12px; text-align: left; font-weight: 600; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; }
    tbody tr { border-bottom: 1px solid #f3f4f6; }
    tbody tr:nth-child(even) { background: #fafafa; }
    tbody td { padding: 9px 12px; font-size: 12px; color: #374151; }
    .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; text-align: center; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; background: #ecfdf5; color: #059669; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="brand-name">Suryadhi Learning Pvt. Ltd.</div>
      <div class="brand-sub">SEMS — Suryadhi Education Management System</div>
    </div>
    <div class="meta">
      <div class="doc-title">${title}</div>
      ${subtitle ? `<div class="doc-sub">${subtitle}</div>` : ''}
      <div class="doc-date">Generated: ${new Date().toLocaleString('en-IN')}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>${columns.map((col) => `<th>${col}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  ${footer ? `<div class="footer">${footer}</div>` : ''}
  <div class="footer">SunoiaKids Preschool Management System &mdash; Confidential</div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onafterprint = () => URL.revokeObjectURL(url);
  }
}

// ─── Internal helper ────────────────────────────────────────────────────────

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
