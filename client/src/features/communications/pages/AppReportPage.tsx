import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone, Users, Send, CheckCircle2,
  RotateCcw, Download, Eye, ListFilter, Loader2
} from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { communicationsApi } from '../api';
import { showToast } from '@/lib/toast';
import { downloadCSV } from '@/lib/downloadUtils';

interface AppCommunication {
  id: string;
  title: string;
  recipientGroup: string;
  type: 'NOTICE' | 'EVENT' | 'CIRCULAR' | 'HOMEWORK';
  status: 'DELIVERED' | 'PENDING' | 'FAILED';
  deliveredCount: number;
  totalCount: number;
  sentDate: string;
  content?: string;
}

interface AppReportStats {
  registeredParents: number;
  activeInstallations: number;
  messagesBroadcasted: number;
  overallDeliveryRate: string;
}

const dummyCommunications: AppCommunication[] = [
  {
    id: '1',
    title: 'Sunny SunoiaKids Welcome Kit Guidelines',
    recipientGroup: 'Nursery Parents',
    type: 'CIRCULAR',
    status: 'DELIVERED',
    deliveredCount: 32,
    totalCount: 33,
    sentDate: '12 Jun 2026, 10:00 AM',
    content: 'Dear Parents, Please refer to the attached guide for SunoiaKids Welcome Kit distribution and unboxing details.'
  },
  {
    id: '2',
    title: 'Rainy Day Activity Notification',
    recipientGroup: 'All Classes',
    type: 'NOTICE',
    status: 'DELIVERED',
    deliveredCount: 85,
    totalCount: 88,
    sentDate: '08 Jun 2026, 08:30 AM',
    content: 'Kindly send extra pair of clothes and raincoat with your ward for indoor rainy day play activities.'
  },
  {
    id: '3',
    title: 'Parent-Teacher Meeting Schedule - June',
    recipientGroup: 'SUNOIA Junior & Senior',
    type: 'EVENT',
    status: 'PENDING',
    deliveredCount: 15,
    totalCount: 49,
    sentDate: '15 Jun 2026, 09:00 AM',
    content: 'PTM for June term will be conducted on Saturday, 20th June. Slot allocation details are attached.'
  },
  {
    id: '4',
    title: 'SEMS Parent App — Interactive Learning Assessment',
    recipientGroup: 'Play Group',
    type: 'HOMEWORK',
    status: 'FAILED',
    deliveredCount: 2,
    totalCount: 6,
    sentDate: '14 Jun 2026, 04:15 PM',
    content: 'Weekly interactive rhyme and matching shape assignment uploaded on SEMS Parent App.'
  }
];

export default function AppReportPage() {
  const [data, setData] = useState<AppCommunication[]>(dummyCommunications);
  const [stats, setStats] = useState<AppReportStats>({
    registeredParents: 142,
    activeInstallations: 128,
    messagesBroadcasted: 358,
    overallDeliveryRate: '96.5%',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<AppCommunication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchAppReport = async () => {
    setIsLoading(true);
    try {
      const res = await communicationsApi.getAppReport();
      if (res.data.success) {
        if (res.data.stats) {
          setStats(res.data.stats);
        }
        if (Array.isArray(res.data.data)) {
          setData(res.data.data);
        }
      }
    } catch (error) {
      console.warn('Failed to fetch app report metrics, using fallback dataset', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppReport();
  }, []);

  const handleResend = async (item: AppCommunication) => {
    setResendingId(item.id);
    showToast(`Resending notification "${item.title}"...`, 'info');
    try {
      const res = await communicationsApi.resendNotification(item.id);
      if (res.data.success) {
        showToast(res.data.message || `Notification resent to ${item.totalCount} recipients successfully!`, 'success');
        // Update item status locally in state
        setData((prev) =>
          prev.map((c) =>
            c.id === item.id
              ? { ...c, status: 'DELIVERED', deliveredCount: c.totalCount }
              : c
          )
        );
      }
    } catch (error) {
      showToast('Failed to resend notification. Please try again.', 'error');
    } finally {
      setResendingId(null);
    }
  };

  const handleViewDetails = (item: AppCommunication) => {
    setSelectedNotice(item);
    setIsDetailsOpen(true);
  };

  const handleExportLogs = () => {
    if (!data.length) {
      showToast('No notification logs available to export', 'error');
      return;
    }
    const exportData = data.map((item) => ({
      'Notification ID': `#${item.id}`,
      'Subject Title': item.title,
      'Recipient Group': item.recipientGroup,
      'Category': item.type,
      'Status': item.status,
      'Delivered Count': item.deliveredCount,
      'Total Count': item.totalCount,
      'Delivery Rate': `${((item.deliveredCount / item.totalCount) * 100).toFixed(1)}%`,
      'Sent Date': item.sentDate,
      'Content Summary': item.content || 'N/A'
    }));
    downloadCSV(exportData, 'Notification_Dispatch_Logs');
    showToast('Notification dispatch logs exported to CSV', 'success');
  };

  const columns: ColumnDef<AppCommunication>[] = [
    {
      accessorKey: 'title',
      header: 'Notification Subject',
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{row.original.title}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">ID: #{row.original.id}</span>
        </div>
      ),
    },
    {
      accessorKey: 'recipientGroup',
      header: 'Recipient Group',
    },
    {
      accessorKey: 'type',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-medium tracking-wide uppercase">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: 'deliveryStats',
      header: 'Delivery Rate',
      cell: ({ row }) => {
        const rate = ((row.original.deliveredCount / row.original.totalCount) * 100).toFixed(0);
        return (
          <div>
            <span className="font-mono font-bold text-xs">{row.original.deliveredCount} / {row.original.totalCount}</span>
            <span className="text-[10px] text-muted-foreground ml-1.5">({rate}%)</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge className={
            s === 'DELIVERED' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
              s === 'PENDING' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                'bg-red-100 text-red-700 hover:bg-red-200'
          }>
            {s}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'sentDate',
      header: 'Sent Date',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <Button 
            variant="ghost" 
            size="icon-sm" 
            title="View details" 
            className="text-slate-500 hover:text-slate-800"
            onClick={() => handleViewDetails(row.original)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon-sm" 
            title="Resend notification" 
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleResend(row.original)}
            disabled={resendingId === row.original.id}
          >
            {resendingId === row.original.id ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="App Report"
        description="Monitor Parent App communication metrics, delivery success, and engagement"
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Registered Parents" value={stats.registeredParents} icon={Users} color="blue" />
        <StatCard title="Active Installations" value={stats.activeInstallations} icon={Smartphone} color="emerald" />
        <StatCard title="Messages Broadcasted" value={stats.messagesBroadcasted} icon={Send} color="violet" />
        <StatCard title="Overall Delivery Rate" value={stats.overallDeliveryRate} icon={CheckCircle2} color="green" />
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b border-border/50 flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-slate-500" />
            Notification Dispatch Logs
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export logs
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-xs font-medium">Loading notification logs...</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              searchPlaceholder="Search notifications..."
            />
          )}
        </CardContent>
      </Card>

      {/* Notification Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md sm:max-w-lg bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Notification Dispatch Details
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Complete dispatch log and message content
            </DialogDescription>
          </DialogHeader>

          {selectedNotice && (
            <div className="space-y-4 text-xs py-2">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Subject ID: #{selectedNotice.id}</span>
                <span className="text-sm font-bold text-slate-900 block">{selectedNotice.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Recipient Group</span>
                  <span className="font-semibold text-slate-800">{selectedNotice.recipientGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Category</span>
                  <Badge variant="outline" className="text-[10px] font-semibold tracking-wide uppercase mt-0.5">
                    {selectedNotice.type}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Delivery Rate</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedNotice.deliveredCount} / {selectedNotice.totalCount} ({((selectedNotice.deliveredCount / selectedNotice.totalCount) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Status</span>
                  <Badge className={
                    selectedNotice.status === 'DELIVERED' ? 'bg-green-100 text-green-700 hover:bg-green-200 mt-0.5' :
                      selectedNotice.status === 'PENDING' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 mt-0.5' :
                        'bg-red-100 text-red-700 hover:bg-red-200 mt-0.5'
                  }>
                    {selectedNotice.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Sent Date & Time</span>
                  <span className="text-slate-700">{selectedNotice.sentDate}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-slate-800 block text-xs">Broadcast Message Content</span>
                <p className="p-3 bg-blue-50/40 border border-blue-100 rounded-lg text-slate-700 leading-relaxed font-sans">
                  {selectedNotice.content || 'Important notification delivered via Suryadhi SEMS Parent Portal and SEMS Mobile App.'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            {selectedNotice && (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setIsDetailsOpen(false);
                  handleResend(selectedNotice);
                }}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Resend Notification
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
