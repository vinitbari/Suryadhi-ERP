import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export default function ExchangeOrdersPage() {
  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-2 space-y-4">
      <h1 className="text-[24px] font-normal text-[#333] mb-2">Exchange Orders</h1>
      
      <Button className="bg-[#0056b3] hover:bg-[#004494] text-white rounded-[3px] h-8 px-4 text-[13px] font-normal flex gap-1.5 items-center shadow-sm mb-4">
        <Pencil className="w-3.5 h-3.5 fill-white" /> Add
      </Button>
      
      <div className="bg-white border border-[#ccc] shadow-sm">
        
        {/* Table Top Toolbar */}
        <div className="p-3 border-b border-[#ccc] bg-[#f9f9f9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-slate-600 flex items-center gap-2">
                Search:
                <Input type="text" className="h-[30px] w-[200px] border-[#ccc] rounded-sm text-[13px] px-2 bg-white" />
              </label>
            </div>
            
            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              Show 
              <Select defaultValue="25">
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
          <table className="w-full text-center border-collapse min-w-max">
            <thead>
              <tr className="bg-[#f9f9f9]">
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[18%]">
                  Exchange Number
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[18%]">
                  PO Number
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[18%]">
                  LR Number
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[18%]">
                  Report Date
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[15%]">
                  Status
                </th>
                <th className="py-2.5 px-3 border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[13%]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="py-4 text-center text-[13px] text-[#333] border-b border-[#ccc]">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-[#f9f9f9] p-3 flex justify-center border-t border-[#ccc]">
          <div className="flex border border-[#ccc] rounded-sm overflow-hidden text-[13px] shadow-sm">
            <button className="px-3 py-1.5 text-[#999] bg-[#f9f9f9] border-r border-[#ccc] cursor-not-allowed">First</button>
            <button className="px-3 py-1.5 text-[#999] bg-[#f9f9f9] border-r border-[#ccc] cursor-not-allowed">&larr; Previous</button>
            <button className="px-3 py-1.5 text-[#999] bg-[#f9f9f9] border-r border-[#ccc] cursor-not-allowed">Next &rarr;</button>
            <button className="px-3 py-1.5 text-[#337ab7] bg-white cursor-pointer hover:bg-[#eee]">Last</button>
          </div>
        </div>

      </div>
    </div>
  );
}
