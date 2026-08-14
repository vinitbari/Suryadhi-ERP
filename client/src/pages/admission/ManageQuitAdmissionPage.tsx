import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, ArrowDownUp, ArrowUp } from 'lucide-react';
import api from '@/api/client';

interface QuitRecord {
  id: string;
  uin: string;
  name: string;
  fatherName: string;
  program: string;
  quitDate: string;
  invoiceAmount: number;
  collectionAmount: number;
}

export default function ManageQuitAdmissionPage() {
  const [data, setData] = useState<QuitRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('not-converted');

  useEffect(() => {
    api.get('/quit/list')
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data.map((q: any) => ({
            id: q.id,
            uin: q.admission?.student?.uin || 'N/A',
            name: `${q.admission?.student?.firstName || ''} ${q.admission?.student?.lastName || ''}`.trim(),
            fatherName: 'N/A',
            program: q.admission?.program?.name || 'N/A',
            quitDate: q.quitDate ? new Date(q.quitDate).toLocaleDateString('en-GB') : 'N/A',
            invoiceAmount: 0,
            collectionAmount: 0,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.uin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-2 space-y-4">
      <h1 className="text-[24px] font-normal text-[#333] mb-4">Manage Quit Admission</h1>

      <div className="bg-white border border-[#ccc] shadow-sm">
        <div className="p-3 border-b border-[#ccc] space-y-3">
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

          <div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="h-[30px] w-[150px] border-[#ccc] rounded-sm text-[13px] px-2 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="not-converted">Not Converted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-[#f9f9f9]">
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[12%]">
                  <div className="flex items-center justify-between">UIN <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[15%]">
                  <div className="flex items-center justify-between">Name <ArrowUp className="w-3 h-3 text-[#666]" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">
                  <div className="flex items-center justify-between">Father's Name <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">
                  <div className="flex items-center justify-between">Program taken <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[13%]">
                  <div className="flex items-center justify-between">Quit date <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">Invoice amount</th>
                <th className="py-2.5 px-3 border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">Collection amount</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="py-4 text-center text-[13px] text-[#666]">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-4 text-center text-[13px] text-[#333] border-b border-[#ccc]">No data available in table</td></tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'}>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333] text-center">{row.uin}</td>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333]">{row.name}</td>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333] text-center">{row.fatherName}</td>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333] text-center">{row.program}</td>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333] text-center">{row.quitDate}</td>
                    <td className="py-2.5 px-3 border-r border-b border-[#eee] text-[13px] text-[#333] text-center">₹{row.invoiceAmount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 border-b border-[#eee] text-[13px] text-[#333] text-center">₹{row.collectionAmount.toLocaleString()}</td>
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
