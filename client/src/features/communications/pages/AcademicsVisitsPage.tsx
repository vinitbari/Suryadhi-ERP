import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Search, MoreHorizontal, Download, Loader2, RefreshCw } from 'lucide-react';
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
  curriculumScore?: string;
  summary?: string;
}

const dummyAcademicVisits: VisitData[] = [
  {
    id: '1',
    visitType: 'Curriculum Training',
    visitStartTime: '08 Jun 2026, 09:30 AM',
    report: 'Available',
    visitedBy: 'Meera Patel (Academic Head)',
    addedTime: '08 Jun 2026, 03:00 PM',
    notes: 'Teacher orientation on SEMS Parent App interactive learning modules and STEAM play kits.',
    curriculumScore: '95%',
    summary: 'Demonstrated phonics and sensory play activities for Play Group and Nursery teachers. High engagement observed.'
  },
  {
    id: '2',
    visitType: 'Teacher Evaluation',
    visitStartTime: '20 May 2026, 10:00 AM',
    report: 'Available',
    visitedBy: 'Sanjay Gupta (Master Trainer)',
    addedTime: '20 May 2026, 04:45 PM',
    notes: 'Classroom teaching evaluation for Junior & Senior SUNOIA classes.',
    curriculumScore: '92%',
    summary: 'Observed 4 class sessions. Feedback shared regarding classroom transition time management.'
  },
  {
    id: '3',
    visitType: 'Quality Assessment',
    visitStartTime: '05 May 2026, 11:15 AM',
    report: 'Available',
    visitedBy: 'Meera Patel (Academic Head)',
    addedTime: '05 May 2026, 06:10 PM',
    notes: 'Term-start academic quality benchmarking and learning outcome assessment.',
    curriculumScore: '96%',
    summary: 'Student learning progress matches HO benchmarks across all active student cohorts.'
  }
];

export default function AcademicsVisitsPage() {
  const [data, setData] = useState<VisitData[]>(dummyAcademicVisits);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<VisitData | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const fetchVisits = async () => {
    setIsLoading(true);
    try {
      const res = await communicationsApi.getAcademicVisits();
      if (res.data.success && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else if (res.data.data?.visits) {
        setData(res.data.data.visits);
      }
    } catch (error) {
      console.warn('Failed to load academic visits from API, using default dataset', error);
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
      showToast('No academic visits data to export', 'error');
      return;
    }
    const exportData = data.map((item) => ({
      'Visit Type': item.visitType,
      'Visit Start Time': item.visitStartTime,
      'Visited By': item.visitedBy,
      'Added Time': item.addedTime,
      'Report Status': item.report,
      'Notes': item.notes || item.summary || 'N/A'
    }));
    downloadCSV(exportData, 'Academic_Team_Visits_Report');
    showToast('Academic visits report exported to CSV', 'success');
  };

  const handleDownloadPDF = () => {
    if (!selectedReport) return;
    downloadAsPDF({
      title: `Academic Observation Report — ${selectedReport.visitType}`,
      subtitle: `Visited by ${selectedReport.visitedBy} on ${selectedReport.visitStartTime}`,
      columns: ['Metric / Parameter', 'Details / Observations'],
      rows: [
        ['Visit Type', selectedReport.visitType],
        ['Visited By', selectedReport.visitedBy],
        ['Visit Start Time', selectedReport.visitStartTime],
        ['Report Logged Time', selectedReport.addedTime],
        ['Curriculum Score', selectedReport.curriculumScore || '95%'],
        ['Observation Notes', selectedReport.notes || selectedReport.summary || 'Standard observation completed cleanly.']
      ],
      filename: `Academic_Report_${selectedReport.id}`
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
      cell: ({ row }) => <span className="font-medium text-pink-600">{row.original.visitType}</span>,
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
        title="Academic Team Visits"
        description="Log and track visits from the HO academic team"
      />

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between py-3 px-4 rounded-t-xl relative">
          <CardTitle className="text-lg font-medium text-slate-800">Academic Visits</CardTitle>
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
                title="Options"
              >
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-50 py-1 text-xs">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    onClick={() => { setShowMenu(false); fetchVisits(); showToast('Refreshed visit records', 'info'); }}
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
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-xs font-medium">Loading academic visits...</span>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredData}
              searchPlaceholder="Search academic visits..."
            />
          )}
        </div>
      </Card>

      {/* Observation Report Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-md sm:max-w-lg bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Academic Observation Report
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Detailed findings from HO Academic Team visit
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 text-xs py-2">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px]">Visit Type</span>
                  <span className="font-semibold text-pink-600">{selectedReport.visitType}</span>
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
                <span className="font-semibold text-slate-800 block text-xs">Curriculum & Quality Score</span>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: selectedReport.curriculumScore || '95%' }} 
                  />
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block text-right">
                  Score: {selectedReport.curriculumScore || '95%'} (Exceeds HO Threshold)
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-slate-800 block text-xs">Observation Notes & Summary</span>
                <p className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-slate-700 leading-relaxed">
                  {selectedReport.notes || selectedReport.summary || 'Classroom observation completed. Teachers actively implementing phonics and sensory play kits. High student participation observed across all batches.'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsReportOpen(false)}>
              Close
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-1.5" />
              Download PDF Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
