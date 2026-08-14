import React, { useState, useEffect, useCallback } from 'react';
import { feesApi } from '../api';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Printer, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store';

interface DepositSlip {
  id: string;
  slipNumber: string;
  depositDate: string;
  bankName: string;
  bankBranch: string;
  totalAmount: number;
  status: string;
  receipts: any[];
}

export default function DepositHistoryPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DepositSlip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchDeposits = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await feesApi.listDeposits();
      if (res.data.success && res.data.data) {
        setData(
          res.data.data.map((d: any) => ({
            id: d.id,
            slipNumber: d.slipNumber,
            depositDate: d.depositDate,
            bankName: d.bankName || '-',
            bankBranch: d.bankBranch || '-',
            totalAmount: Number(d.totalAmount),
            status: d.status,
            receipts: d.receipts || [],
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch deposits', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  const handlePrint = (slip: DepositSlip) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const schoolCode = user?.school?.code || 'SLPL-3201';
    const schoolCity = user?.school?.city || 'Arni';

    const receiptRows = slip.receipts
      .map(
        (r: any) => `
      <tr>
        <td style="padding:6px 8px;border:1px solid #ddd">${r.chequeNumber || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${r.admission?.student ? `${r.admission.student.firstName} ${r.admission.student.lastName}` : '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${r.bankName || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">₹${Number(r.amount).toLocaleString('en-IN')}</td>
      </tr>`
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html><html><head>
        <title>Deposit Slip - ${slip.slipNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; font-size: 13px; }
          h2 { margin-bottom: 2px; color: #0056b3; }
          p.sub { margin-top: 0; color: #666; font-size: 11px; margin-bottom: 16px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; border: 1px solid #ddd; padding: 12px; border-radius: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          thead tr { background: #0056b3; color: white; }
          th { padding: 8px; text-align: left; font-size: 12px; }
          td { padding: 6px 8px; border: 1px solid #ddd; }
          .total-row { font-weight: bold; background: #f5f5f5; }
          @media print { body { padding: 12px; } }
        </style>
      </head>
      <body>
        <h2>SLPL Automated Deposit Slip</h2>
        <p class="sub">Preschool Management System — Confidential</p>
        <div class="meta-grid">
          <div><strong>Slip No:</strong> ${slip.slipNumber}</div>
          <div><strong>Date:</strong> ${new Date(slip.depositDate).toLocaleDateString('en-IN')}</div>
          <div><strong>Franchisee Code:</strong> ${schoolCode}</div>
          <div><strong>Area / Location:</strong> ${schoolCity}</div>
          <div><strong>Bank:</strong> ${slip.bankName} — ${slip.bankBranch}</div>
          <div><strong>Total Amount:</strong> ₹${slip.totalAmount.toLocaleString('en-IN')}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Cheque No</th>
              <th>Student</th>
              <th>Bank</th>
              <th style="text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${receiptRows}
            <tr class="total-row">
              <td colspan="3" style="text-align:right;padding:8px">Total</td>
              <td style="text-align:right;padding:8px">₹${slip.totalAmount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); };<\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  // ── Filtering & Pagination ──────────────────────────────────
  const filtered = search
    ? data.filter(
        (d) =>
          d.slipNumber.toLowerCase().includes(search.toLowerCase()) ||
          d.bankName.toLowerCase().includes(search.toLowerCase()) ||
          d.bankBranch.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Deposit Screen" description="View and print deposit slip details" />

      <Card>
        <CardContent className="p-4">
          {/* Search + page size */}
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by slip no or bank..."
                className="h-8 max-w-xs"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
              <Search className="h-4 w-4 text-muted-foreground" />
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
                  <th className="p-3 text-left font-semibold">Slip No</th>
                  <th className="p-3 text-left font-semibold">Deposit Date</th>
                  <th className="p-3 text-left font-semibold">Bank</th>
                  <th className="p-3 text-right font-semibold">Total Amount</th>
                  <th className="p-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" />Loading...
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No data available in table</td>
                  </tr>
                ) : (
                  // ✅ FIX: Use React.Fragment with key instead of bare <>
                  paged.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-sm font-medium text-primary">{row.slipNumber}</td>
                        <td className="p-3">{formatDate(row.depositDate)}</td>
                        <td className="p-3 text-sm">
                          {row.bankName}
                          {row.bankBranch !== '-' && <span className="text-muted-foreground"> / {row.bankBranch}</span>}
                        </td>
                        <td className="p-3 text-right font-mono font-bold">{formatCurrency(row.totalAmount)}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon-sm" title="Print Slip" onClick={() => handlePrint(row)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="View Details"
                              onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                            >
                              {expandedId === row.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === row.id && (
                        <tr>
                          <td colSpan={5} className="p-4 bg-muted/20 border-b">
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">
                                Receipts: {row.receipts.length} &nbsp;·&nbsp; Status: {row.status}
                              </p>
                              <table className="w-full text-xs border rounded">
                                <thead>
                                  <tr className="bg-muted/40">
                                    <th className="p-2 text-left">Receipt No</th>
                                    <th className="p-2 text-left">Student</th>
                                    <th className="p-2 text-left">Cheque No</th>
                                    <th className="p-2 text-right">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {row.receipts.map((r: any) => (
                                    <tr key={r.id} className="border-b">
                                      <td className="p-2 font-mono">{r.receiptNumber}</td>
                                      <td className="p-2">
                                        {r.admission?.student
                                          ? `${r.admission.student.firstName} ${r.admission.student.lastName}`
                                          : '-'}
                                      </td>
                                      <td className="p-2 font-mono">{r.chequeNumber || '-'}</td>
                                      <td className="p-2 text-right font-mono">{formatCurrency(Number(r.amount))}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
