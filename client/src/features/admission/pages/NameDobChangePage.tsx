import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import api from '@/api/client';

export default function NameDobChangePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const admissionId = searchParams.get('admissionId');

  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [reason, setReason] = useState('select');
  const [otherReason, setOtherReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Demo/pre-filled values
  const oldName = 'Mahi Sachin Rathod';
  const oldDob = '2021-03-15';

  const handleSave = async () => {
    if (!admissionId) {
      setError('No admission selected. Please go back and use Name Change from an admission.');
      return;
    }
    if (!newName.trim() && !newDob) {
      setError('Please enter at least a new name or new date of birth.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      const parts = newName.trim().split(' ');
      await api.put(`/admissions/${admissionId}/name-change`, {
        firstName: parts[0] || undefined,
        middleName: parts.length === 3 ? parts[1] : undefined,
        lastName: parts[parts.length - 1] || undefined,
        dateOfBirth: newDob || undefined,
      });
      setSuccess('Name/DOB updated successfully!');
      setTimeout(() => navigate('/admission'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update name/DOB');
      setTimeout(() => navigate('/admission'), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-2 space-y-4">
      <h1 className="text-[22px] font-normal text-[#333] mb-2">Name/Date of birth change</h1>

      {/* Red Banner */}
      <div className="bg-[#fde2e2] text-[#d9534f] text-[13px] font-bold px-4 py-2 rounded-sm border border-[#f5c6c6]">
        Name/Date of birth change can be done only once
      </div>

      <div className="bg-white border border-slate-300 shadow-sm rounded-sm">
        <div className="bg-[#f2f2f2] px-4 py-2 border-b border-slate-300 rounded-t-sm flex items-center">
          <span className="font-semibold text-[13px] text-slate-700">≡ Student Name Change</span>
        </div>

        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-[13px] rounded-sm">{success}</div>}
          {!admissionId && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[13px] rounded-sm">
              Demo mode: No admission ID provided. Use Name Change button from the Admission list.
            </div>
          )}

          <div className="max-w-4xl space-y-5">
            <div className="flex items-center gap-4">
              <Label className="text-right text-[13px] text-slate-700 font-normal w-[160px]">Student Name Old</Label>
              <Input type="text" value={oldName} className="h-8 text-[13px] border-slate-300 rounded-sm bg-[#f5f5f5] max-w-[400px]" readOnly />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-right text-[13px] text-slate-700 font-normal w-[160px]">Full Name of the Child</Label>
              <Input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter new full name" className="h-8 text-[13px] border-slate-300 rounded-sm max-w-[400px]" />
              <span className="text-[13px] text-slate-500">(As to be printed on Graduation Certificate)</span>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-right text-[13px] text-slate-700 font-normal w-[160px]">Old Date Of Birth</Label>
              <Input type="date" value={oldDob} className="h-8 text-[13px] border-slate-300 rounded-sm bg-[#f5f5f5] w-[180px]" readOnly />
              <Label className="text-right text-[13px] text-slate-700 font-normal ml-8 mr-2">New Date Of Birth</Label>
              <Input type="date" value={newDob} onChange={(e) => setNewDob(e.target.value)} className="h-8 text-[13px] border-slate-300 rounded-sm w-[180px]" />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-right text-[13px] text-slate-700 font-normal w-[160px]">Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-8 text-[13px] border-slate-300 rounded-sm w-[180px]"><SelectValue placeholder="--Select--" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">--Select--</SelectItem>
                  <SelectItem value="spelling">Spelling Error</SelectItem>
                  <SelectItem value="legal">Legal Name Change</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Label className="text-right text-[13px] text-slate-700 font-normal ml-8 mr-2">Other</Label>
              <Input type="text" value={otherReason} onChange={(e) => setOtherReason(e.target.value)} disabled={reason !== 'other'} className="h-8 text-[13px] border-slate-300 rounded-sm bg-[#f5f5f5] w-[250px] disabled:opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-[#f9f9f9] px-6 py-4 border-t border-slate-300 rounded-b-sm flex items-center gap-2">
          <div className="w-[160px]"></div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#0056b3] hover:bg-[#004494] text-white h-8 px-6 text-[13px] shadow-none rounded-sm font-medium">
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={() => navigate(-1)} className="bg-[#333] hover:bg-[#222] text-white h-8 px-6 text-[13px] shadow-none rounded-sm font-medium">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
