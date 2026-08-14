import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, Search, Plus } from 'lucide-react';

export default function AdvanceReceiptFormPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'main' | 'status' | 'new' | 'other'>('main');

  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-2 space-y-4">
      {activeTab === 'main' && <MainView onNavigate={setActiveTab} onBack={() => navigate('/admission')} />}
      {activeTab === 'status' && <PaymentStatusView onBack={() => setActiveTab('main')} />}
      {activeTab === 'new' && <NewReceiptView onBack={() => setActiveTab('main')} />}
      {activeTab === 'other' && <OtherReceiptView onBack={() => setActiveTab('main')} />}
    </div>
  );
}

// ─── 1. MAIN VIEW ─────────────────────────────────────────────────────────
function MainView({ onNavigate, onBack }: { onNavigate: (tab: any) => void, onBack: () => void }) {
  return (
    <>
      <h1 className="text-2xl font-normal text-slate-800 mb-4">View Receipt</h1>
      <div className="bg-white border border-slate-300 shadow-sm rounded-sm p-4">
        
        {/* Header grey bar */}
        <div className="bg-[#f2f2f2] px-4 py-2 border border-slate-300 border-b-0 rounded-t-sm flex items-center">
          <span className="font-semibold text-[13px] text-slate-700">≡ View Receipts</span>
        </div>
        
        <div className="border border-slate-300 p-6 space-y-8">
          
          {/* Summary Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6">
            <div className="grid grid-cols-[120px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Student Name</span>
              <span className="text-slate-800">Mahi Sachin Rathod</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Program</span>
              <span className="text-slate-800">SUNOIA Senior</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Invoice Number</span>
              <span className="text-slate-800">EK/3201/0052/2027</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Amount Term 1</span>
              <span className="text-slate-800">20250.00</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Amount Term 2</span>
              <span className="text-slate-800">9200.00</span>
            </div>
            <div></div>

            <div className="grid grid-cols-[120px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Total Amount</span>
              <span className="text-slate-800">29450.00</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Amount Received</span>
              <span className="text-slate-800">0.00</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Balance Amount</span>
              <span className="text-slate-800">29450.00</span>
            </div>
          </div>

          {/* Buttons inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input placeholder="Online Amount" className="w-[180px] h-8 text-[13px] border-slate-300 rounded-sm" />
              <Button className="bg-[#0056b3] hover:bg-[#004494] text-white h-8 px-4 text-[13px] shadow-none rounded-sm">
                Generate Link
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Input placeholder="Paytm POS Amount" className="w-[180px] h-8 text-[13px] border-slate-300 rounded-sm" />
              <Button className="bg-[#0056b3] hover:bg-[#004494] text-white h-8 px-4 text-[13px] shadow-none rounded-sm">
                Paytm POS Payment
              </Button>
            </div>
          </div>

          {/* Receipts Table Section */}
          <div className="border border-slate-300 rounded-sm">
            <div className="bg-[#f2f2f2] px-4 py-2 border-b border-slate-300 flex items-center justify-between">
              <span className="font-semibold text-[13px] text-slate-700">Receipts</span>
              <div className="flex gap-1">
                <Button onClick={() => onNavigate('status')} className="bg-[#0056b3] hover:bg-[#004494] text-white h-7 px-3 text-[12px] shadow-none rounded-sm">
                  <Search className="w-3 h-3 mr-1" /> View Payment Status
                </Button>
                <Button onClick={() => onNavigate('new')} className="bg-[#0056b3] hover:bg-[#004494] text-white h-7 px-3 text-[12px] shadow-none rounded-sm">
                  <Plus className="w-3 h-3 mr-1" /> Add Receipt
                </Button>
                <Button onClick={() => onNavigate('other')} className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white h-7 px-3 text-[12px] shadow-none rounded-sm border border-[#eea236]">
                  <Plus className="w-3 h-3 mr-1" /> Add Other Receipt
                </Button>
              </div>
            </div>
            <div className="p-4 bg-[#f9f9f9]">
              <table className="w-full border-collapse border border-slate-300 text-[13px]">
                <thead>
                  <tr className="bg-[#f2f2f2]">
                    <th className="border border-slate-300 p-2 text-slate-700 font-semibold">Receipt Date</th>
                    <th className="border border-slate-300 p-2 text-slate-700 font-semibold">Receipt Number</th>
                    <th className="border border-slate-300 p-2 text-slate-700 font-semibold">Bank Name</th>
                    <th className="border border-slate-300 p-2 text-slate-700 font-semibold">Cheque Number</th>
                    <th className="border border-slate-300 p-2 text-slate-700 font-semibold">Cheque Date</th>
                    <th className="border border-slate-300 p-2 text-slate-700 font-semibold">Amount</th>
                    <th className="border border-slate-300 p-2 text-slate-700 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state */}
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-500 bg-white border border-slate-300">No data available in table</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="bg-[#f2f2f2] px-6 py-4 border border-slate-300 border-t-0 rounded-b-sm">
          <Button onClick={onBack} className="bg-[#333] hover:bg-[#222] text-white h-8 px-6 text-[13px] shadow-none rounded-sm">
            Back
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── 2. PAYMENT STATUS VIEW ────────────────────────────────────────────────
function PaymentStatusView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div className="bg-white border border-slate-300 shadow-sm rounded-sm">
        <div className="bg-[#f2f2f2] px-4 py-2 border-b border-slate-300">
          <span className="font-semibold text-[13px] text-slate-700">≡ Parent Payment Status</span>
        </div>
        
        <div className="p-4">
          <h3 className="text-[11px] font-bold text-slate-800 mb-2 uppercase">Student details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 mb-6 text-[12px]">
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Student Name</span>
              <span className="text-slate-800 font-medium">Mahi Sachin Rathod</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">UIN</span>
              <span className="text-slate-800 font-medium">EK3201/0052/2027</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Father Name</span>
              <span className="text-slate-800 font-medium">Sachin Chavhan</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Mother Name</span>
              <span className="text-slate-800 font-medium">Swati Sachin Rathod</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Mobile</span>
              <span className="text-slate-800 font-medium">7721038204</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Mobile</span>
              <span className="text-slate-800 font-medium">7721038088</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Email</span>
              <span className="text-slate-800 font-medium">sachinrathod1411@gmail.com</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Student Address</span>
              <span className="text-slate-800 font-medium">Arni</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Academic Year</span>
              <span className="text-slate-800 font-medium">Apr 26 - Mar 27</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Program</span>
              <span className="text-slate-800 font-medium">SUNOIA Senior</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Franchisee Code</span>
              <span className="text-slate-800 font-medium">EK Yavatmal-Arni</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Franchisee Address</span>
              <span className="text-slate-800 font-medium line-clamp-1">Mohanlal Mangal Karyalay, Yavatmal road in front of forest office...</span>
            </div>
          </div>

          <h3 className="text-[11px] font-bold text-slate-800 mb-2 uppercase">Student Payment details</h3>
          
          <div className="space-y-2 mb-4">
            {/* Term 1 Accordion */}
            <div className="border border-slate-300 rounded-sm">
              <div className="bg-[#f9f9f9] px-4 py-2 flex justify-between items-center cursor-pointer">
                <span className="font-semibold text-[13px] text-slate-700">Term 1</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-4 bg-white border-t border-slate-300">
                <div className="flex justify-between text-[13px] mb-4">
                  <div>Amount Term 1: <span className="font-bold">20250</span></div>
                  <div>Balance Amount Term 1: <span className="font-bold">20250</span></div>
                </div>
                <table className="w-full text-center text-[12px] border border-slate-300">
                  <thead className="bg-[#f2f2f2]">
                    <tr>
                      <th className="p-2 border border-slate-300 font-semibold">Fee Type</th>
                      <th className="p-2 border border-slate-300 font-semibold">Receivable Amount</th>
                      <th className="p-2 border border-slate-300 font-semibold">Received Till Date</th>
                      <th className="p-2 border border-slate-300 font-semibold">Balance Receivable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-slate-300">Term Fee</td>
                      <td className="p-2 border border-slate-300">3550</td>
                      <td className="p-2 border border-slate-300">0</td>
                      <td className="p-2 border border-slate-300">3550</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300">Registration Fee</td>
                      <td className="p-2 border border-slate-300">8900</td>
                      <td className="p-2 border border-slate-300">0</td>
                      <td className="p-2 border border-slate-300">8900</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300">Uniforms</td>
                      <td className="p-2 border border-slate-300">2150</td>
                      <td className="p-2 border border-slate-300">0</td>
                      <td className="p-2 border border-slate-300">2150</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300">Tuition Fee</td>
                      <td className="p-2 border border-slate-300">5650</td>
                      <td className="p-2 border border-slate-300">0</td>
                      <td className="p-2 border border-slate-300">5650</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Term 2 Accordion */}
            <div className="border border-slate-300 rounded-sm">
              <div className="bg-[#f9f9f9] px-4 py-2 flex justify-between items-center cursor-pointer">
                <span className="font-semibold text-[13px] text-slate-700">Term 2</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-4 bg-white border-t border-slate-300">
                <div className="flex justify-between text-[13px] mb-4">
                  <div>Amount Term 2: <span className="font-bold">9200</span></div>
                  <div>Balance Amount Term 2: <span className="font-bold">9200</span></div>
                </div>
                <table className="w-full text-center text-[12px] border border-slate-300">
                  <thead className="bg-[#f2f2f2]">
                    <tr>
                      <th className="p-2 border border-slate-300 font-semibold">Fee Type</th>
                      <th className="p-2 border border-slate-300 font-semibold">Receivable Amount</th>
                      <th className="p-2 border border-slate-300 font-semibold">Received Till Date</th>
                      <th className="p-2 border border-slate-300 font-semibold">Balance Receivable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-slate-300">Term Fee</td>
                      <td className="p-2 border border-slate-300">3550</td>
                      <td className="p-2 border border-slate-300">0</td>
                      <td className="p-2 border border-slate-300">3550</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300">Tuition Fee</td>
                      <td className="p-2 border border-slate-300">5650</td>
                      <td className="p-2 border border-slate-300">0</td>
                      <td className="p-2 border border-slate-300">5650</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Online Payment History */}
            <div className="border border-slate-300 rounded-sm mt-4">
              <div className="bg-[#f9f9f9] px-4 py-2 border-b border-slate-300 flex justify-between items-center">
                <span className="font-semibold text-[13px] text-slate-700">≡ Online Payment History</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-4 bg-white text-[12px] text-slate-600">No Data available</div>
            </div>

            {/* GrayQuest Payment History */}
            <div className="border border-slate-300 rounded-sm mt-2">
              <div className="bg-[#f9f9f9] px-4 py-2 border-b border-slate-300 flex justify-between items-center">
                <span className="font-semibold text-[13px] text-slate-700">≡ GrayQuest Payment History</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-4 bg-white text-[12px] text-slate-600">No Data available</div>
            </div>
          </div>
        </div>

        <div className="bg-[#f2f2f2] px-6 py-4 border-t border-slate-300 rounded-b-sm">
          <Button onClick={onBack} className="bg-[#333] hover:bg-[#222] text-white h-8 px-6 text-[13px] shadow-none rounded-sm">
            Back
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── 3. NEW RECEIPT VIEW ──────────────────────────────────────────────────
function NewReceiptView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <h1 className="text-2xl font-normal text-slate-800 mb-4">New Receipt</h1>
      <div className="bg-white border border-slate-300 shadow-sm rounded-sm p-4">
        
        <div className="bg-[#f2f2f2] px-4 py-2 border border-slate-300 border-b-0 rounded-t-sm">
          <span className="font-semibold text-[13px] text-slate-700">≡ Add Receipts</span>
        </div>
        
        <div className="border border-slate-300 p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 text-[13px]">
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Student Name</span>
              <span className="text-slate-800 font-medium">Mahi Sachin Rathod</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Program</span>
              <span className="text-slate-800 font-medium">SUNOIA Senior</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Invoice Number</span>
              <span className="text-slate-800 font-medium">EK/3201/0052/2027</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Amount Term 1</span>
              <span className="text-slate-800 font-medium">20250.00</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Amount Term 2</span>
              <span className="text-slate-800 font-medium">9200.00</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Total Amount</span>
              <span className="text-slate-800 font-medium">29450.00</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Amount Received</span>
              <span className="text-slate-800 font-medium">0.00</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Balance Amount</span>
              <span className="text-slate-800 font-medium">29450.00</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <span className="text-slate-600 text-right pr-4">Minimum Amount</span>
              <span className="text-slate-800 font-medium">0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="grid grid-cols-[160px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Enter Receipt Amount</span>
              <Input className="h-8 text-[13px] border-slate-300 rounded-sm" />
            </div>
            <div className="grid grid-cols-[160px_1fr] items-center text-[13px]">
              <span className="text-slate-600 text-right pr-4">Confirm Receipt Amount</span>
              <Input className="h-8 text-[13px] border-slate-300 rounded-sm" />
            </div>
          </div>

          {/* Tables */}
          <div className="space-y-4">
            <div className="border border-slate-300">
              <div className="bg-[#f9f9f9] px-4 py-2 border-b border-slate-300 text-[12px] font-semibold text-slate-700">
                Term 1
              </div>
              <table className="w-full text-center text-[12px]">
                <thead className="bg-[#f2f2f2]">
                  <tr>
                    <th className="p-2 border-b border-r border-slate-300 font-semibold">Fee Type</th>
                    <th className="p-2 border-b border-r border-slate-300 font-semibold">Receivable Amount</th>
                    <th className="p-2 border-b border-r border-slate-300 font-semibold">Received Till Date</th>
                    <th className="p-2 border-b border-slate-300 font-semibold">Balance Receivable</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-r border-slate-300 border-b">Term Fee</td>
                    <td className="p-2 border-r border-slate-300 border-b">3550</td>
                    <td className="p-2 border-r border-slate-300 border-b">0</td>
                    <td className="p-2 border-slate-300 border-b">3550</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 border-b">Registration Fee</td>
                    <td className="p-2 border-r border-slate-300 border-b">8900</td>
                    <td className="p-2 border-r border-slate-300 border-b">0</td>
                    <td className="p-2 border-slate-300 border-b">8900</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 border-b">Uniforms</td>
                    <td className="p-2 border-r border-slate-300 border-b">2150</td>
                    <td className="p-2 border-r border-slate-300 border-b text-red-500 font-bold">* 0</td>
                    <td className="p-2 border-slate-300 border-b">2150</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300">Tuition Fee</td>
                    <td className="p-2 border-r border-slate-300">5650</td>
                    <td className="p-2 border-r border-slate-300">0</td>
                    <td className="p-2 border-slate-300">5650</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border border-slate-300">
              <div className="bg-[#f9f9f9] px-4 py-2 border-b border-slate-300 text-[12px] font-semibold text-slate-700">
                Term 2
              </div>
              <table className="w-full text-center text-[12px]">
                <thead className="bg-[#f2f2f2]">
                  <tr>
                    <th className="p-2 border-b border-r border-slate-300 font-semibold">Fee Type</th>
                    <th className="p-2 border-b border-r border-slate-300 font-semibold">Receivable Amount</th>
                    <th className="p-2 border-b border-r border-slate-300 font-semibold">Received Till Date</th>
                    <th className="p-2 border-b border-slate-300 font-semibold">Balance Receivable</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-r border-slate-300 border-b">Term Fee</td>
                    <td className="p-2 border-r border-slate-300 border-b">3550</td>
                    <td className="p-2 border-r border-slate-300 border-b">0</td>
                    <td className="p-2 border-slate-300 border-b">3550</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300">Tuition Fee</td>
                    <td className="p-2 border-r border-slate-300">5650</td>
                    <td className="p-2 border-r border-slate-300">0</td>
                    <td className="p-2 border-slate-300">5650</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4 border-t border-slate-300">
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-slate-700">Receipt Date</span>
              <Input type="date" className="h-8 text-[13px] border-slate-300 rounded-sm w-[200px]" />
            </div>
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-slate-700">Mode of Payment</span>
              <Select defaultValue="cash">
                <SelectTrigger className="h-8 text-[13px] border-slate-300 rounded-sm w-full bg-white">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button className="bg-[#0056b3] hover:bg-[#004494] text-white h-8 px-4 text-[13px] shadow-none rounded-sm font-semibold">
              Generate Receipt
            </Button>
            <Button onClick={onBack} className="bg-[#333] hover:bg-[#222] text-white h-8 px-6 text-[13px] shadow-none rounded-sm font-semibold">
              Cancel
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}

// ─── 4. OTHER RECEIPT VIEW ────────────────────────────────────────────────
function OtherReceiptView({ onBack }: { onBack: () => void }) {
  const feeTypes = [
    "Admission Form",
    "Cheque Bounce Charge",
    "Transfer Charges",
    "Transport Fees",
    "Winter Uniform",
    "Events and Celebrations Fees"
  ];

  return (
    <>
      <h1 className="text-2xl font-normal text-slate-800 mb-4">Other Receipt</h1>
      <div className="bg-white border border-slate-300 shadow-sm rounded-sm p-4">
        
        <div className="bg-[#f2f2f2] px-4 py-2 border border-slate-300 border-b-0 rounded-t-sm flex items-center gap-1">
          <span className="font-semibold text-[13px] text-slate-700">📝 Other Receipt</span>
        </div>
        
        <div className="border border-slate-300 p-6 space-y-6">
          
          <table className="w-full text-center text-[12px] border border-slate-300">
            <thead className="bg-[#f2f2f2]">
              <tr>
                <th className="p-3 border-b border-slate-300 font-semibold w-1/3">Fee Types</th>
                <th className="p-3 border-b border-slate-300 font-semibold w-1/3">Receipt Amount</th>
                <th className="p-3 border-b border-slate-300 font-semibold w-1/3">Confirm Receipt Amount</th>
              </tr>
            </thead>
            <tbody>
              {feeTypes.map((fee, idx) => (
                <tr key={idx}>
                  <td className="p-2 border-b border-slate-300 text-slate-700">{fee}</td>
                  <td className="p-2 border-b border-slate-300">
                    <Input className="h-7 text-[13px] border-slate-300 rounded-sm w-3/4 mx-auto" />
                  </td>
                  <td className="p-2 border-b border-slate-300">
                    <Input className="h-7 text-[13px] border-slate-300 rounded-sm w-3/4 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4 border-t border-slate-300">
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-slate-700">Receipt Date</span>
              <Input type="date" className="h-8 text-[13px] border-slate-300 rounded-sm w-[150px]" />
            </div>
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-slate-700">Mode of Payment</span>
              <Select defaultValue="cash">
                <SelectTrigger className="h-8 text-[13px] border-slate-300 rounded-sm w-full max-w-lg bg-white">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <span className="text-[12px] font-semibold text-slate-700">Select Academic Term</span>
              <Select defaultValue="term1">
                <SelectTrigger className="h-8 text-[13px] border-slate-300 rounded-sm w-[200px] bg-white">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term1">Term 1</SelectItem>
                  <SelectItem value="term2">Term 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button className="bg-[#0056b3] hover:bg-[#004494] text-white h-8 px-4 text-[13px] shadow-none rounded-sm font-semibold">
              Generate Receipt
            </Button>
            <Button onClick={onBack} className="bg-[#333] hover:bg-[#222] text-white h-8 px-6 text-[13px] shadow-none rounded-sm font-semibold">
              Cancel
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}
