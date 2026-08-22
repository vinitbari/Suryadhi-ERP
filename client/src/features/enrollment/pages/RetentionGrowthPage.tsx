import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { downloadAsPDF } from '@/lib/downloadUtils';
import api from '@/api/client';

const initialTableData = [
  { program: 'Nursery', currentYear: 1, lastYear: 10, growthPercent: '-90%', isNegative: true },
  { program: 'SUNOIA Junior', currentYear: 23, lastYear: 21, growthPercent: '10%', isNegative: false },
  { program: 'SUNOIA Senior', currentYear: 15, lastYear: 9, growthPercent: '67%', isNegative: false },
  { program: 'Total', isTotal: true, currentYear: 39, lastYear: 40, growthPercent: '-3%', isNegative: true },
];

export default function RetentionGrowthPage() {
  const [academicYear, setAcademicYear] = useState('ay1');
  const [data, setData] = useState(initialTableData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGrowth = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/dashboard/enrollment-analytics');
        if (res.data.success && res.data.data?.retentionGrowth) {
          setData(res.data.data.retentionGrowth);
        }
      } catch (err) {
        console.warn('Failed to load retention growth analytics', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrowth();
  }, [academicYear]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Retention Growth"
        description="Track year-over-year retention improvements"
      >
        <div className="flex items-center gap-3">
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="w-[180px] h-9 bg-white">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ay1">Apr 26 - Mar 27</SelectItem>
              <SelectItem value="ay0">Apr 25 - Mar 26</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => downloadAsPDF({
            title: 'Retention Growth Report',
            subtitle: `Academic Year: ${academicYear === 'ay1' ? 'Apr 26 - Mar 27' : 'Apr 25 - Mar 26'}`,
            columns: ['Program', 'Current Year', 'Last Year', 'Growth %'],
            rows: data.map((r) => [r.program, r.currentYear, r.lastYear, r.growthPercent]),
            filename: 'retention-growth-report',
          })}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </PageHeader>

      <Card className="overflow-hidden border-0 shadow-sm max-w-5xl mx-auto">
        <div className="bg-[#243c84] text-white text-center py-4 font-semibold text-lg rounded-t-xl">
          Retention Growth
        </div>
        <div className="bg-white border border-t-0 border-slate-200 rounded-b-xl overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-4 px-6 text-left font-bold text-slate-700 w-1/3">Program</th>
                <th className="py-4 px-6 font-bold text-slate-700 w-1/4">Current Year</th>
                <th className="py-4 px-6 font-bold text-slate-700 w-1/4">Last Year</th>
                <th className="py-4 px-6 font-bold text-slate-700 w-1/4">Growth %</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-600 mb-1" />
                    Loading growth metrics...
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      "border-b border-slate-100 hover:bg-slate-50/80 transition-colors",
                      row.isTotal && "bg-[#5c72a6] text-white hover:bg-[#5c72a6] font-bold"
                    )}
                  >
                    <td className={cn("py-4 px-6 text-left font-medium", row.isTotal ? "text-white font-bold" : "text-slate-800")}>
                      {row.program}
                    </td>
                    <td className="py-4 px-6 font-semibold">{row.currentYear}</td>
                    <td className="py-4 px-6 font-semibold">{row.lastYear}</td>
                    <td className={cn(
                      "py-4 px-6 font-bold",
                      row.isTotal ? "text-white" : (row.isNegative ? "text-rose-500" : "text-emerald-600")
                    )}>
                      {row.growthPercent}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
