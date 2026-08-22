import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menu, FileText, Plus, Download, Loader2 } from 'lucide-react';
import api from '@/api/client';
import { downloadAsPDF } from '@/lib/downloadUtils';

interface AdvanceReceiptRow {
  id: string;
  receiptDate: string;
  receiptNumber: string;
  chequeNumber?: string;
  chequeDate?: string;
  amount: number;
  paymentMode?: string;
  bankName?: string;
}

export default function ViewReceiptPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [studentName, setStudentName] = useState('');
  const [programName, setProgramName] = useState('Nursery');
  const [receipts, setReceipts] = useState<AdvanceReceiptRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadEnquiryAndReceipts = async () => {
      setIsLoading(true);
      try {
        const [enquiryRes, receiptsRes] = await Promise.allSettled([
          api.get(`/enquiries/${id}`),
          api.get(`/enquiries/${id}/receipts`),
        ]);

        if (enquiryRes.status === 'fulfilled' && enquiryRes.value.data.success) {
          const eq = enquiryRes.value.data.data;
          const s = eq.student;
          const sName = s ? `${s.firstName || ''} ${s.lastName || ''}`.trim() : eq.enquirerName || '';
          setStudentName(sName);
          setProgramName(eq.program?.name || 'Nursery');

          if (Array.isArray(eq.advanceReceipts) && eq.advanceReceipts.length > 0) {
            setReceipts(eq.advanceReceipts);
          }
        }

        if (receiptsRes.status === 'fulfilled' && receiptsRes.value.data.success && Array.isArray(receiptsRes.value.data.data)) {
          setReceipts(receiptsRes.value.data.data);
        }
      } catch (err) {
        console.warn('Failed to load enquiry receipts data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnquiryAndReceipts();
  }, [id]);

  const handlePrintReceipt = (r: AdvanceReceiptRow) => {
    downloadAsPDF({
      title: 'Advance Fee Receipt',
      subtitle: `Student: ${studentName || 'Student'} | Program: ${programName} | Receipt No: ${r.receiptNumber}`,
      columns: ['Field', 'Details'],
      rows: [
        ['Receipt Number', r.receiptNumber || 'N/A'],
        ['Receipt Date', r.receiptDate ? new Date(r.receiptDate).toLocaleDateString() : 'N/A'],
        ['Student Name', studentName || 'N/A'],
        ['Program', programName],
        ['Payment Mode', r.paymentMode || 'CASH'],
        ['Cheque Number', r.chequeNumber || 'N/A'],
        ['Cheque Date', r.chequeDate ? new Date(r.chequeDate).toLocaleDateString() : 'N/A'],
        ['Amount Paid (Rs.)', `INR ${Number(r.amount).toLocaleString('en-IN')}`],
      ],
      filename: `receipt_${r.receiptNumber || id}`,
    });
  };

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
                <span className="font-medium">{isLoading ? 'Loading...' : studentName}</span>
              </div>
              <div className="flex gap-6">
                <span className="font-normal text-slate-600">Program</span>
                <span className="font-medium">{isLoading ? 'Loading...' : programName}</span>
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
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 bg-white">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto text-blue-600 mb-1.5" />
                          Loading advance receipts...
                        </td>
                      </tr>
                    ) : receipts.length > 0 ? (
                      receipts.map((r, idx) => (
                        <tr key={r.id || idx} className="border-b border-slate-200 hover:bg-slate-50 text-[13px]">
                          <td className="px-4 py-3 text-center text-slate-700 font-medium">
                            {r.receiptDate ? new Date(r.receiptDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-center font-mono font-bold text-blue-700">
                            {r.receiptNumber || `SK/3201/REC/${String(idx + 1).padStart(4, '0')}`}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-slate-600">
                            {r.chequeNumber || '-'}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600">
                            {r.chequeDate ? new Date(r.chequeDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-center font-mono font-bold text-emerald-700">
                            ₹{Number(r.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrintReceipt(r)}
                              className="h-7 text-xs px-2.5 text-blue-700 hover:bg-blue-50 border-blue-200"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Print
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="h-16 bg-white border-b border-slate-200 text-center text-slate-400 text-xs py-6">
                          No receipts recorded for this enquiry yet.
                        </td>
                      </tr>
                    )}
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
