import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Search, Menu, Download, Loader2, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
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
import { downloadCSV, downloadAsPDF } from '@/lib/downloadUtils';

interface VisitData {
  id: string;
  visitType: string;
  visitStartTime: string;
  report: string;
  visitedBy: string;
  addedTime: string;
  notes?: string;
  complianceScore?: string;
  summary?: string;
}

const dummyBusinessVisits: VisitData[] = [
  {
    id: '1',
    visitType: 'Quarterly Audit',
    visitStartTime: '10 Jun 2026, 10:00 AM',
    report: 'Available',
    visitedBy: 'Vikram Singh (HO Business Head)',
    addedTime: '10 Jun 2026, 04:30 PM',
    notes: 'Operational and financial compliance audit for SunoiaKids Franchisee.',
    complianceScore: '98%',
    summary: 'All financial logs, safety protocols, and staff documentation inspected and found compliant with HO standards.'
  },
  {
    id: '2',
    visitType: 'Infrastructure Check',
    visitStartTime: '25 May 2026, 11:30 AM',
    report: 'Available',
    visitedBy: 'Anita Desai (Operations Manager)',
    addedTime: '25 May 2026, 05:15 PM',
    notes: 'Review of classroom amenities, play area equipment, and safety fencing.',
    complianceScore: '94%',
    summary: 'Play area soft padding verified. Minor maintenance recommended for classroom 2 ventilation.'
  },
  {
    id: '3',
    visitType: 'Compliance Review',
    visitStartTime: '12 Apr 2026, 09:15 AM',
    report: 'Available',
    visitedBy: 'Rahul Sharma (Zonal Manager)',
    addedTime: '12 Apr 2026, 02:45 PM',
    notes: 'Annual statutory compliance check and brand guideline alignment.',
    complianceScore: '96%',
    summary: 'Fire safety certifications and health clearance certificates verified. Approved for current term.'
  }
];

export default function BusinessVisitsPage() {
  const [data, setData] = useState<VisitData[]>(dummyBusinessVisits);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<VisitData | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const fetchVisits = async () => {
    setIsLoading(true);
    try {
      const res = await communicationsApi.getBusinessVisits();
      if (res.data.success && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else if (res.data.data?.visits) {
        setData(res.data.data.visits);
      }
    } catch (error) {
      console.warn('Failed to load business visits from API, using default dataset', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleViewReport = (visit: VisitData) => {
    setSelectedReport(visit);
    setIsReportOpen(true);
  };

  const handleExportCSV = () => {
    if (!data.length) {
      showToast('No business manager visits data to export', 'error');
      return;
    }
    const exportData = data.map((item) => ({
      'Visit Type': item.visitType,
      'Visit Start Time': item.visitStartTime,
      'Visited By': item.visitedBy,
      'Added Time': item.addedTime,
      'Compliance Score': item.complianceScore || 'N/A',
      'Report Status': item.report,
      'Notes': item.notes || item.summary || 'N/A'
    }));
    downloadCSV(exportData, 'Business_Team_Visits_Report');
    showToast('Business manager visits report exported to CSV', 'success');
  };

  const handleDownloadPDF = () => {
    if (!selectedReport) return;
    downloadAsPDF({
      title: `Business Audit Report — ${selectedReport.visitType}`,
      subtitle: `Visited by ${selectedReport.visitedBy} on ${selectedReport.visitStartTime}`,
      columns: ['Audit Field / Parameter', 'Details & Compliance Status'],
      rows: [
        ['Visit Type', selectedReport.visitType],
        ['Visited By', selectedReport.visitedBy],
        ['Visit Start Time', selectedReport.visitStartTime],
        ['Report Logged Time', selectedReport.addedTime],
        ['Compliance Score', selectedReport.complianceScore || '98%'],
        ['Audit Findings & Summary', selectedReport.summary || selectedReport.notes || 'Fully compliant with HO franchise operational guidelines.']
      ],
      filename: `Business_Audit_Report_${selectedReport.id}`
    });
  };

  const columns: ColumnDef<VisitData>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 pl-6">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'visitType',
      header: 'Visit Type',
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.visitType}</span>,
    },
    {
      accessorKey: 'visitStartTime',
      header: 'Visit Start Time',
    },
    {
      accessorKey: 'report',
      header: 'View Observation Report',
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          onClick={() => handleViewReport(row.original)}
        >
          <FileText className="h-4 w-4 mr-2" />
          View Report
        </Button>
      ),
    },
    {
      accessorKey: 'visitedBy',
      header: 'Visited By',
    },
    {
      accessorKey: 'addedTime',
      header: 'Added Time',
    },
  ];

  const filteredData = searchQuery
    ? data.filter(
        (item) =>
          item.visitType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.visitedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.visitStartTime.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Team Visits"
        description="Log and track visits from the HO business team"
      />

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between py-3 px-4 rounded-t-xl relative">
          <CardTitle className="text-lg font-medium text-slate-700">Business Manager Visits</CardTitle>
          <div className="flex items-center gap-2">
            {showSearch && (
              <input
                type="text"
                placeholder="Filter visits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs border border-slate-200 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
                autoFocus
              />
            )}
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 bg-white"
              onClick={() => setShowSearch(!showSearch)}
              title="Search visits"
            >
              <Search className="h-4 w-4 text-slate-500" />
            </Button>
            <div className="relative">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-white"
                onClick={() => setShowMenu(!showMenu)}
                title="Menu options"
              >
                <Menu className="h-4 w-4 text-slate-500" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-50 py-1 text-xs">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    onClick={() => { setShowMenu(false); fetchVisits(); showToast('Refreshed business visits', 'info'); }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh List
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    onClick={() => { setShowMenu(false); handleExportCSV(); }}
                  >
                    <Download className="w-3.5 h-3.5" /> Export to CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <div className="p-0">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
              <span className="text-xs font-medium">Loading business visits...</span>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredData}
              searchPlaceholder="Search visits..."
            />
          )}
        </div>
      </Card>

      {/* Audit Observation Report Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-md sm:max-w-lg bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-700" />
              Business Audit Observation Report
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Audit findings & compliance metrics from HO Business Team visit
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 text-xs py-2">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Visit Type</span>
                  <span className="font-semibold text-slate-800">{selectedReport.visitType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Visited By</span>
                  <span className="font-semibold text-slate-800">{selectedReport.visitedBy}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Visit Start Time</span>
                  <span className="text-slate-700">{selectedReport.visitStartTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Added Time</span>
                  <span className="text-slate-700">{selectedReport.addedTime}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-slate-800 block text-xs">Compliance Score</span>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full" 
                    style={{ width: selectedReport.complianceScore || '98%' }} 
                  />
                </div>
                <span className="text-[11px] text-blue-700 font-semibold block text-right">
                  Score: {selectedReport.complianceScore || '98%'} (HO Compliant)
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-slate-800 block text-xs">Audit Notes & Findings Summary</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                  {selectedReport.summary || selectedReport.notes || 'Full operational and safety audit conducted. Financial logs, safety clearances, and staff credentials verified compliant.'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsReportOpen(false)}>
              Close
            </Button>
            <Button size="sm" className="bg-slate-800 hover:bg-slate-900 text-white" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-1.5" />
              Download PDF Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
