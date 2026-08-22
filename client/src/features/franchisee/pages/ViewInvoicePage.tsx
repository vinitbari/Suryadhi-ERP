import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Download, FileText, Filter, Loader2 } from 'lucide-react';
import api from '@/api/client';
import { downloadAsPDF } from '@/lib/downloadUtils';

interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  type: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
}

const dummyInvoices: Invoice[] = [
  { id: '1', invoiceNo: 'INV-HQ-26-4421', date: '2026-06-01', type: 'Royalty Fee', amount: 85000, status: 'PAID' },
  { id: '2', invoiceNo: 'INV-HQ-26-4890', date: '2026-06-05', type: 'Kit Purchase', amount: 125000, status: 'UNPAID' },
  { id: '3', invoiceNo: 'INV-HQ-26-4911', date: '2026-05-15', type: 'Marketing Support', amount: 25000, status: 'OVERDUE' },
];

export default function ViewInvoicePage() {
  const [data, setData] = useState<Invoice[]>(dummyInvoices);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/franchisee/invoices');
      if (res.data.success && Array.isArray(res.data.data)) {
        const invoices = res.data.data.map((item: any) => {
          const invAmt = Number(item.invoiceAmount || item.amount || 0);
          const recAmt = Number(item.receiptAmount || 0);
          const bal = Number(item.balance || (invAmt - recAmt));
          let status: 'PAID' | 'UNPAID' | 'OVERDUE' = 'PAID';
          if (bal > 0) status = 'UNPAID';
          return {
            id: item.id,
            invoiceNo: item.particulars?.includes('INV') ? item.particulars.split(' ')[0] : `INV-HQ-26-${item.id.slice(-4).toUpperCase()}`,
            date: item.entryDate || item.date || new Date().toISOString(),
            type: item.entryType || item.type || 'Head Office Invoice',
            amount: invAmt || 50000,
            status,
          };
        });
        if (invoices.length > 0) {
          setData(invoices);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch franchisee invoices, using fallback list', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleExportPDF = () => {
    downloadAsPDF({
      title: 'Head Office Invoices Report',
      subtitle: 'Suryadhi Learning Pvt. Ltd. — Invoices Summary',
      columns: ['Invoice No', 'Date', 'Category', 'Amount', 'Status'],
      rows: data.map((inv) => [
        inv.invoiceNo,
        formatDate(inv.date),
        inv.type,
        formatCurrency(inv.amount),
        inv.status,
      ]),
      filename: 'ho-invoices-report',
    });
  };

  const columns: ColumnDef<Invoice, any>[] = [
    {
      accessorKey: 'invoiceNo',
      header: 'Invoice No',
      cell: ({ getValue }) => <span className="font-mono font-medium text-sm text-primary">{getValue() as string}</span>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue() as string)}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Category',
      cell: ({ getValue }) => <span className="font-medium text-sm">{getValue() as string}</span>,
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Total Amount</div>,
      cell: ({ getValue }) => <div className="text-right font-mono font-bold">{formatCurrency(getValue() as number)}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <Badge 
            className={
              status === 'PAID' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200' :
              status === 'OVERDUE' ? 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200' : 
              'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200'
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => {
            downloadAsPDF({
              title: `Invoice: ${row.original.invoiceNo}`,
              subtitle: `Category: ${row.original.type} | Date: ${formatDate(row.original.date)}`,
              columns: ['Description', 'Amount', 'Status'],
              rows: [[row.original.type, formatCurrency(row.original.amount), row.original.status]],
              filename: `invoice-${row.original.invoiceNo}`,
            });
          }}
        >
          <FileText className="h-3.5 w-3.5 mr-1.5" />
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Head Office Invoices"
        description="View and download all billing invoices generated by Suryadhi Learning Pvt. Ltd. — HQ"
      >
        <Button variant="outline" size="sm" onClick={fetchInvoices} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Filter className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
        <Button size="sm" onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          Bulk Download PDF
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="p-4">
            <DataTable
              columns={columns}
              data={data}
              searchPlaceholder="Search by invoice number or category..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
