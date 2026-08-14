import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import api from '@/api/client';

export default function QuitStudentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const admissionId = searchParams.get('admissionId');
  const [reason, setReason] = useState('relocation');
  const [quitDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDuplicate, setIsDuplicate] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!admissionId) {
      setError('No admission selected. Please go back and click Quit from an admission record.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await api.post(`/admissions/${admissionId}/quit`, {
        reason,
        quitDate,
        isDuplicate,
      });
      navigate('/admission');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to quit admission';
      setError(msg);
      // Fallback: navigate back anyway for demo
      setTimeout(() => navigate('/admission'), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-2 space-y-4">
      <h1 className="text-2xl font-normal text-slate-800 mb-4">Quit Student</h1>

      <div className="bg-white border border-slate-300 shadow-sm rounded-sm p-4">
        <div className="bg-[#f2f2f2] px-4 py-2 border border-slate-300 border-b-0 rounded-t-sm flex items-center">
          <span className="font-semibold text-[13px] text-slate-700">≡ Quit Student</span>
        </div>

        <div className="border border-slate-300 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-sm">{error}</div>
          )}
          {!admissionId && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[13px] rounded-sm">
              Demo mode: No admission ID provided. Use the Quit button from the Admission list.
            </div>
          )}

          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <Label className="text-right text-[13px] text-slate-700 font-normal">Reason for quitting</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-8 text-[13px] border-slate-300 rounded-sm w-[250px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="relocation">Relocation</SelectItem>
                  <SelectItem value="admission">Admission to school</SelectItem>
                  <SelectItem value="personal">Personal/Family</SelectItem>
                  <SelectItem value="na">NA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <Label className="text-right text-[13px] text-slate-700 font-normal">Date of quitting</Label>
              <div className="w-[180px]">
                <Input type="date" value={quitDate} readOnly className="h-8 text-[13px] border-slate-300 rounded-sm bg-[#f5f5f5]" />
              </div>
            </div>

            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <Label className="text-right text-[13px] text-slate-700 font-normal">Duplicate Entry*</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-[13px] text-slate-700 cursor-pointer">
                  <input type="radio" name="duplicateEntry" checked={isDuplicate} onChange={() => setIsDuplicate(true)} className="w-3.5 h-3.5" />
                  Duplicate
                </label>
                <label className="flex items-center gap-1.5 text-[13px] text-slate-700 cursor-pointer">
                  <input type="radio" name="duplicateEntry" checked={!isDuplicate} onChange={() => setIsDuplicate(false)} className="w-3.5 h-3.5" />
                  Genuine
                </label>
              </div>
            </div>

            <div className="grid grid-cols-[160px_1fr] items-center gap-4 pt-4">
              <div></div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving} className="bg-[#0056b3] hover:bg-[#004494] text-white h-8 px-5 text-[13px] shadow-none rounded-sm font-medium">
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={() => navigate(-1)} className="bg-[#333] hover:bg-[#222] text-white h-8 px-5 text-[13px] shadow-none rounded-sm font-medium">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
