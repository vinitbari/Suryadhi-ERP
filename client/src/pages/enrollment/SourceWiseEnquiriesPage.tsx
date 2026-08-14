import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import api from '@/api/client';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

export default function SourceWiseEnquiriesPage() {
  const [academicYear, setAcademicYear] = useState('ay1');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/dashboard/enrollment-analytics');
        if (res.data.success && res.data.data.sourceWiseEnquiries) {
          setData(res.data.data.sourceWiseEnquiries);
        }
      } catch (err) {
        console.error('Failed to fetch source wise enquiries', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [academicYear]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Source Wise Enquiries"
        description="Analyze lead generation by source channels"
      >
        <div className="flex items-center gap-3">
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ay1">Apr 26 - Mar 27</SelectItem>
              <SelectItem value="ay0">Apr 25 - Mar 26</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </PageHeader>

      <Card className="overflow-hidden border-0 shadow-sm max-w-5xl mx-auto">
        <div className="bg-[#243c84] text-white text-center py-4 font-semibold text-lg rounded-t-xl">
          Source Wise Enquiries AY 26-27
        </div>
        <div className="bg-white border border-t-0 border-slate-200 rounded-b-xl overflow-x-auto min-h-[200px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-6 text-left font-bold text-slate-700">Program</th>
                  <th className="py-4 px-6 font-bold text-slate-700">Walkin</th>
                  <th className="py-4 px-6 font-bold text-slate-700">Gate App</th>
                  <th className="py-4 px-6 font-bold text-slate-700">Digital</th>
                  <th className="py-4 px-6 font-bold text-slate-700">BVN</th>
                  <th className="py-4 px-6 font-bold text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr 
                    key={row.program} 
                    className={cn(
                      "border-b border-slate-100 last:border-0",
                      row.isTotal && "bg-[#f0f4ff] font-bold border-t border-slate-200"
                    )}
                  >
                    <td className="py-4 px-6 text-left font-semibold text-[#243c84]">
                      {row.program}
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      {row.walkin}
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      {row.gateApp}
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      {row.digital}
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      {row.bvn}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#243c84]">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
