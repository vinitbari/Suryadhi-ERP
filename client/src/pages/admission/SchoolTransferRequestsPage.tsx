import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, ArrowDownUp, ArrowUp } from 'lucide-react';
import api from '@/api/client';

interface TransferRecord {
  id: string;
  studentName: string;
  fromSchool: string;
  toSchool: string;
  transferDate: string;
  programName: string;
  status: string;
}

export default function SchoolTransferRequestsPage() {
  const [data, setData] = useState<TransferRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/transfers/requests')
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data.map((t: any) => ({
            id: t.id,
            studentName: `${t.admission?.student?.firstName || ''} ${t.admission?.student?.lastName || ''}`.trim(),
            fromSchool: t.fromSchoolName || 'N/A',
            toSchool: t.toSchoolName || 'N/A',
            transferDate: t.transferDate ? new Date(t.transferDate).toLocaleDateString('en-GB') : 'N/A',
            programName: t.admission?.program?.name || 'N/A',
            status: t.status || 'REQUESTED',
          })));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = data.filter((d) =>
    d.studentName.toLowerCase().includes(search.toLowerCase()) ||
    d.toSchool.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-2 space-y-4">
      <h1 className="text-[24px] font-normal text-[#333] mb-4">School Transfer Requests</h1>

      <div className="bg-white border border-[#ccc] shadow-sm">
        <div className="p-3 border-b border-[#ccc]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#f9f9f9] border border-[#ccc] p-1.5 rounded-sm">
                <Grid className="w-4 h-4 text-slate-600" />
              </div>
              <label className="text-[13px] text-slate-600 flex items-center gap-2">
                Search:
                <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="h-[30px] w-[200px] border-[#ccc] rounded-sm text-[13px] px-2" />
              </label>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              Show
              <Select defaultValue="10">
                <SelectTrigger className="h-[30px] w-[60px] border-[#ccc] rounded-sm text-[13px] px-2 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              entries
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-[#f9f9f9]">
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[18%]">
                  <div className="flex items-center justify-between">Student Name <ArrowUp className="w-3 h-3 text-[#666]" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">
                  <div className="flex items-center justify-between">From School <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">
                  <div className="flex items-center justify-between">To School <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">
                  <div className="flex items-center justify-between">Transfer Out Date <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[12%]">
                  <div className="flex items-center justify-between">Program Name <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[10%]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-4 text-center text-[13px] text-[#666]">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-4 text-center text-[13px] text-[#333] border-b border-[#ccc]">No data available in table</td></tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'}>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333]">{row.studentName}</td>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333] text-center">{row.fromSchool}</td>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333] text-center">{row.toSchool}</td>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333] text-center">{row.transferDate}</td>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333] text-center">{row.programName}</td>
                    <td className="py-2.5 px-3 border-b border-[#eee] text-[13px] text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${row.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : row.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#f9f9f9] p-3 flex justify-center border-t border-[#ccc]">
          <div className="flex border border-[#ccc] rounded-sm overflow-hidden text-[13px]">
            <button className="px-3 py-1.5 text-[#999] bg-[#f9f9f9] border-r border-[#ccc] cursor-not-allowed">First</button>
            <button className="px-3 py-1.5 text-[#999] bg-[#f9f9f9] border-r border-[#ccc] cursor-not-allowed">← Previous</button>
            <button className="px-3 py-1.5 text-[#999] bg-[#f9f9f9] border-r border-[#ccc] cursor-not-allowed">Next →</button>
            <button className="px-3 py-1.5 text-[#337ab7] bg-white cursor-pointer hover:bg-[#eee]">Last</button>
          </div>
        </div>
      </div>
    </div>
  );
}
