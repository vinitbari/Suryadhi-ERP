import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw, Loader2, Users, UserCheck, UserMinus, GraduationCap, ArrowRightLeft } from 'lucide-react';
import api from '@/api/client';
import { downloadAsPDF } from '@/lib/downloadUtils';
import { downloadAsCSV } from '@/lib/export';

interface ProgramAdmissionStat {
  program: string;
  shortName?: string;
  totalAdmissions: number;
  activeStudents: number;
  quit: number;
  transferredOut: number;
  graduated: number;
}

const defaultStats: ProgramAdmissionStat[] = [
  { program: 'Play Group', shortName: 'PG', totalAdmissions: 12, activeStudents: 12, quit: 0, transferredOut: 0, graduated: 0 },
  { program: 'Nursery', shortName: 'NUR', totalAdmissions: 24, activeStudents: 23, quit: 1, transferredOut: 0, graduated: 0 },
  { program: 'SUNOIA Junior', shortName: 'SJ', totalAdmissions: 18, activeStudents: 18, quit: 0, transferredOut: 0, graduated: 0 },
  { program: 'SUNOIA Senior', shortName: 'SS', totalAdmissions: 16, activeStudents: 15, quit: 1, transferredOut: 0, graduated: 0 },
];

export default function AdmissionCountReportPage() {
  const [data, setData] = useState<ProgramAdmissionStat[]>(defaultStats);
  const [academicYear, setAcademicYear] = useState('ay1');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmissionCount = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/reports/admission-count');
      if (res.data.success && Array.isArray(res.data.data)) {
        const mapped = res.data.data
          .filter((item: any) => {
            const pName = typeof item.program === 'string' ? item.program : (item.program?.name || '');
            return !pName.toLowerCase().includes('euro');
          })
          .map((item: any) => {
            const pName = typeof item.program === 'string' ? item.program : (item.program?.name || 'Program');
            const sName = item.shortName || (typeof item.program === 'object' ? item.program?.shortName : '');
            return {
              program: pName,
              shortName: sName,
              totalAdmissions: Number(item.totalAdmissions ?? item.total ?? 0),
              activeStudents: Number(item.activeStudents ?? item.active ?? 0),
              quit: Number(item.quit ?? 0),
              transferredOut: Number(item.transferredOut ?? item.transferOut ?? 0),
              graduated: Number(item.graduated ?? 0),
            };
          });

        if (mapped.length > 0) {
          setData(mapped);
        }
      }
    } catch (err) {
      console.warn('Failed to load admission count report', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissionCount();
  }, [academicYear]);

  const totalOverall = data.reduce((sum, d) => sum + d.totalAdmissions, 0);
  const activeOverall = data.reduce((sum, d) => sum + d.activeStudents, 0);
  const quitOverall = data.reduce((sum, d) => sum + d.quit, 0);
  const graduatedOverall = data.reduce((sum, d) => sum + d.graduated, 0);

  const handleExportPDF = () => {
    downloadAsPDF({
      title: 'Admission Count Analytics Report',
      subtitle: `Academic Year: ${academicYear === 'ay1' ? 'Apr 26 - Mar 27' : 'Apr 25 - Mar 26'} | Total Admissions: ${totalOverall}`,
      columns: ['Program', 'Total Admissions', 'Active Students', 'Quit / Drop', 'Transferred Out', 'Graduated'],
      rows: data.map((d) => [
        d.program,
        d.totalAdmissions,
        d.activeStudents,
        d.quit,
        d.transferredOut,
        d.graduated,
      ]),
      filename: 'admission-count-report',
    });
  };

  const handleExportCSV = () => {
    downloadAsCSV(data, 'admission_count_analytics.csv');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Admission Count Analytics"
        description="High-level aggregations and status distribution of student admissions across preschool programs"
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
          <Button variant="outline" size="sm" onClick={fetchAdmissionCount} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={handleExportPDF} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </PageHeader>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Admissions</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalOverall}</h3>
            </div>
            <div className="p-3 bg-blue-100/80 text-blue-700 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Active Students</p>
              <h3 className="text-2xl font-bold text-emerald-900 mt-1 font-mono">{activeOverall}</h3>
            </div>
            <div className="p-3 bg-emerald-100/80 text-emerald-700 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-rose-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Quit / Dropouts</p>
              <h3 className="text-2xl font-bold text-rose-900 mt-1 font-mono">{quitOverall}</h3>
            </div>
            <div className="p-3 bg-rose-100/80 text-rose-700 rounded-lg">
              <UserMinus className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Graduated</p>
              <h3 className="text-2xl font-bold text-indigo-900 mt-1 font-mono">{graduatedOverall}</h3>
            </div>
            <div className="p-3 bg-indigo-100/80 text-indigo-700 rounded-lg">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Breakdown Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-3.5 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-800">
            Preschool Program Breakdown
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-white text-slate-600">
            SUNOIA Curriculum
          </Badge>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase">
                <th className="py-3 px-6 font-bold">Program</th>
                <th className="py-3 px-6 font-bold text-center">Total Admissions</th>
                <th className="py-3 px-6 font-bold text-center">Active</th>
                <th className="py-3 px-6 font-bold text-center">Quit</th>
                <th className="py-3 px-6 font-bold text-center">Transferred Out</th>
                <th className="py-3 px-6 font-bold text-center">Graduated</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-600 mb-2" />
                    Loading admission counts...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                <>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-900">
                        <span className="font-semibold">{row.program}</span>
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-800">
                        {row.totalAdmissions}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono font-semibold text-emerald-700">
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-200">
                          {row.activeStudents}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono text-rose-600">
                        {row.quit > 0 ? (
                          <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-xs font-semibold">
                            {row.quit}
                          </span>
                        ) : (
                          '0'
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono text-slate-600">
                        {row.transferredOut}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono text-indigo-700">
                        {row.graduated}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <td className="py-3.5 px-6 text-slate-900 font-bold">Total</td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-900">{totalOverall}</td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-emerald-800">{activeOverall}</td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-rose-700">{quitOverall}</td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-700">{data.reduce((sum, d) => sum + d.transferredOut, 0)}</td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-indigo-800">{graduatedOverall}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No admission records found for the selected academic year.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
