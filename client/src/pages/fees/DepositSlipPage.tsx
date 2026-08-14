import { useState, useEffect } from 'react';
import api from '@/api/client';

import { type ColumnDef } from '@tanstack/react-table';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Printer, Download, Search, CheckCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DepositSlip {
  id: string;
  slipNo: string;
  depositDate: string;
  bankName: string;
  branch: string;
  totalAmount: number;
  cashAmount: number;
  chequeAmount: number;
  status: string;
}

const columns: ColumnDef<DepositSlip, any>[] = [
  {
    accessorKey: 'slipNo',
    header: 'Slip No',
    cell: ({ getValue }) => <span className="font-mono font-medium text-sm text-primary">{getValue() as string}</span>,
  },
  {
    accessorKey: 'depositDate',
    header: 'Deposit Date',
    cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue() as string)}</span>,
  },
  {
    accessorKey: 'bankName',
    header: 'Bank & Branch',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.bankName}</p>
        <p className="text-xs text-muted-foreground">{row.original.branch || 'N/A'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'cashAmount',
    header: () => <div className="text-right">Cash Amount</div>,
    cell: ({ getValue }) => <div className="text-right font-mono text-muted-foreground">{formatCurrency(getValue() as number)}</div>,
  },
  {
    accessorKey: 'chequeAmount',
    header: () => <div className="text-right">Cheque Amount</div>,
    cell: ({ getValue }) => <div className="text-right font-mono text-muted-foreground">{formatCurrency(getValue() as number)}</div>,
  },
  {
    accessorKey: 'totalAmount',
    header: () => <div className="text-right font-bold">Total Amount</div>,
    cell: ({ getValue }) => <div className="text-right font-mono font-bold">{formatCurrency(getValue() as number)}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return <Badge className={getStatusColor(status)}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: () => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" title="Print Slip">
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function DepositSlipPage() {
  const [data, setData] = useState<DepositSlip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchSlips = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/fees/deposits', {
        params: {
          startDate: fromDate || undefined,
          endDate: toDate || undefined,
        }
      });
      if (res.data.success && res.data.data) {
        const apiData = res.data.data.map((item: any) => {
          const cashAmount = item.receipts?.filter((r: any) => r.paymentMode === 'CASH').reduce((sum: number, r: any) => sum + r.amount, 0) || 0;
          const chequeAmount = item.receipts?.filter((r: any) => r.paymentMode === 'CHEQUE').reduce((sum: number, r: any) => sum + r.amount, 0) || 0;
          
          return {
            id: item.id,
            slipNo: item.slipNumber,
            depositDate: item.depositDate,
            bankName: item.bankName,
            branch: item.bankBranch,
            totalAmount: item.totalAmount,
            cashAmount,
            chequeAmount,
            status: item.status,
          };
        });
        setData(apiData);
      }
    } catch (error) {
      console.error('Failed to fetch deposit slips', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlips();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deposit Slips (Automated)"
        description="Generate and track automated bank deposit slips for collected cash and cheques"
      >
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Generate New Slip
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border bg-muted/20 flex flex-wrap gap-4 items-end">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground">From Date</label>
              <Input type="date" className="h-9" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground">To Date</label>
              <Input type="date" className="h-9" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button className="w-full sm:w-auto" variant="secondary" onClick={fetchSlips}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <DataTable
              columns={columns}
              data={data}
              searchPlaceholder="Search by slip no or bank..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
