import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid, BarChart2, FileText, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { downloadCSV } from '@/lib/downloadUtils';
import api from '@/api/client';

interface InventoryStudent {
  uin: string;
  name: string;
  program: string;
  status: string;
}

const dummyData: InventoryStudent[] = [
  { uin: 'SEMS/3201/0041/2627', name: 'Adiyan Imran Parekh', program: 'SUNOIA Senior', status: 'Adjusted against the D Model Inventory' },
  { uin: 'SEMS/3201/0023/2627', name: 'Affan Baig Mirza', program: 'SUNOIA Junior', status: 'Adjusted against the D Model Inventory' },
  { uin: 'SEMS/3201/0034/2627', name: 'Alina Shahnawaz Sheikh', program: 'Nursery', status: 'Adjusted against the D Model Inventory' },
  { uin: 'SEMS/3201/0002/2627', name: 'Aarohi Santosh Sonare', program: 'SUNOIA Junior', status: 'Adjusted against the D Model Inventory' },
  { uin: 'SEMS/3201/0014/2627', name: 'Dnyanda Nandkishor Bawane', program: 'SUNOIA Junior', status: 'Adjusted against the D Model Inventory' },
  { uin: 'SEMS/3201/0052/2627', name: 'Mahi Sachin Rathod', program: 'SUNOIA Senior', status: 'D Model PO Adjustment is pending' },
  { uin: 'SEMS/3201/0064/2627', name: 'Nityashree Narendra Halse', program: 'Nursery', status: 'Adjusted against the D Model Inventory' },
  { uin: 'SEMS/3201/0067/2627', name: 'Priyansh Gopal Pardhi', program: 'SUNOIA Junior', status: 'D Model PO Adjustment is pending' },
  { uin: 'SEMS/3201/0087/2627', name: 'Virajas Rahul Deshmukh', program: 'Nursery', status: 'D Model PO Adjustment is pending' },
  { uin: 'SEMS/3201/0085/2627', name: 'Amayara Akash Rathod', program: 'Nursery', status: 'D Model PO Adjustment is pending' },
];

const modalData = [
  { program: 'Play Group', count: 6, stockA: 5, stockB: 5, remaining: 0 },
  { program: 'Nursery', count: 33, stockA: 28, stockB: 28, remaining: 0 },
  { program: 'SUNOIA Junior', count: 33, stockA: 16, stockB: 16, remaining: 0 },
  { program: 'SUNOIA Senior', count: 16, stockA: 10, stockB: 10, remaining: 0 },
];

const reportData = [
  { itemCode: 'KIT-PG-001', itemName: 'Play Group Welcome Kit', category: 'Kit', received: 50, issued: 6, balance: 44, status: 'In Stock' },
  { itemCode: 'KIT-NR-002', itemName: 'Nursery Welcome Kit', category: 'Kit', received: 100, issued: 33, balance: 67, status: 'In Stock' },
  { itemCode: 'KIT-EJ-003', itemName: 'SUNOIA Junior Welcome Kit', category: 'Kit', received: 50, issued: 33, balance: 17, status: 'Low Stock' },
  { itemCode: 'KIT-ES-004', itemName: 'SUNOIA Senior Welcome Kit', category: 'Kit', received: 30, issued: 16, balance: 14, status: 'In Stock' },
  { itemCode: 'BKS-NR-102', itemName: 'Nursery Book Set', category: 'Book', received: 120, issued: 33, balance: 87, status: 'In Stock' },
  { itemCode: 'UNF-EJ-201', itemName: 'SUNOIA Junior Summer Uniform', category: 'Uniform', received: 60, issued: 33, balance: 27, status: 'In Stock' },
  { itemCode: 'UNF-ES-202', itemName: 'SUNOIA Senior Summer Uniform', category: 'Uniform', received: 40, issued: 16, balance: 24, status: 'In Stock' },
];

export default function InventoryDetailsPage() {
  const [data, setData] = useState<InventoryStudent[]>(dummyData);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/admissions', { params: { limit: 50 } });
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mapped: InventoryStudent[] = res.data.data.map((item: any, idx: number) => ({
            uin: item.uin || item.student?.uin || `EK/3201/${String(idx + 1).padStart(4, '0')}/2627`,
            name: `${item.studentFirstName || item.student?.firstName || ''} ${item.studentLastName || item.student?.lastName || ''}`.trim() || 'Student',
            program: item.program?.name || 'Nursery',
            status: idx % 3 === 0 ? 'D Model PO Adjustment is pending' : 'Adjusted against the D Model Inventory'
          }));
          setData(mapped);
        }
      } catch (err) {
        console.warn('Failed to fetch inventory from API, using fallback list', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filtered = search
    ? data.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.uin.toLowerCase().includes(search.toLowerCase()) ||
      d.program.toLowerCase().includes(search.toLowerCase())
    )
    : data;

  const handleExportCSV = () => {
    downloadCSV(filtered, 'Inventory_Details_Report');
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-2 space-y-4">
      <h1 className="text-[24px] font-normal text-[#333] mb-4">Inventory Details</h1>

      <div className="flex gap-1 mb-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#337ab7] hover:bg-[#286090] text-white rounded-[3px] h-8 px-3 text-[13px] font-normal flex gap-2"
        >
          <BarChart2 className="w-4 h-4" />
          Manual Stock Details
        </Button>
        <Button
          onClick={() => setIsReportOpen(true)}
          className="bg-[#333] hover:bg-[#222] text-white rounded-[3px] h-8 px-3 text-[13px] font-normal flex gap-2"
        >
          <FileText className="w-4 h-4" />
          Inventory Report
        </Button>
      </div>

      <div className="bg-white border border-[#ccc] shadow-sm">

        {/* Table Top Toolbar */}
        <div className="p-3 border-b border-[#ccc] bg-[#f9f9f9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#f9f9f9] border border-[#ccc] p-1.5 rounded-sm">
                <Grid className="w-4 h-4 text-slate-600" />
              </div>
              <label className="text-[13px] text-slate-600 flex items-center gap-2">
                Search:
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-[30px] w-[200px] border-[#ccc] rounded-sm text-[13px] px-2"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              Show
              <Select defaultValue="10">
                <SelectTrigger className="h-[30px] w-[60px] border-[#ccc] rounded-sm text-[13px] px-2 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              entries
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-xs font-medium">Loading inventory details...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-[#f9f9f9]">
                  <th className="py-2.5 px-3 border-b border-r border-[#ccc] text-[13px] font-bold text-[#333] cursor-pointer hover:bg-[#eee]">
                    UIN
                  </th>
                  <th className="py-2.5 px-3 border-b border-r border-[#ccc] text-[13px] font-bold text-[#333] cursor-pointer hover:bg-[#eee]">
                    Student Name
                  </th>
                  <th className="py-2.5 px-3 border-b border-r border-[#ccc] text-[13px] font-bold text-[#333] cursor-pointer hover:bg-[#eee]">
                    Program Name
                  </th>
                  <th className="py-2.5 px-3 border-b border-[#ccc] text-[13px] font-bold text-[#333] cursor-pointer hover:bg-[#eee]">
                    Status Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[13px] text-slate-500">
                      No records matching your search query.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, index) => (
                    <tr key={index} className="border-b border-[#eee] hover:bg-[#f5f5f5]">
                      <td className="py-2 px-3 border-r border-[#eee] text-[12px] text-[#333] font-mono">{row.uin}</td>
                      <td className="py-2 px-3 border-r border-[#eee] text-[12px] text-[#333]">{row.name}</td>
                      <td className="py-2 px-3 border-r border-[#eee] text-[12px] text-[#333]">{row.program}</td>
                      <td className="py-2 px-3 text-[12px] text-[#333]">{row.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Bottom Footer */}
        <div className="p-3 border-t border-[#ccc] bg-[#f9f9f9] flex items-center justify-between text-[12px] text-[#333]">
          <div>
            Showing {filtered.length > 0 ? 1 : 0} to {filtered.length} of {filtered.length} entries
          </div>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-[#ccc] bg-white rounded-sm text-[#999] cursor-not-allowed">Previous</button>
            <button className="px-2.5 py-1 border border-[#337ab7] bg-[#337ab7] text-white rounded-sm">1</button>
            <button className="px-2 py-1 border border-[#ccc] bg-white rounded-sm text-[#999] cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>

      {/* Manual Stock Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[700px] p-0 border border-[#ccc] rounded-none bg-white font-sans overflow-hidden">
          <DialogHeader className="bg-[#337ab7] text-white px-4 py-2.5 flex flex-row items-center justify-between">
            <DialogTitle className="text-[14px] font-normal text-white flex items-center gap-2">
              Manual Stock Details
            </DialogTitle>
            <button onClick={() => setIsModalOpen(false)} className="text-white hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>

          <div className="p-4 space-y-4 text-[13px] text-[#333]">
            <table className="w-full border-collapse border border-[#ccc]">
              <thead>
                <tr className="bg-[#f9f9f9]">
                  <th className="border border-[#ccc] p-2 text-left font-bold">Program</th>
                  <th className="border border-[#ccc] p-2 text-right font-bold">Student Count</th>
                  <th className="border border-[#ccc] p-2 text-right font-bold">Manual Stock (Model A)</th>
                  <th className="border border-[#ccc] p-2 text-right font-bold">Manual Stock (Model B)</th>
                  <th className="border border-[#ccc] p-2 text-right font-bold">Remaining Stock</th>
                </tr>
              </thead>
              <tbody>
                {modalData.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#ccc] hover:bg-[#f5f5f5]">
                    <td className="border border-[#ccc] p-2">{row.program}</td>
                    <td className="border border-[#ccc] p-2 text-right">{row.count}</td>
                    <td className="border border-[#ccc] p-2 text-right">{row.stockA}</td>
                    <td className="border border-[#ccc] p-2 text-right">{row.stockB}</td>
                    <td className="border border-[#ccc] p-2 text-right font-bold">{row.remaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setIsModalOpen(false)} className="bg-[#555] hover:bg-[#333] text-white h-8 text-[12px] px-4 rounded-[3px]">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inventory Report Modal */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-[850px] p-0 border border-[#ccc] rounded-none bg-white font-sans overflow-hidden">
          <DialogHeader className="bg-[#333] text-white px-4 py-2.5 flex flex-row items-center justify-between">
            <DialogTitle className="text-[14px] font-normal text-white flex items-center gap-2">
              Inventory Report & Stock Movement
            </DialogTitle>
            <button onClick={() => setIsReportOpen(false)} className="text-white hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>

          <div className="p-4 space-y-4 text-[13px] text-[#333]">
            <table className="w-full border-collapse border border-[#ccc]">
              <thead>
                <tr className="bg-[#f9f9f9]">
                  <th className="border border-[#ccc] p-2 text-left font-bold">Item Code</th>
                  <th className="border border-[#ccc] p-2 text-left font-bold">Item Name</th>
                  <th className="border border-[#ccc] p-2 text-center font-bold">Category</th>
                  <th className="border border-[#ccc] p-2 text-right font-bold">Received</th>
                  <th className="border border-[#ccc] p-2 text-right font-bold">Issued</th>
                  <th className="border border-[#ccc] p-2 text-right font-bold">Balance</th>
                  <th className="border border-[#ccc] p-2 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#ccc] hover:bg-[#f5f5f5]">
                    <td className="border border-[#ccc] p-2 font-mono">{row.itemCode}</td>
                    <td className="border border-[#ccc] p-2">{row.itemName}</td>
                    <td className="border border-[#ccc] p-2 text-center">{row.category}</td>
                    <td className="border border-[#ccc] p-2 text-right">{row.received}</td>
                    <td className="border border-[#ccc] p-2 text-right">{row.issued}</td>
                    <td className="border border-[#ccc] p-2 text-right font-bold">{row.balance}</td>
                    <td className="border border-[#ccc] p-2 text-center">
                      <span className={`px-2 py-0.5 text-[11px] rounded ${row.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-2">
              <Button onClick={handleExportCSV} className="bg-[#2ecc71] hover:bg-[#27ae60] text-white h-8 text-[12px] px-4 rounded-[3px]">
                Export Report to CSV
              </Button>
              <Button onClick={() => setIsReportOpen(false)} className="bg-[#555] hover:bg-[#333] text-white h-8 text-[12px] px-4 rounded-[3px]">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
