import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid, ArrowDownUp, ArrowUp } from 'lucide-react';

const programs = [
  'Play Group',
  'Nursery',
  'SUNOIA Junior',
  'SUNOIA Senior',
  'Play Group',
  'Nursery',
  'DayCare',
  'Bridge SUNOIAJunior',
  'Bridge SUNOIASenior',
  'Teacher Training Program',
  'SUNOIATots'
];

export default function NameChangeConfirmationPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<Record<string, boolean>>({});

  const toggleProgram = (program: string) => {
    setSelectedPrograms(prev => ({
      ...prev,
      [program]: !prev[program]
    }));
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-2 space-y-4">
      <h1 className="text-[24px] font-normal text-[#333] mb-2">Name change confirmation</h1>
      
      <Button className="bg-[#0056b3] hover:bg-[#004494] text-white rounded-[3px] h-8 px-4 text-[13px] font-normal">
        Name Change Report
      </Button>
      
      <div className="bg-white border border-[#ccc] shadow-sm mb-6">
        <div className="p-2 border-b border-[#ccc] bg-[#f9f9f9]">
          <label className="flex items-center gap-2 text-[13px] text-[#333] cursor-pointer">
            <Checkbox 
              checked={isChecked} 
              onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              className="rounded-sm border-[#ccc]"
            />
            Graduation day name change confirmation
          </label>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-center border-collapse min-w-max">
            <thead>
              <tr className="bg-[#f9f9f9]">
                <th className="py-2 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[15%]">
                  Confirm
                </th>
                <th className="py-2 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[35%]">
                  Program Name
                </th>
                <th className="py-2 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[30%]">
                  Status
                </th>
                <th className="py-2 px-3 border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[20%]">
                  Report
                </th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program, idx) => (
                <tr key={program} className={idx % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}>
                  <td className="py-2 px-3 border-r border-b border-[#eee]">
                    <div className="flex justify-center">
                      <Checkbox 
                        checked={selectedPrograms[program] || false}
                        onCheckedChange={() => toggleProgram(program)}
                        className="rounded-[2px] border-[#ccc] w-3.5 h-3.5"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3 border-r border-b border-[#eee] text-[12px] text-[#333]">
                    {program}
                  </td>
                  <td className="py-2 px-3 border-r border-b border-[#eee] text-[12px] text-[#333]">
                    Not Confirmed
                  </td>
                  <td className="py-2 px-3 border-b border-[#eee] text-[12px] text-[#333]">
                    Show Report
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[#ccc] shadow-sm mb-6">
        
        {/* Table Top Toolbar */}
        <div className="p-2 border-b border-[#ccc]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#f9f9f9] border border-[#ccc] p-1.5 rounded-sm">
                <Grid className="w-4 h-4 text-slate-600" />
              </div>
              <label className="text-[13px] text-slate-600 flex items-center gap-2 relative">
                <span className="absolute left-2 text-[#999] bg-white px-1 -top-2 text-[10px]">Search</span>
                Search:
                <Input type="text" className="h-[28px] w-[200px] border-[#ccc] rounded-sm text-[13px] px-2" />
              </label>
            </div>
            
            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              Show 
              <Select defaultValue="10">
                <SelectTrigger className="h-[28px] w-[60px] border-[#ccc] rounded-sm text-[13px] px-2 bg-white">
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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-[#f9f9f9]">
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[12%]">
                  <div className="flex items-center justify-between">Admission Date <ArrowUp className="w-3 h-3 text-[#666]" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">
                  <div className="flex items-center justify-between">Program Name <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[12%]">
                  <div className="flex items-center justify-between">UIN <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">
                  <div className="flex items-center justify-between">Name as per Admission form <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">
                  <div className="flex items-center justify-between">Corrected name <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[15%]">
                  <div className="flex items-center justify-between">DOB As Per Admission Form <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
                <th className="py-2.5 px-3 border-b border-[#ccc] text-[13px] font-bold text-[#333] text-center w-[16%]">
                  <div className="flex items-center justify-between">Corrected Date Of Birth <ArrowDownUp className="w-3 h-3 text-[#999] opacity-50" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="py-4 text-center text-[13px] text-[#333] border-b border-[#ccc]">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-[#f9f9f9] p-2 flex justify-center border-t border-[#ccc]">
          <div className="flex border border-[#ccc] rounded-sm overflow-hidden text-[13px]">
            <button className="px-3 py-1 text-[#999] bg-[#f9f9f9] border-r border-[#ccc] cursor-not-allowed">First</button>
            <button className="px-3 py-1 text-[#999] bg-[#f9f9f9] border-r border-[#ccc] cursor-not-allowed">&larr; Previous</button>
            <button className="px-3 py-1 text-[#999] bg-[#f9f9f9] border-r border-[#ccc] cursor-not-allowed">Next &rarr;</button>
            <button className="px-3 py-1 text-[#337ab7] bg-white cursor-pointer hover:bg-[#eee]">Last</button>
          </div>
        </div>

      </div>

      <div>
        <Button className="bg-[#0056b3] hover:bg-[#004494] text-white rounded-[3px] h-8 px-5 text-[13px] font-normal">
          Confirm
        </Button>
      </div>

    </div>
  );
}
