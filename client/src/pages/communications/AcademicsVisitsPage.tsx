import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Search, MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface VisitData {
  id: string;
  visitType: string;
  visitStartTime: string;
  report: string;
  visitedBy: string;
  addedTime: string;
}

const dummyAcademicVisits: VisitData[] = [
  {
    id: '1',
    visitType: 'Curriculum Training',
    visitStartTime: '08 Jun 2026, 09:30 AM',
    report: 'Available',
    visitedBy: 'Meera Patel (Academic Head)',
    addedTime: '08 Jun 2026, 03:00 PM'
  },
  {
    id: '2',
    visitType: 'Teacher Evaluation',
    visitStartTime: '20 May 2026, 10:00 AM',
    report: 'Available',
    visitedBy: 'Sanjay Gupta',
    addedTime: '20 May 2026, 04:45 PM'
  },
  {
    id: '3',
    visitType: 'Quality Assessment',
    visitStartTime: '05 May 2026, 11:15 AM',
    report: 'Available',
    visitedBy: 'Meera Patel',
    addedTime: '05 May 2026, 06:10 PM'
  }
];

export default function AcademicsVisitsPage() {
  const [data] = useState<VisitData[]>(dummyAcademicVisits);

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
      cell: () => (
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Team Visits"
        description="Log and track visits from the HO academic team"
      />

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between py-3 px-4 rounded-t-xl">
          <CardTitle className="text-lg font-medium text-slate-800">Academic Visits</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-white">
              <Search className="h-4 w-4 text-slate-500" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-white">
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </CardHeader>
        <div className="p-0">
          <DataTable 
            columns={columns} 
            data={data}
            searchPlaceholder="Search academic visits..."
          />
        </div>
      </Card>
    </div>
  );
}
