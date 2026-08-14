import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function AddReceiptPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 pt-4">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Advance Receipt</h1>

      <Card className="border-slate-300 shadow-sm rounded-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-white to-slate-100 border-b border-slate-300 py-3 px-4">
          <CardTitle className="text-[15px] font-bold text-slate-700 flex items-center gap-2">
            <Menu className="h-4 w-4" />
            Advance Receipt
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 bg-[#f9f9f9]">
          <div className="p-6 pb-2">
            <div className="grid grid-cols-2 gap-4 mb-8 text-[13px] text-slate-800 px-8">
              <div className="flex gap-12">
                <span className="font-normal text-slate-600">Student Name</span>
                <span className="font-medium"></span>
              </div>
              <div className="flex gap-6">
                <span className="font-normal text-slate-600">Program</span>
                <span className="font-medium">Nursery</span>
              </div>
            </div>

            <div className="border border-slate-300 rounded-sm bg-white overflow-hidden mb-6">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#f5f5f5] text-slate-700 font-bold border-b border-slate-300 text-[13px]">
                  <tr>
                    <th className="px-6 py-3 w-1/3 border-r border-slate-200 text-center">Fee Types</th>
                    <th className="px-6 py-3 w-2/3 text-center">Receipt Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 bg-white">
                    <td className="px-6 py-4 text-center font-normal text-[13px] text-slate-700 border-r border-slate-200">Admission Forms</td>
                    <td className="px-6 py-3">
                      <Input defaultValue="0" className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 mb-8">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal text-slate-600">Receipt Date</Label>
                <Input type="date" className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm block w-full" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-normal text-slate-600">Mode of Payment</Label>
                <Select defaultValue="cash">
                  <SelectTrigger className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm w-full">
                    <SelectValue placeholder="Select Payment Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="online">Online Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          <div className="bg-[#f2f2f2] border-t border-slate-300 p-4 px-12 mt-4 flex gap-2">
            <Button 
              className="bg-[#0056b3] hover:bg-[#004494] text-white h-8 px-6 text-[13px] shadow-none rounded-sm font-semibold"
            >
              Save
            </Button>
            <Button 
              onClick={() => navigate(-1)} 
              className="bg-[#333] hover:bg-[#222] text-white h-8 px-6 text-[13px] shadow-none rounded-sm font-semibold"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
