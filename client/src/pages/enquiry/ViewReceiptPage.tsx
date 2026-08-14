import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menu, FileText, Plus } from 'lucide-react';

export default function ViewReceiptPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 pt-4">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">View Receipt</h1>

      <Card className="border-slate-300 shadow-sm rounded-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-white to-slate-100 border-b border-slate-300 py-3 px-4">
          <CardTitle className="text-[15px] font-bold text-slate-700 flex items-center gap-2">
            <Menu className="h-4 w-4" />
            View Advance Receipts
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 bg-[#f9f9f9]">
          <div className="p-6">
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

            <div className="border border-slate-300 rounded-sm bg-white overflow-hidden">
              <div className="bg-gradient-to-b from-[#f9f9f9] to-[#ececec] border-b border-slate-300 py-2 px-3 flex justify-between items-center">
                <div className="font-bold text-[13px] text-slate-700 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Receipts
                </div>
                <Link to={`/enquiry/${id}/receipts/add`}>
                  <Button size="sm" className="bg-[#0056b3] hover:bg-[#004494] text-white h-7 text-xs px-3 shadow-none rounded-sm flex items-center gap-1 font-semibold">
                    <Plus className="h-3.5 w-3.5" />
                    Add Receipt
                  </Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#f5f5f5] text-slate-700 font-bold border-b border-slate-300 text-[13px]">
                    <tr>
                      <th className="px-4 py-3 text-center border-r border-slate-200">Receipt Date</th>
                      <th className="px-4 py-3 text-center border-r border-slate-200">Receipt Number</th>
                      <th className="px-4 py-3 text-center border-r border-slate-200">Cheque Number</th>
                      <th className="px-4 py-3 text-center border-r border-slate-200">Cheque Date</th>
                      <th className="px-4 py-3 text-center border-r border-slate-200">Amount</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} className="h-16 bg-white border-b border-slate-200"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-[#f2f2f2] border-t border-slate-300 p-4 px-12 mt-12">
            <Button 
              onClick={() => navigate(-1)} 
              className="bg-[#333] hover:bg-[#222] text-white h-8 px-6 text-[13px] shadow-none rounded-sm font-semibold"
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
