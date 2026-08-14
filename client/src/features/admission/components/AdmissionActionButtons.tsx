import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileEdit, Banknote, CreditCard, Forward, X, Plane, Pen, Info } from 'lucide-react';

interface AdmissionActionButtonsProps {
  id: string;
}

export function AdmissionActionButtons({ id }: AdmissionActionButtonsProps) {
  return (
    <div className="flex flex-col gap-1 w-[80px]">
      {/* Row 1 */}
      <div className="flex items-center justify-between relative">
        <Link to={`/admissions/${id}/edit`}>
          <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-slate-200 rounded-none" title="Update Admission">
            <FileEdit className="h-[14px] w-[14px] text-black stroke-[2.5]" />
          </Button>
        </Link>
        <div className="w-[1px] h-[14px] bg-slate-300"></div>
        <Link to={`/admissions/${id}/receipt`}>
          <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-slate-200 rounded-none" title="View/Add Receipts">
            <Banknote className="h-[14px] w-[14px] text-black stroke-[2.5]" />
          </Button>
        </Link>
      </div>

      {/* Row 2 */}
      <div className="flex items-center justify-between relative">
        <Link to={`/fees/add-receipt`}>
          <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-slate-200 rounded-none" title="Add Online Payment">
            <CreditCard className="h-[14px] w-[14px] text-black stroke-[2.5]" />
          </Button>
        </Link>
        <div className="w-[1px] h-[14px] bg-slate-300"></div>
        <Link to={`/transfer-out`}>
          <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-slate-200 rounded-none" title="Transfer Student">
            <Forward className="h-[14px] w-[14px] text-black stroke-[2.5]" />
          </Button>
        </Link>
      </div>

      {/* Row 3 */}
      <div className="flex items-center justify-between relative pl-1">
        <div className="w-[1px] h-[14px] bg-slate-300 absolute left-0"></div>
        <Link to={`/quit-admission`}>
          <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-slate-200 rounded-none" title="Quit Admission">
            <X className="h-[14px] w-[14px] text-black stroke-[3.5]" />
          </Button>
        </Link>
        <div className="w-[1px] h-[14px] bg-slate-300"></div>
        <Link to={`/transfers/manage`}>
          <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-slate-200 rounded-none" title="Relocation/Transfer">
            <Plane className="h-[14px] w-[14px] text-black stroke-[2.5]" />
          </Button>
        </Link>
      </div>

      {/* Row 4 */}
      <div className="flex items-center justify-between relative pl-1">
        <div className="w-[1px] h-[14px] bg-slate-300 absolute left-0"></div>
        <Link to={`/name-change`}>
          <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-slate-200 rounded-none" title="Name/DOB Change">
            <Pen className="h-[14px] w-[14px] text-black stroke-[2.5]" />
          </Button>
        </Link>
        <div className="w-[1px] h-[14px] bg-slate-300"></div>
        <Link to={`/franchisee/royalty-forecast`}>
          <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-slate-200 rounded-none" title="Forecasted Royalty">
            <Info className="h-[14px] w-[14px] text-black stroke-[2.5]" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
