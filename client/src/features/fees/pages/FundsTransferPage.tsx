import { useState, useEffect, useCallback } from 'react';
import { feesApi } from '../api';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, FileDown, Loader2 } from 'lucide-react';

interface TransferRow {
  dateOfTransfer: string;
  receiptType: string;
  franchiseeShare: number;
  llplShare: number;
  taxAmount: number;
  welcomeKit: number;
  totalLLPLShare: number;
  chequeAmount: number;
}

function downloadCSV(data: TransferRow[], filename: string) {
  const headers = [
    'Date Of Transfer',
    'Receipt Type',
    'Sum of Franchisee Share',
    'Sum of LLPL Share',
    'Sum of TaxAmount',
    'Sum of Welcome Kit(Reconciled)',
    'Sum of Total LLPL Share',
    'Sum of Cheque Amount',
  ];
  const rows = data.map((r) => [
    r.dateOfTransfer,
    r.receiptType,
    r.franchiseeShare.toFixed(2),
    r.llplShare.toFixed(2),
    r.taxAmount.toFixed(2),
    r.welcomeKit.toFixed(2),
    r.totalLLPLShare.toFixed(2),
    r.chequeAmount.toFixed(2),
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function FundsTransferPage() {
  const [data, setData] = useState<TransferRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await feesApi.getFundsTransfer();
      if (res.data.success && res.data.data) {
        setData(
          res.data.data.map((r: any) => ({
            dateOfTransfer: r.dateOfTransfer,
            receiptType: r.receiptType || 'Fee Collection',
            franchiseeShare: r.franchiseeShare || 0,
            llplShare: r.llplShare || 0,
            taxAmount: r.taxAmount || 0,
            welcomeKit: r.welcomeKit || 0,
            totalLLPLShare: r.totalLLPLShare || 0,
            chequeAmount: r.chequeAmount || 0,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch funds transfer data', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = search
    ? data.filter(
        (r) =>
          r.dateOfTransfer.includes(search) ||
          r.receiptType.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader title="Funds Transfer Summary Report" description="View and download funds transfer summary" />

      <Card>
        <CardContent className="p-4">
          {/* Download buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              className="bg-blue-700 hover:bg-blue-800 text-white"
              onClick={() => downloadCSV(filtered, 'funds_transfer_summary.csv')}
              disabled={filtered.length === 0}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Funds Transfer Summary Report To Excel
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={() => downloadCSV(data, 'funds_transfer_detail.csv')}
              disabled={data.length === 0}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download Detail Report To Excel
            </Button>
          </div>

          {/* Search + page size */}
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by date or type..."
                className="h-8 max-w-xs"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              Show
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="border rounded px-1 py-0.5 bg-background"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              entries
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 border-b">
                  <th className="p-3 text-left font-semibold">Date Of Transfer</th>
                  <th className="p-3 text-left font-semibold">Receipt Type</th>
                  <th className="p-3 text-right font-semibold">Franchisee Share</th>
                  <th className="p-3 text-right font-semibold">LLPL Share</th>
                  <th className="p-3 text-right font-semibold">Tax Amount</th>
                  <th className="p-3 text-right font-semibold">Welcome Kit</th>
                  <th className="p-3 text-right font-semibold">Total LLPL Share</th>
                  <th className="p-3 text-right font-semibold">Cheque Amount</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" />Loading...
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">No data available in table</td>
                  </tr>
                ) : (
                  paged.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">{formatDate(row.dateOfTransfer)}</td>
                      <td className="p-3">{row.receiptType}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(row.franchiseeShare)}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(row.llplShare)}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(row.taxAmount)}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(row.welcomeKit)}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(row.totalLLPLShare)}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(row.chequeAmount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ FIX: Proper pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</Button>
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>← Prev</Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, currentPage - 2);
                  return start + i;
                }).filter((p) => p <= totalPages).map((p) => (
                  <Button key={p} variant={currentPage === p ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(p)}>{p}</Button>
                ))}
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next →</Button>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
