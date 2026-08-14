import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, ShieldCheck, UserCheck, GraduationCap, Award, ListFilter } from 'lucide-react';
import api from '@/api/client';

interface Coach {
  id: string;
  coachName: string;
  coachCode: string;
  designation: string;
  specialty: string;
  qualification: string;
  contactNumber: string;
  email: string;
  isActive: boolean;
}

const mockCoaches: Coach[] = [
  { id: 'c1', coachName: 'Savita Kulkarni', coachCode: 'COACH-SAVITA', designation: 'Nursery Lead Coach', specialty: 'Phonics & Speech', qualification: 'Montessori Diploma', contactNumber: '+91 98230 45678', email: 'savita.k@sunoiakids.com', isActive: true },
  { id: 'c2', coachName: 'Pratibha Patil', coachCode: 'COACH-PRATIBHA', designation: 'Play Group Coach', specialty: 'Creative Arts', qualification: 'ECCE Certified', contactNumber: '+91 90112 33455', email: 'pratibha.p@sunoiakids.com', isActive: true },
  { id: 'c3', coachName: 'Megha Deshmukh', coachCode: 'COACH-MEGHA', designation: 'SUNOIA Junior Lead', specialty: 'Early Math & Logic', qualification: 'B.Ed. Elementary', contactNumber: '+91 94228 11223', email: 'megha.d@sunoiakids.com', isActive: true },
  { id: 'c4', coachName: 'Rahul Shinde', coachCode: 'COACH-RAHUL', designation: 'PE & Sports Coach', specialty: 'Physical Development', qualification: 'B.P.Ed.', contactNumber: '+91 99887 76655', email: 'rahul.s@sunoiakids.com', isActive: true },
];

export default function CoachListPage() {
  const [data, setData] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoaches = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/franchisee/coaches');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch coaches, using fallback mock directory', err);
      setData(mockCoaches);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const columns: ColumnDef<Coach>[] = [
    {
      accessorKey: 'coachName',
      header: 'Coach Name',
      cell: ({ getValue }) => <span className="font-semibold text-slate-800 text-sm">{getValue() as string}</span>,
    },
    {
      accessorKey: 'coachCode',
      header: 'Coach Code',
      cell: ({ getValue }) => <span className="font-mono text-xs font-bold text-[#555]">{getValue() as string}</span>,
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ getValue }) => <span className="text-sm font-medium text-slate-600">{getValue() as string}</span>,
    },
    {
      accessorKey: 'specialty',
      header: 'Specialization',
      cell: ({ getValue }) => <span className="text-sm text-slate-600">{getValue() as string}</span>,
    },
    {
      accessorKey: 'qualification',
      header: 'Qualification',
      cell: ({ getValue }) => <span className="text-sm text-slate-500">{getValue() as string}</span>,
    },
    {
      accessorKey: 'contactNumber',
      header: 'Contact Number',
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ getValue }) => {
        const active = getValue() as boolean;
        return (
          <Badge className={active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}>
            {active ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coach List"
        description="View qualifications, specialities, and contact details of preschool coaches at your franchise branch"
      />

      {/* Staff Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Coaches</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{data.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Specialists</p>
              <h3 className="text-2xl font-black text-violet-600 mt-1">4</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-500">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-lime-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Montessori Trained</p>
              <h3 className="text-2xl font-black text-lime-600 mt-1">3</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-lime-50 flex items-center justify-center text-lime-500">
              <GraduationCap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b border-border/50 py-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-slate-500" />
            Coaches Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search coaches directory..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
