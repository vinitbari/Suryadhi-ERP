export function flattenObject(obj: any, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};

  if (!obj || typeof obj !== 'object') {
    return result;
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (value === null || value === undefined) {
        result[propName] = '';
      } else if (value instanceof Date) {
        result[propName] = value.toISOString();
      } else if (Array.isArray(value)) {
        result[propName] = value.map(v => (typeof v === 'object' ? JSON.stringify(v) : String(v))).join(' | ');
      } else if (typeof value === 'object') {
        Object.assign(result, flattenObject(value, propName));
      } else {
        result[propName] = String(value);
      }
    }
  }

  return result;
}

export function downloadAsCSV(data: any[], filename: string) {
  if (!data || !data.length) {
    console.warn('No data available to export');
    return;
  }

  // Flatten all objects to handle nested structures
  const flattenedData = data.map((item) => flattenObject(item));

  // Extract all unique headers
  const headers = Array.from(
    new Set(flattenedData.flatMap((item) => Object.keys(item)))
  );

  // Generate CSV content
  const csvContent = [
    // Header row
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
    // Data rows
    ...flattenedData.map((row) =>
      headers
        .map((header) => {
          const val = row[header] ?? '';
          // Escape quotes and wrap in quotes to handle commas/newlines
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\n');

  // Trigger download - BOM ensures Excel correctly reads UTF-8 (handles special characters)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
