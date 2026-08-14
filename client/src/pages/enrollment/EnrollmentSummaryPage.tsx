import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import api from '@/api/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, Users, UserPlus, UserCheck } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';

export default function EnrollmentSummaryPage() {
  const [academicYear, setAcademicYear] = useState('ay1');
  const [data, setData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [summaryRes, analyticsRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/dashboard/enrollment-analytics')
        ]);
        if (summaryRes.data.success) setData(summaryRes.data.data);
        if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      } catch (error) {
        console.warn('Dashboard API failed', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalEnquiries = data?.kpis?.enquiries || 0;
  const totalAdmissions = data?.kpis?.grossAdmission || 0;
  const conversionRate = totalEnquiries > 0 ? ((totalAdmissions / totalEnquiries) * 100).toFixed(1) : 0;
  const activeStudents = data?.kpis?.activeAdmissions || 0;

  // Format data for chart
  const conversionData = analytics?.enrollmentTrend?.map((item: any) => ({
    name: item.month,
    enquiries: item.enquiries || item.count, // fallback for now
    admissions: item.count,
  })) || [];

  const sourceData = analytics?.enquiryByStage?.map((item: any) => ({
    name: item.stage.replace(/_/g, ' '),
    count: item.count
  })) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollment Summary"
        description="Comprehensive analysis of enquiries, admissions, and conversion rates"
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

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Enquiries" value={totalEnquiries} icon={Users} color="blue" />
        <StatCard title="Total Admissions" value={totalAdmissions} icon={UserPlus} color="green" />
        <StatCard title="Overall Conversion" value={`${conversionRate}%`} icon={TrendingUp} color="violet" progressPercent={Number(conversionRate)} />
        <StatCard title="Active Students" value={activeStudents} icon={UserCheck} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiry vs Admission Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enquiries vs Admissions Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {conversionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEnq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="enquiries" name="Enquiries" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorEnq)" />
                    <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAdm)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No trend data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Source Wise Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enquiry Stage Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {sourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                    <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={100} />
                    <RechartsTooltip 
                      cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No stage data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
